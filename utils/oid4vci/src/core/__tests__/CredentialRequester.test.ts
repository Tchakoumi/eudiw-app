import nock from 'nock';

import { credentialStoreName, identityStoreName } from '../../schema';
import { DiscoveryMetadata, GrantType } from '../../lib/types';
import { CredentialRequester } from '../CredentialRequester';

import {
  configClient,
  storage,
  jwksRef1,
  jwksRef2,
  tokenResponseRef1,
  discoveryMetadataRef1,
  credentialResponseRef1,
  credentialResponseRef2,
  credentialOfferObjectRef1,
} from './fixtures';

describe('CredentialRequester', () => {
  const credentialRequester = new CredentialRequester(configClient, storage);

  beforeAll(async () => {
    nock.disableNetConnect();
  });

  beforeEach(async () => {
    nock.cleanAll();
  });

  afterAll(async () => {
    await Promise.all([
      storage.clear(credentialStoreName),
      storage.clear(identityStoreName),
    ]);
  });

  it('should successfully request a credential (fetching verifying keys)', async () => {
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

    const credential = await credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      GrantType.PRE_AUTHORIZED_CODE
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

    nock(/./)
      .post(/token/)
      .reply(200, tokenResponseRef1)
      .post(/credential/)
      .reply(200, credentialResponseRef1);

    const credential = await credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      GrantType.PRE_AUTHORIZED_CODE
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

    nock(/./)
      .post(/token/)
      .reply(200, tokenResponseRef1)
      .post(/credential/)
      .reply(200, credentialResponseRef2);

    await credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      GrantType.PRE_AUTHORIZED_CODE
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

    nock(/./)
      .post(/token/)
      .reply(200, tokenResponseRef1)
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
      GrantType.PRE_AUTHORIZED_CODE
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

    nock(/./)
      .post(/token/)
      .reply(200, tokenResponseRef1)
      .post(/credential/)
      .reply(200, credentialResponseRef1);

    const promise = credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      GrantType.PRE_AUTHORIZED_CODE
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

    nock(/./)
      .post(/token/)
      .reply(200, tokenResponseRef1)
      .post(/credential/)
      .reply(200, credentialResponseRef2);

    const promise = credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      GrantType.PRE_AUTHORIZED_CODE
    );

    await expect(promise).rejects.toThrow('Could not validate credential.');
  });

  it('should throw on unsupported credential format', async () => {
    const credentialOffer = credentialOfferObjectRef1;
    const discoveryMetadata = discoveryMetadataRef1;
    const credentialTypeKey = 'org.iso.18013.5.1.mDL';

    nock(/./)
      .post(/token/)
      .reply(200, tokenResponseRef1)
      .post(/credential/)
      .reply(200, credentialResponseRef1)
      .get(/jwks/)
      .reply(200, jwksRef1);

    const promise = credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      GrantType.PRE_AUTHORIZED_CODE
    );

    await expect(promise).rejects.toThrow(
      'Unsupported credential type format.'
    );
  });

  it('should throw on credential issuer error', async () => {
    const credentialOffer = credentialOfferObjectRef1;
    const discoveryMetadata = discoveryMetadataRef1;
    const credentialTypeKey = 'IdentityCredential';

    nock(/./)
      .post(/token/)
      .reply(200, tokenResponseRef1)
      .post(/credential/)
      .reply(401);

    const promise = credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      GrantType.PRE_AUTHORIZED_CODE
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
      GrantType.AUTHORIZATION_CODE
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
      GrantType.PRE_AUTHORIZED_CODE
    );

    await expect(promise).rejects.toThrow(
      'Cannot proceed without discovery metadata.'
    );
  });

  it('should throw on missing configuration metadata for selected credential type', async () => {
    const credentialOffer = credentialOfferObjectRef1;
    const discoveryMetadata = discoveryMetadataRef1;
    const credentialTypeKey = 'InvalidKey';

    nock(/./).post(/token/).reply(200, tokenResponseRef1);

    const promise = credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      GrantType.PRE_AUTHORIZED_CODE
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

    nock(/./).post(/token/).reply(200, tokenResponseRef1);

    const promise = credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      GrantType.PRE_AUTHORIZED_CODE
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

    nock(/./)
      .post(/token/)
      .reply(200, tokenResponseRef1)
      .post(/credential/)
      .reply(200, credentialResponseRef1);

    const promise = credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      GrantType.PRE_AUTHORIZED_CODE
    );

    await expect(promise).rejects.toThrow(
      'Could not find a URI to retrieve issuer verifying keys from.'
    );
  });

  it('should throw on failure to fetch verifying keys', async () => {
    const credentialOffer = credentialOfferObjectRef1;
    const discoveryMetadata = discoveryMetadataRef1;
    const credentialTypeKey = 'IdentityCredential';

    nock(/./)
      .post(/token/)
      .reply(200, tokenResponseRef1)
      .post(/credential/)
      .reply(200, credentialResponseRef1)
      .get(/jwks/)
      .reply(404);

    const promise = credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      { credentialTypeKey },
      GrantType.PRE_AUTHORIZED_CODE
    );

    await expect(promise).rejects.toThrow(
      'Could not retrieve issuer verifying keys.'
    );
  });
});
