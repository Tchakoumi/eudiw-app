import nock from 'nock';

import { eventBus } from '@datev/event-bus';
import { SdJwtCredentialProcessor } from '../../core/SdJwtCredentialProcessor';
import { DBConnection } from '../../database/DBConnection';
import { credentialStoreName, identityStoreName } from '../../database/schema';
import { OID4VCIService, OID4VCIServiceEventChannel } from '../OID4VCIService';
import { OID4VCIServiceImpl } from '../OID4VCIServiceImpl';
import { InvalidCredentialOffer } from '../errors';

import {
  DisplayCredential,
  ServiceResponse,
  ServiceResponseStatus,
} from '../types';

import {
  credentialContentObjRef3,
  credentialHeaderObjRef2,
  credentialOfferObjectRef1,
  credentialResponseRef1,
  discoveryMetadataRef1,
  encodeCredentialOffer,
  jwksRef1,
  nockReplyWithMetadataRef1,
  sdJwtProcessedCredentialObjRef1,
  sdJwtProcessedCredentialObjRef3,
  tokenResponseRef1,
} from '../../core/__tests__/fixtures';

describe('OID4VCIServiceImpl', () => {
  const storage = DBConnection.getStorage();
  const service: OID4VCIService = new OID4VCIServiceImpl(eventBus);
  const sdJwtCredentialProcessor = new SdJwtCredentialProcessor(storage);

  beforeAll(async () => {
    nock.disableNetConnect();
  });

  beforeEach(async () => {
    nock.cleanAll();
    await storage.clear(credentialStoreName);
    await storage.clear(identityStoreName);
  });

  it('should resolve credential offer', async () => {
    const credentialOffer = `?credential_offer=${encodeCredentialOffer(
      credentialOfferObjectRef1
    )}`;

    const scope = nock(/./);
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

    nock(/./)
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
    expect((response.payload as DisplayCredential).claims).toEqual({
      birthdate: '1991-11-06',
      family_name: 'Silverstone',
      given_name: 'Inga',
    });
  });

  it('should channel back errors (credential issuance request)', async () => {
    const credentialOffer = credentialOfferObjectRef1;
    const discoveryMetadata = discoveryMetadataRef1;
    const credentialTypeKey = 'IdentityCredential';

    nock(/./).post(/token/).reply(401);

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

  it('should retrieve successfully one credential header ', async () => {
    await sdJwtCredentialProcessor.storeCredential(
      sdJwtProcessedCredentialObjRef1
    );

    const callback = jest.fn(() => {
      eventBus.emit('complete');
    });

    eventBus.on(OID4VCIServiceEventChannel.RetrieveCredentialHeaders, callback);
    service.retrieveCredentialHeaders();

    // Wait for callback completion
    await new Promise((resolve) => {
      eventBus.once('complete', resolve);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      status: ServiceResponseStatus.Success,
      payload: credentialHeaderObjRef2.map((credentialHeader) => ({
        ...credentialHeader,
        id: expect.any(Number),
      })),
    });
  });

  it('should retrieve successfully one credential details ', async () => {
    const storedCredential = await sdJwtCredentialProcessor.storeCredential(
      sdJwtProcessedCredentialObjRef3
    );

    const callback = jest.fn(() => {
      eventBus.emit('complete');
    });

    eventBus.on(OID4VCIServiceEventChannel.RetrieveCredentialDetails, callback);
    service.retrieveCredentialDetails(storedCredential.display.id as number);

    // Wait for callback completion
    await new Promise((resolve) => {
      eventBus.once('complete', resolve);
    });

    // Dynamically adjust the expected payload with the correct id
    const expectedPayload = {
      ...credentialContentObjRef3, // Assuming credentialContentObjRef3 is an array with the expected object
      id: storedCredential.display.id, // Set the dynamic id correctly
    };
    expect(callback).toHaveBeenCalledTimes(1);
    // Use the captured `expectedId` in your assertion to match against the dynamically assigned ID
    expect(callback).toHaveBeenCalledWith({
      status: ServiceResponseStatus.Success,
      payload: expectedPayload, // Use the dynamically adjusted expected object
    });
  });

  it('should successfully delete a credential and emit an event', async () => {
    const storedCredential = await sdJwtCredentialProcessor.storeCredential(
      sdJwtProcessedCredentialObjRef3
    );

    const deleteCallback = jest.fn(() => {
      eventBus.emit('complete');
    });

    eventBus.on(OID4VCIServiceEventChannel.DeleteCredential, deleteCallback);

    service.deleteCredential(storedCredential.display.id as IDBValidKey);

    await new Promise((resolve) => {
      eventBus.once('complete', resolve);
    });

    expect(deleteCallback).toHaveBeenCalledTimes(1);
    expect(deleteCallback).toHaveBeenCalledWith({
      status: ServiceResponseStatus.Success,
      payload: `Credential with key ${storedCredential.display.id} successfully deleted.`,
    });
  });
});
