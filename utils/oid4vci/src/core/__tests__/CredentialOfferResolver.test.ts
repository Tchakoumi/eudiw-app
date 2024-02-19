import nock from 'nock';

import { WELL_KNOWN_ENDPOINTS } from '../../constants';
import { InvalidCredentialOffer } from '../../lib/errors';
import {
  AuthorizationServerMetadata,
  CredentialIssuerMetadata,
  CredentialOffer,
  ResolvedCredentialOffer,
} from '../../lib/types';
import { CredentialOfferResolver } from '../CredentialOfferResolver';

import {
  credentialOfferObjectRef1,
  credentialIssuerMetadataRef1,
  authorizationServerMetadataRef1,
  jwtIssuerMetadataRef1,
  encodeCredentialOffer,
  nockReplyWithEmptyPayload,
  nockReplyWithMetadataRef1,
} from './fixtures';

describe('CredentialOfferResolver', () => {
  const resolver: CredentialOfferResolver = new CredentialOfferResolver();

  beforeAll(async () => {
    nock.disableNetConnect();
  });

  beforeEach(async () => {
    nock.cleanAll();
  });

  it('should resolve offer by value (schemeful link)', async () => {
    const credentialOffer =
      'openid-credential-offer://?credential_offer=' +
      '%7B%22credential_issuer%22%3A%22https%3A%2F%2Fcredential-issuer.example.com%22%2C%22credential_configuration_ids%22%3A%5B%22org.iso.18013.5.1.mDL%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22oaKazRN8I0IbtZ0C7JuMn5%22%2C%22tx_code%22%3A%7B%22input_mode%22%3A%22text%22%7D%7D%7D%7D';

    const scope = nock(/example/);
    nockReplyWithMetadataRef1(scope);

    const resolved = await resolver.resolveCredentialOffer(credentialOffer);

    expect(resolved).toEqual({
      credentialOffer: {
        credential_issuer: 'https://credential-issuer.example.com',
        credential_configuration_ids: ['org.iso.18013.5.1.mDL'],
        grants: {
          'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
            'pre-authorized_code': 'oaKazRN8I0IbtZ0C7JuMn5',
            tx_code: { input_mode: 'text' },
          },
        },
      },
      discoveryMetadata: {
        credentialIssuerMetadata: credentialIssuerMetadataRef1,
        authorizationServerMetadata: authorizationServerMetadataRef1,
        jwtIssuerMetadata: jwtIssuerMetadataRef1,
      },
    } as ResolvedCredentialOffer);
  });

  it('should resolve offer by value (schemeless link)', async () => {
    const credentialOffer = `?credential_offer=${encodeCredentialOffer(
      credentialOfferObjectRef1
    )}`;

    const scope = nock(credentialOfferObjectRef1.credential_issuer);
    nockReplyWithMetadataRef1(scope);

    const resolved = await resolver.resolveCredentialOffer(credentialOffer);

    expect(resolved).toEqual({
      credentialOffer: credentialOfferObjectRef1,
      discoveryMetadata: {
        credentialIssuerMetadata: credentialIssuerMetadataRef1,
        authorizationServerMetadata: authorizationServerMetadataRef1,
        jwtIssuerMetadata: jwtIssuerMetadataRef1,
      },
    } as ResolvedCredentialOffer);
  });

  it('should resolve offer by reference (v1)', async () => {
    const credentialOffer = `openid-credential-offer://?credential_offer_uri=${encodeURIComponent(
      'https://trial.authlete.net/api/offer/xxxx'
    )}`;

    const scope = nock(/authlete/)
      .get(/xxxx/)
      .reply(200, JSON.stringify(credentialOfferObjectRef1));
    nockReplyWithMetadataRef1(scope);

    const resolved = await resolver.resolveCredentialOffer(credentialOffer);

    expect(resolved).toEqual({
      credentialOffer: credentialOfferObjectRef1,
      discoveryMetadata: {
        credentialIssuerMetadata: credentialIssuerMetadataRef1,
        authorizationServerMetadata: authorizationServerMetadataRef1,
        jwtIssuerMetadata: jwtIssuerMetadataRef1,
      },
    } as ResolvedCredentialOffer);
  });

  it('should resolve offer by reference (v2)', async () => {
    const credentialOffer = `openid-credential-offer://?credential_offer_uri=${encodeURIComponent(
      'https://server.example.com/offer/656d34df-7517-4074-857d-3442f35dc20e'
    )}`;

    const credentialOfferObject: CredentialOffer = {
      credential_issuer: 'https://server.example.com',
      credential_configuration_ids: ['IdentityCredential'],
    };

    const scope = nock(/example/)
      .get(/offer/)
      .reply(200, JSON.stringify(credentialOfferObject));
    nockReplyWithEmptyPayload(scope);

    const resolved = await resolver.resolveCredentialOffer(credentialOffer);

    expect(resolved).toEqual({
      credentialOffer: credentialOfferObject,
      discoveryMetadata: {
        credentialIssuerMetadata: {},
        authorizationServerMetadata: {},
        jwtIssuerMetadata: {},
      },
    } as ResolvedCredentialOffer);
  });

  it('should throw when credential offer has no query string', async () => {
    const credentialOffers = ['', 'openid-credential-offer'];

    for (const credentialOffer of credentialOffers) {
      const promise = resolver.resolveCredentialOffer(credentialOffer);
      await expect(promise).rejects.toThrow(
        InvalidCredentialOffer.MissingQueryString
      );
    }
  });

  it('should throw on empty or non single-param query string', async () => {
    const credentialOffers = [
      '?',
      '?k1=v1&k2=v2',
      'openid-credential-offer://?k1=v1&k2=v2',
    ];

    for (const credentialOffer of credentialOffers) {
      const promise = resolver.resolveCredentialOffer(credentialOffer);
      await expect(promise).rejects.toThrow(
        InvalidCredentialOffer.WrongParamCount
      );
    }
  });

  it('should throw on missing required parameters', async () => {
    const credentialOffers = ['?k1', '?k2'];

    for (const credentialOffer of credentialOffers) {
      const promise = resolver.resolveCredentialOffer(credentialOffer);
      await expect(promise).rejects.toThrow(
        InvalidCredentialOffer.MissingRequiredParams
      );
    }
  });

  it('should throw on invalid JSON resolved credential offer (by value)', async () => {
    const credentialOffers = [
      '?credential_offer=',
      `?credential_offer=${encodeURIComponent('{{}}')}`,
    ];

    for (const credentialOffer of credentialOffers) {
      const promise = resolver.resolveCredentialOffer(credentialOffer);
      await expect(promise).rejects.toThrow(
        InvalidCredentialOffer.DeserializationError
      );
    }
  });

  it('should throw on invalid JSON resolved credential offer (by reference)', async () => {
    const credentialOffer = `openid-credential-offer://?credential_offer_uri=${encodeURIComponent(
      'https://server.example.com/offer/656d34df-7517-4074-857d-3442f35dc20e'
    )}`;

    nock(/example/)
      .get(/offer/)
      .reply(200, '{{}}');

    const promise = resolver.resolveCredentialOffer(credentialOffer);
    await expect(promise).rejects.toThrow(
      InvalidCredentialOffer.DeserializationError
    );
  });

  it('should throw when fetching (dereferencing) credential offer fails', async () => {
    const credentialOffer = `openid-credential-offer://?credential_offer_uri=${encodeURIComponent(
      'https://server.example.com/offer/656d34df-7517-4074-857d-3442f35dc20e'
    )}`;

    nock(/example/)
      .get(/offer/)
      .replyWithError('fetch failed');

    const promise = resolver.resolveCredentialOffer(credentialOffer);
    await expect(promise).rejects.toThrow('fetch failed');
  });

  it('should throw on missing credential issuer', async () => {
    const credentialOffer = `openid-credential-offer://?credential_offer_uri=${encodeURIComponent(
      'https://server.example.com/offer/656d34df-7517-4074-857d-3442f35dc20e'
    )}`;

    const scope = nock(/example/)
      .get(/offer/)
      .reply(
        200,
        JSON.stringify({
          ...credentialOfferObjectRef1,
          credential_issuer: undefined,
        })
      );
    nockReplyWithEmptyPayload(scope);

    const promise = resolver.resolveCredentialOffer(credentialOffer);
    await expect(promise).rejects.toThrow(
      InvalidCredentialOffer.MissingCredentialIssuer
    );
  });

  it('should default to oauth-server-metadata when openid-configuration is unavailable', async () => {
    const credentialOffer = `?credential_offer=${encodeCredentialOffer(
      credentialOfferObjectRef1
    )}`;

    const scope = nock(credentialOfferObjectRef1.credential_issuer)
      .get((uri) =>
        uri.endsWith(WELL_KNOWN_ENDPOINTS.OPENID_PROVIDER_CONFIGURATION)
      )
      .reply(404)
      .get((uri) => uri.endsWith(WELL_KNOWN_ENDPOINTS.OAUTH_SERVER_METADATA))
      .reply(200, authorizationServerMetadataRef1);
    nockReplyWithMetadataRef1(scope);

    const resolved = await resolver.resolveCredentialOffer(credentialOffer);

    expect(resolved.discoveryMetadata).toEqual({
      credentialIssuerMetadata: credentialIssuerMetadataRef1,
      authorizationServerMetadata: authorizationServerMetadataRef1,
      jwtIssuerMetadata: jwtIssuerMetadataRef1,
    });
  });

  it('should resolve referenced authorization server', async () => {
    const credentialOfferObject: CredentialOffer = {
      ...credentialOfferObjectRef1,
      grants: {
        'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
          'pre-authorized_code': '',
          authorization_server: 'https://auth.authlete.com',
        },
      },
    };

    const credentialOffer = `?credential_offer=${encodeCredentialOffer(
      credentialOfferObject
    )}`;

    const credentialIssuerMetadata: CredentialIssuerMetadata = {
      ...credentialIssuerMetadataRef1,
      authorization_servers: ['https://auth.authlete.com'],
    };

    const scope = nock(/authlete/)
      .get((uri) =>
        uri.endsWith(WELL_KNOWN_ENDPOINTS.CREDENTIAL_ISSUER_METADATA)
      )
      .reply(200, credentialIssuerMetadata);

    nockReplyWithMetadataRef1(scope);

    const resolved = await resolver.resolveCredentialOffer(credentialOffer);
    expect(resolved.discoveryMetadata).toEqual({
      credentialIssuerMetadata: credentialIssuerMetadata,
      authorizationServerMetadata: authorizationServerMetadataRef1,
      jwtIssuerMetadata: jwtIssuerMetadataRef1,
    });
  });

  it('should throw on non referenced authorization server', async () => {
    const credentialOfferObject: CredentialOffer = {
      ...credentialOfferObjectRef1,
      grants: {
        'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
          'pre-authorized_code': '',
          authorization_server: 'invalid-authorization-server',
        },
      },
    };

    const credentialOffer = `?credential_offer=${encodeCredentialOffer(
      credentialOfferObject
    )}`;

    const scope = nock(credentialOfferObject.credential_issuer)
      .get(/./)
      .reply(200, JSON.stringify(credentialOfferObject));
    nockReplyWithMetadataRef1(scope);

    const promise = resolver.resolveCredentialOffer(credentialOffer);
    await expect(promise).rejects.toThrow(
      InvalidCredentialOffer.UnresolvableAuthorizationServer
    );
  });

  it('should find authorization server with support for current grant type', async () => {
    const credentialOffer = `?credential_offer=${encodeCredentialOffer(
      credentialOfferObjectRef1
    )}`;

    const credentialIssuerMetadata: CredentialIssuerMetadata = {
      ...credentialIssuerMetadataRef1,
      authorization_servers: [credentialOfferObjectRef1.credential_issuer],
    };

    const scope = nock(credentialOfferObjectRef1.credential_issuer)
      .get((uri) =>
        uri.endsWith(WELL_KNOWN_ENDPOINTS.CREDENTIAL_ISSUER_METADATA)
      )
      .reply(200, credentialIssuerMetadata);

    nockReplyWithMetadataRef1(scope);

    const resolved = await resolver.resolveCredentialOffer(credentialOffer);
    expect(resolved.discoveryMetadata).toEqual({
      credentialIssuerMetadata: credentialIssuerMetadata,
      authorizationServerMetadata: authorizationServerMetadataRef1,
      jwtIssuerMetadata: jwtIssuerMetadataRef1,
    });
  });

  it('should throw when no authorization server has support for current grant type', async () => {
    const credentialOffer = `?credential_offer=${encodeCredentialOffer(
      credentialOfferObjectRef1
    )}`;

    const credentialIssuerMetadata: CredentialIssuerMetadata = {
      ...credentialIssuerMetadataRef1,
      authorization_servers: [credentialOfferObjectRef1.credential_issuer],
    };

    const authorizationServerMetadata: AuthorizationServerMetadata = {
      ...authorizationServerMetadataRef1,
      grant_types_supported: [],
    };

    nock(credentialOfferObjectRef1.credential_issuer)
      .get((uri) =>
        uri.endsWith(WELL_KNOWN_ENDPOINTS.CREDENTIAL_ISSUER_METADATA)
      )
      .reply(200, credentialIssuerMetadata)
      .get((uri) =>
        uri.endsWith(WELL_KNOWN_ENDPOINTS.OPENID_PROVIDER_CONFIGURATION)
      )
      .reply(200, authorizationServerMetadata);

    const promise = resolver.resolveCredentialOffer(credentialOffer);
    await expect(promise).rejects.toThrow(
      InvalidCredentialOffer.UnresolvableAuthorizationServer
    );
  });
});
