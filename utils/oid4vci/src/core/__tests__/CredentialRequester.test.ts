import nock from 'nock';

import { credentialStoreName } from '../../lib/schemas/CredentialDBSchema';
import { DiscoveryMetadata, PRE_AUTHORIZED_GRANT_TYPE } from '../../lib/types';
import { CredentialRequester } from '../CredentialRequester';
import { IdentityProofGenerator } from '../IdentityProofGenerator';

import {
  credentialOfferObjectRef1,
  discoveryMetadataRef1,
  storage,
  credentialResponseRef1,
  jwksRef1,
  credentialResponseRef2,
  jwksRef2,
} from './fixtures';

describe('CredentialRequester', () => {
  const identityProofGenerator = new IdentityProofGenerator();
  const credentialRequester = new CredentialRequester(
    identityProofGenerator,
    storage
  );

  beforeAll(async () => {
    nock.disableNetConnect();
  });

  beforeEach(async () => {
    nock.cleanAll();
  });

  it('should successfully request a credential (fetching verifying keys)', async () => {
    const credentialOffer = credentialOfferObjectRef1;
    const discoveryMetadata = discoveryMetadataRef1;
    const credentialTypeKey = 'IdentityCredential';

    nock(credentialOffer.credential_issuer)
      .post(/credential/)
      .reply(200, credentialResponseRef1)
      .get(/jwks/)
      .reply(200, jwksRef1);

    const credential = await credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      PRE_AUTHORIZED_GRANT_TYPE
    );

    const stored = await storage.findOne(
      credentialStoreName,
      credential.id as IDBValidKey
    );

    expect(credential).toEqual(stored?.value.display);
  });

  it('should successfully request a credential (reading verifying keys from metadata)', async () => {
    const credentialTypeKey = 'IdentityCredential';
    const credentialOffer = credentialOfferObjectRef1;

    const discoveryMetadata = {
      ...discoveryMetadataRef1,
      jwtIssuerMetadata: {
        issuer: credentialOffer.credential_issuer,
        jwks: jwksRef1,
      },
    } satisfies DiscoveryMetadata;

    nock(credentialOffer.credential_issuer)
      .post(/credential/)
      .reply(200, credentialResponseRef1);

    const credential = await credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      PRE_AUTHORIZED_GRANT_TYPE
    );

    const stored = await storage.findOne(
      credentialStoreName,
      credential.id as IDBValidKey
    );

    expect(credential).toEqual(stored?.value.display);
  });

  it('should successfully request a credential (no kid in credential payload)', async () => {
    const credentialTypeKey = 'IdentityCredential';
    const credentialOffer = credentialOfferObjectRef1;

    const discoveryMetadata = {
      ...discoveryMetadataRef1,
      jwtIssuerMetadata: {
        issuer: credentialOffer.credential_issuer,
        jwks: jwksRef2,
      },
    } satisfies DiscoveryMetadata;

    nock(credentialOffer.credential_issuer)
      .post(/credential/)
      .reply(200, credentialResponseRef2);

    await credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      PRE_AUTHORIZED_GRANT_TYPE
    );
  });

  it('should throw on missing verifying key', async () => {
    const credentialTypeKey = 'IdentityCredential';
    const credentialOffer = credentialOfferObjectRef1;

    const discoveryMetadata = {
      ...discoveryMetadataRef1,
      jwtIssuerMetadata: {
        issuer: credentialOffer.credential_issuer,
        jwks: { keys: [] },
      },
    } satisfies DiscoveryMetadata;

    nock(credentialOffer.credential_issuer)
      .post(/credential/)
      .reply(200, credentialResponseRef1);

    const promise = credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      PRE_AUTHORIZED_GRANT_TYPE
    );

    await expect(promise).rejects.toThrow(
      'Could find referenced verifying key.'
    );
  });

  it('should throw on validation error', async () => {
    const credentialTypeKey = 'IdentityCredential';
    const credentialOffer = credentialOfferObjectRef1;

    const discoveryMetadata = {
      ...discoveryMetadataRef1,
      jwtIssuerMetadata: {
        issuer: credentialOffer.credential_issuer,
        jwks: {
          keys: [
            // This key cannot validate `credentialResponseRef2`
            jwksRef2.keys[0],
          ],
        },
      },
    } satisfies DiscoveryMetadata;

    nock(credentialOffer.credential_issuer)
      .post(/credential/)
      .reply(200, credentialResponseRef2);

    const promise = credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      PRE_AUTHORIZED_GRANT_TYPE
    );

    await expect(promise).rejects.toThrow('Could not validate credential.');
  });

  it('should throw on unsupported credential format', async () => {
    const credentialOffer = credentialOfferObjectRef1;
    const discoveryMetadata = discoveryMetadataRef1;
    const credentialTypeKey = 'org.iso.18013.5.1.mDL';

    nock(credentialOffer.credential_issuer)
      .post(/credential/)
      .reply(200, credentialResponseRef1)
      .get(/jwks/)
      .reply(200, jwksRef1);

    const promise = credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      PRE_AUTHORIZED_GRANT_TYPE
    );

    await expect(promise).rejects.toThrow(
      'Unsupported credential type format.'
    );
  });

  it('should throw on credential issuer error', async () => {
    const credentialOffer = credentialOfferObjectRef1;
    const discoveryMetadata = discoveryMetadataRef1;
    const credentialTypeKey = 'IdentityCredential';

    nock(credentialOffer.credential_issuer)
      .post(/credential/)
      .reply(401);

    const promise = credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      PRE_AUTHORIZED_GRANT_TYPE
    );

    await expect(promise).rejects.toThrow('401 Unauthorized');
  });
});
