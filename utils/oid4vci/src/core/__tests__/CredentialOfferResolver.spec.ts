import { WELL_KNOWN_ENDPOINTS } from '../../constants';
import { InvalidCredentialOffer } from '../../errors';
import { CredentialOffer, ResolvedCredentialOffer } from '../../types';
import { CredentialOfferResolver } from '../CredentialOfferResolver';
import {
  credentialOfferObjectRef1,
  credentialIssuerMetadataRef1,
  authorizationServerMetadataRef1,
  jwtIssuerMetadataRef1,
} from './__fixtures__';

describe('CredentialOfferResolver', () => {
  const resolver: CredentialOfferResolver = new CredentialOfferResolver();
  const fetchMock = jest.spyOn(global, 'fetch');

  beforeEach(async () => {
    fetchMock.mockImplementation(replyWithMetadataRef1);
  });

  afterAll(async () => {
    fetchMock.mockClear();
  });

  const encodeCredentialOffer = (credentialOffer: CredentialOffer) => {
    return encodeURIComponent(JSON.stringify(credentialOffer));
  };

  const replyWithEmptyResponse = async () => {
    return {
      json: async () => ({}),
    } as Response;
  };

  const replyWithMetadataRef1 = (async (url: string) => {
    return {
      json: async () => {
        let response = {};

        if (url.endsWith(WELL_KNOWN_ENDPOINTS.CREDENTIAL_ISSUER_METADATA)) {
          response = credentialIssuerMetadataRef1;
        } else if (
          url.endsWith(WELL_KNOWN_ENDPOINTS.OPENID_PROVIDER_CONFIGURATION)
        ) {
          response = authorizationServerMetadataRef1;
        } else if (url.endsWith(WELL_KNOWN_ENDPOINTS.JWT_ISSUER_METADATA)) {
          response = jwtIssuerMetadataRef1;
        }

        return response;
      },
    } as Response;
  }) as (arg: unknown) => Promise<Response>;

  it('should resolve offer by value', async () => {
    const credentialOffer =
      'openid-credential-offer://?credential_offer=' +
      '%7B%22credential_issuer%22%3A%22https%3A%2F%2Fcredential-issuer.example.com%22%2C%22credential_configuration_ids%22%3A%5B%22org.iso.18013.5.1.mDL%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22oaKazRN8I0IbtZ0C7JuMn5%22%2C%22tx_code%22%3A%7B%22input_mode%22%3A%22text%22%7D%7D%7D%7D';

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
      } as CredentialOffer,
      metadata: {
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

    const resolved = await resolver.resolveCredentialOffer(credentialOffer);

    expect(resolved).toEqual({
      credentialOffer: credentialOfferObjectRef1,
      metadata: {
        credentialIssuerMetadata: credentialIssuerMetadataRef1,
        authorizationServerMetadata: authorizationServerMetadataRef1,
        jwtIssuerMetadata: jwtIssuerMetadataRef1,
      },
    } as ResolvedCredentialOffer);
  });

  it('should resolve offer by reference', async () => {
    const credentialOffer = `openid-credential-offer://?credential_offer_uri=${encodeURIComponent(
      'https://trial.authlete.net/api/offer/xxxx'
    )}`;

    fetchMock.mockImplementation(async (arg) => {
      if (arg == 'https://trial.authlete.net/api/offer/xxxx') {
        return {
          text: async () => JSON.stringify(credentialOfferObjectRef1),
        } as Response;
      } else {
        return await replyWithMetadataRef1(arg);
      }
    });

    const resolved = await resolver.resolveCredentialOffer(credentialOffer);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://trial.authlete.net/api/offer/xxxx'
    );

    expect(resolved).toEqual({
      credentialOffer: credentialOfferObjectRef1,
      metadata: {
        credentialIssuerMetadata: credentialIssuerMetadataRef1,
        authorizationServerMetadata: authorizationServerMetadataRef1,
        jwtIssuerMetadata: jwtIssuerMetadataRef1,
      },
    } as ResolvedCredentialOffer);
  });

  it('should resolve offer by reference (bis)', async () => {
    const credentialOffer = `openid-credential-offer://?credential_offer_uri=${encodeURIComponent(
      'https://server.example.com/offer/656d34df-7517-4074-857d-3442f35dc20e'
    )}`;

    const credentialOfferObject: CredentialOffer = {
      credential_issuer: 'https://server.example.com',
      credential_configuration_ids: ['IdentityCredential'],
    };

    fetchMock.mockImplementation(async (arg) => {
      if ((<string>arg).startsWith('https://server.example.com/offer/')) {
        return {
          text: async () => JSON.stringify(credentialOfferObject),
        } as Response;
      } else {
        return await replyWithEmptyResponse();
      }
    });

    const resolved = await resolver.resolveCredentialOffer(credentialOffer);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://server.example.com/offer/656d34df-7517-4074-857d-3442f35dc20e'
    );

    expect(resolved).toEqual({
      credentialOffer: credentialOfferObject,
      metadata: {
        credentialIssuerMetadata: {},
        authorizationServerMetadata: {},
        jwtIssuerMetadata: {},
      },
    } as ResolvedCredentialOffer);
  });

  it('should fail when credential offer has no query string', async () => {
    const credentialOffers = ['', 'openid-credential-offer'];

    for (const credentialOffer of credentialOffers) {
      const promise = resolver.resolveCredentialOffer(credentialOffer);
      expect(promise).rejects.toThrow(
        InvalidCredentialOffer.MissingQueryString
      );
    }
  });

  it('should fail on empty or non single-param query string', async () => {
    const credentialOffers = [
      '?',
      '?k1=v1&k2=v2',
      'openid-credential-offer://?k1=v1&k2=v2',
    ];

    for (const credentialOffer of credentialOffers) {
      const promise = resolver.resolveCredentialOffer(credentialOffer);
      expect(promise).rejects.toThrow(InvalidCredentialOffer.WrongParamCount);
    }
  });

  it('should fail on missing required parameters', async () => {
    const credentialOffers = ['?k1', '?k2'];

    for (const credentialOffer of credentialOffers) {
      const promise = resolver.resolveCredentialOffer(credentialOffer);
      expect(promise).rejects.toThrow(
        InvalidCredentialOffer.MissingRequiredParams
      );
    }
  });

  it('should fail on invalid JSON resolved credential offer', async () => {
    const credentialOffers = [
      '?credential_offer=',
      `?credential_offer=${encodeURIComponent('{{}}')}`,
    ];

    for (const credentialOffer of credentialOffers) {
      const promise = resolver.resolveCredentialOffer(credentialOffer);
      expect(promise).rejects.toThrow(
        InvalidCredentialOffer.DeserializationError
      );
    }
  });

  it('should fail on invalid JSON resolved credential offer (by reference)', async () => {
    const credentialOffer = `openid-credential-offer://?credential_offer_uri=${encodeURIComponent(
      'https://server.example.com/offer/656d34df-7517-4074-857d-3442f35dc20e'
    )}`;

    fetchMock.mockImplementation(async () => {
      return {
        text: async () => '{{}}',
      } as Response;
    });

    const promise = resolver.resolveCredentialOffer(credentialOffer);
    expect(promise).rejects.toThrow(
      InvalidCredentialOffer.DeserializationError
    );
  });

  it('should fail when fetching anything errs', async () => {
    const credentialOffer = `openid-credential-offer://?credential_offer_uri=${encodeURIComponent(
      'https://server.example.com/offer/656d34df-7517-4074-857d-3442f35dc20e'
    )}`;

    fetchMock.mockImplementation(() =>
      Promise.reject(new Error('fetch failed'))
    );

    const promise = resolver.resolveCredentialOffer(credentialOffer);
    expect(promise).rejects.toThrow('fetch failed');
  });

  it('should fail on missing credential issuer', async () => {
    const credentialOffer = `openid-credential-offer://?credential_offer_uri=${encodeURIComponent(
      'https://server.example.com/offer/656d34df-7517-4074-857d-3442f35dc20e'
    )}`;

    fetchMock.mockImplementation(async (arg) => {
      if ((<string>arg).startsWith('https://server.example.com/offer/')) {
        return {
          text: async () =>
            JSON.stringify({
              ...credentialOfferObjectRef1,
              credential_issuer: undefined,
            }),
        } as Response;
      } else {
        return await replyWithEmptyResponse();
      }
    });

    const promise = resolver.resolveCredentialOffer(credentialOffer);
    expect(promise).rejects.toThrow(
      InvalidCredentialOffer.MissingCredentialIssuer
    );
  });
});
