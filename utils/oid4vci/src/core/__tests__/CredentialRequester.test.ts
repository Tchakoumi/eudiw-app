import nock from 'nock';

import { credentialStoreName } from '../../lib/schemas/CredentialDBSchema';
import { DiscoveryMetadata, PRE_AUTHORIZED_GRANT_TYPE } from '../../lib/types';
import { CredentialRequester } from '../CredentialRequester';

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
  const credentialRequester = new CredentialRequester(storage);

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

    const discoveryMetadata: DiscoveryMetadata = {
      ...discoveryMetadataRef1,
      jwtIssuerMetadata: {
        issuer: credentialOffer.credential_issuer,
        jwks: jwksRef1,
      },
    };

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

    const discoveryMetadata: DiscoveryMetadata = {
      ...discoveryMetadataRef1,
      jwtIssuerMetadata: {
        issuer: credentialOffer.credential_issuer,
        jwks: jwksRef2,
      },
    };

    nock(credentialOffer.credential_issuer)
      .post(/credential/)
      .reply(200, credentialResponseRef2);

    await credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      PRE_AUTHORIZED_GRANT_TYPE
    );
  });

  it('should resolve logos to base64', async () => {
    const credentialOffer = credentialOfferObjectRef1;
    const credentialTypeKey = 'IdentityCredential';

    if (!discoveryMetadataRef1.credentialIssuerMetadata) throw 'unreachable';
    const discoveryMetadata: DiscoveryMetadata = {
      ...discoveryMetadataRef1,
      credentialIssuerMetadata: {
        ...discoveryMetadataRef1.credentialIssuerMetadata,
        display: [
          {
            locale: 'en-US',
            name: 'Authlete',
            logo: {
              url: `${credentialOffer.credential_issuer}/logo`,
            },
          },
        ],
      },
    };

    nock(credentialOffer.credential_issuer)
      .post(/credential/)
      .reply(200, credentialResponseRef1)
      .get(/jwks/)
      .reply(200, jwksRef1)
      .get(/logo/)
      .replyWithFile(200, __dirname + '/fixtures/images/icon.jpg', {
        'Content-Type': 'image/jpeg',
      });

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
    expect(credential.issuer).toEqual('Authlete');
    expect(credential.logo?.startsWith('data:image/jpeg;base64')).toBe(true);
  });

  it('should throw on missing verifying key', async () => {
    const credentialTypeKey = 'IdentityCredential';
    const credentialOffer = credentialOfferObjectRef1;

    const discoveryMetadata: DiscoveryMetadata = {
      ...discoveryMetadataRef1,
      jwtIssuerMetadata: {
        issuer: credentialOffer.credential_issuer,
        jwks: { keys: [] },
      },
    };

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

    const discoveryMetadata: DiscoveryMetadata = {
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
    };

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

    await expect(promise).rejects.toThrow(
      'CredentialIssuerError: 401 Unauthorized'
    );
  });

  it('should throw on unsupported grant type', async () => {
    const credentialOffer = credentialOfferObjectRef1;
    const discoveryMetadata = discoveryMetadataRef1;
    const credentialTypeKey = 'IdentityCredential';

    const promise = credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      'authorization_code'
    );

    await expect(promise).rejects.toThrow(
      'There is only support for the Pre-Authorized Code flow.'
    );
  });

  it('should throw on missing discovery metadata', async () => {
    const credentialOffer = credentialOfferObjectRef1;
    const credentialTypeKey = 'IdentityCredential';

    const promise = credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata: undefined },
      { credentialTypeKey },
      PRE_AUTHORIZED_GRANT_TYPE
    );

    await expect(promise).rejects.toThrow(
      'Cannot proceed without discovery metadata.'
    );
  });

  it('should throw on missing configuration metadata for selected credential type', async () => {
    const credentialOffer = credentialOfferObjectRef1;
    const discoveryMetadata = discoveryMetadataRef1;
    const credentialTypeKey = 'InvalidKey';

    const promise = credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      PRE_AUTHORIZED_GRANT_TYPE
    );

    await expect(promise).rejects.toThrow(
      'Configuration metadata for selected credential type not found.'
    );
  });

  it('should throw on encrypted credential response required', async () => {
    const credentialOffer = credentialOfferObjectRef1;
    const credentialTypeKey = 'IdentityCredential';

    const discoveryMetadata: DiscoveryMetadata = JSON.parse(
      JSON.stringify(discoveryMetadataRef1)
    );

    const credentialResponseEncryption =
      discoveryMetadata.credentialIssuerMetadata
        ?.credential_response_encryption;
    if (!credentialResponseEncryption) throw 'unreachable';
    credentialResponseEncryption.encryption_required = true;

    const promise = credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      PRE_AUTHORIZED_GRANT_TYPE
    );

    await expect(promise).rejects.toThrow(
      'No support for credential response encryption.'
    );
  });

  it('should throw on missing JWKS URI', async () => {
    const credentialOffer = credentialOfferObjectRef1;
    const credentialTypeKey = 'IdentityCredential';

    if (!discoveryMetadataRef1.authorizationServerMetadata) throw 'unreachable';
    const discoveryMetadata: DiscoveryMetadata = {
      ...discoveryMetadataRef1,
      authorizationServerMetadata: {
        ...discoveryMetadataRef1.authorizationServerMetadata,
        jwks_uri: undefined,
      },
      jwtIssuerMetadata: undefined,
    };

    nock(credentialOffer.credential_issuer)
      .post(/credential/)
      .reply(200, credentialResponseRef1);

    const promise = credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      PRE_AUTHORIZED_GRANT_TYPE
    );

    await expect(promise).rejects.toThrow(
      'Could not find a URI to retrieve issuer verifying keys from.'
    );
  });

  it('should throw on failure to fetch verifying keys', async () => {
    const credentialOffer = credentialOfferObjectRef1;
    const discoveryMetadata = discoveryMetadataRef1;
    const credentialTypeKey = 'IdentityCredential';

    nock(credentialOffer.credential_issuer)
      .post(/credential/)
      .reply(200, credentialResponseRef1)
      .get(/jwks/)
      .reply(404);

    const promise = credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      PRE_AUTHORIZED_GRANT_TYPE
    );

    await expect(promise).rejects.toThrow(
      'Could not retrieve issuer verifying keys.'
    );
  });
});
