import nock from 'nock';

import { eventBus } from '@datev/event-bus';
import { OID4VCIService, OID4VCIServiceEventChannel } from '../OID4VCIService';
import { OID4VCIServiceImpl } from '../OID4VCIServiceImpl';
import { InvalidCredentialOffer } from '../errors';
import { ServiceResponse, ServiceResponseStatus } from '../types';

import {
  credentialOfferObjectRef1,
  encodeCredentialOffer,
  nockReplyWithMetadataRef1,
  discoveryMetadataRef1,
  credentialResponseRef1,
  jwksRef1,
  tokenResponseRef1,
} from '../../core/__tests__/fixtures';

// Mocking indexdedDB functionality
import 'core-js/stable/structured-clone';
import 'fake-indexeddb/auto';

describe('OID4VCIServiceImpl', () => {
  const service: OID4VCIService = new OID4VCIServiceImpl(eventBus);

  beforeAll(async () => {
    nock.disableNetConnect();
  });

  beforeEach(async () => {
    nock.cleanAll();
  });

  it('should resolve credential offer', async () => {
    const credentialOffer = `?credential_offer=${encodeCredentialOffer(
      credentialOfferObjectRef1
    )}`;

    const scope = nock(credentialOfferObjectRef1.credential_issuer);
    nockReplyWithMetadataRef1(scope);

    const callback = jest.fn(() => {
      eventBus.emit('complete');
    });

    eventBus.on(OID4VCIServiceEventChannel.ProcessCredentialOffer, callback);
    service.resolveCredentialOffer({ credentialOffer });

    // Wait for callback completion
    await new Promise((resolve) => {
      eventBus.once('complete', resolve);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      status: ServiceResponseStatus.Success,
      payload: {
        credentialOffer: credentialOfferObjectRef1,
        discoveryMetadata: discoveryMetadataRef1,
      },
    });
  });

  it('should channel back errors (credential offer resolution)', async () => {
    const credentialOffer = 'invalid-credential-offer';

    const callback = jest.fn(() => {
      eventBus.emit('complete');
    });

    eventBus.on(OID4VCIServiceEventChannel.ProcessCredentialOffer, callback);
    service.resolveCredentialOffer({ credentialOffer });

    // Wait for callback completion
    await new Promise((resolve) => {
      eventBus.once('complete', resolve);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      status: ServiceResponseStatus.Error,
      payload: `Error: OID4VCIServiceError: ${InvalidCredentialOffer.MissingQueryString}`,
    });
  });

  it('should successfully request credential', async () => {
    const credentialOffer = credentialOfferObjectRef1;
    const discoveryMetadata = discoveryMetadataRef1;
    const credentialTypeKey = 'IdentityCredential';

    nock(credentialOffer.credential_issuer)
      .post(/token/)
      .reply(200, tokenResponseRef1)
      .post(/credential/)
      .reply(200, credentialResponseRef1)
      .get(/jwks/)
      .reply(200, jwksRef1);

    let response: ServiceResponse | undefined = undefined;
    const callback = jest.fn((data) => {
      response = data;
      eventBus.emit('complete');
    });

    eventBus.on(OID4VCIServiceEventChannel.CredentialProposition, callback);
    service.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey }
    );

    // Wait for callback completion
    await new Promise((resolve) => {
      eventBus.once('complete', resolve);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(response).toBeDefined();
    response = response as unknown as ServiceResponse;
    expect(response.status).toEqual(ServiceResponseStatus.Success);
    expect(response.payload.id).toEqual(1);
  });

  it('should channel back errors (credential issuance request)', async () => {
    const credentialOffer = credentialOfferObjectRef1;
    const discoveryMetadata = discoveryMetadataRef1;
    const credentialTypeKey = 'IdentityCredential';

    nock(credentialOffer.credential_issuer).post(/token/).reply(401);

    const callback = jest.fn(() => {
      eventBus.emit('complete');
    });

    eventBus.on(OID4VCIServiceEventChannel.CredentialProposition, callback);
    service.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey }
    );

    // Wait for callback completion
    await new Promise((resolve) => {
      eventBus.once('complete', resolve);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      status: ServiceResponseStatus.Error,
      payload: 'Error: OID4VCIServiceError: Could not obtain an access token.',
    });
  });
});
