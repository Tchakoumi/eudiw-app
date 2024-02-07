import { CredentialOffer } from '../../types';
import { CredentialOfferResolver } from '../CredentialOfferResolver';
import { credentialOfferObjectRef1 } from './__fixtures__';

describe('CredentialOfferResolver', () => {
  let resolver: CredentialOfferResolver;

  beforeEach(async () => {
    resolver = new CredentialOfferResolver();
  });

  const encodeCredentialOffer = (credentialOffer: CredentialOffer) => {
    return encodeURIComponent(JSON.stringify(credentialOffer));
  };

  it('should resolve offer by value (v1)', async () => {
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
    });
  });

  it('should resolve offer by value (v2)', async () => {
    const credentialOffer =
      'openid-credential-offer://?credential_offer=' +
      `${encodeCredentialOffer(credentialOfferObjectRef1)}`;

    const resolved = await resolver.resolveCredentialOffer(credentialOffer);

    expect(resolved).toEqual({
      credentialOffer: credentialOfferObjectRef1,
    });
  });
});
