import nock from 'nock';
import EventEmitter from 'eventemitter3';

import { OID4VCIService, OID4VCIServiceEventChannel } from '../OID4VCIService';
import { OID4VCIServiceImpl } from '../OID4VCIServiceImpl';
import { ServiceResponseStatus } from '../types';

import {
  authorizationServerMetadataRef1,
  credentialIssuerMetadataRef1,
  credentialOfferObjectRef1,
  jwtIssuerMetadataRef1,
  encodeCredentialOffer,
  nockReplyWithMetadataRef1,
} from '../../core/__tests__/fixtures';
import { InvalidCredentialOffer, OID4VCIServiceError } from '../errors';

describe('OID4VCIServiceImpl', () => {
  const eventBus = new EventEmitter();
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

    service
      .getEventBus()
      .on(OID4VCIServiceEventChannel.SendCredentialOffer, callback);

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
        discoveryMetadata: {
          credentialIssuerMetadata: credentialIssuerMetadataRef1,
          authorizationServerMetadata: authorizationServerMetadataRef1,
          jwtIssuerMetadata: jwtIssuerMetadataRef1,
        },
      },
    });
  });

  it('should channel back errors', async () => {
    const credentialOffer = 'invalid-credential-offer';

    const callback = jest.fn(() => {
      eventBus.emit('complete');
    });

    service
      .getEventBus()
      .on(OID4VCIServiceEventChannel.SendCredentialOffer, callback);

    service.resolveCredentialOffer({ credentialOffer });

    // Wait for callback completion
    await new Promise((resolve) => {
      eventBus.once('complete', resolve);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      status: ServiceResponseStatus.Error,
      payload: new OID4VCIServiceError(
        InvalidCredentialOffer.MissingQueryString
      ),
    });
  });
});
