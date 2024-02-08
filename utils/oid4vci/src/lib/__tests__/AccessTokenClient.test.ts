import { AccessTokenClient } from '../AccessTokenClient';
import {
  AccessTokenResponse,
  CredentialOfferRequestWithBaseUrl,
  OpenIDResponse,
} from '../types';
const nock = require('nock');

const MOCK_URL = 'https://trial.authlete.net/api';

describe('CredentialOfferResolver', () => {
  const accessTokenClient: AccessTokenClient = new AccessTokenClient();

  beforeEach(async () => {
    nock.cleanAll();
  });

  afterAll(async () => {
    nock.cleanAll();
  });

  it('should resolve offer by value', async () => {
    const CREDENTIAL: CredentialOfferRequestWithBaseUrl = {
      baseUrl: 'openid-credential-offer://',
      credential_offer: {
        credential_issuer: 'https://trial.authlete.net/api',
        credentials: ['OpenBadgeCredential'],
        grants: {
          'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
            'pre-authorized_code':
              '9sqM3jB_ItDWDCaaPakcdevXr2vFu5HvaxRxpE3_14Q',
            user_pin_required: false,
          },
        },
      },
      scheme: '',
      userPinRequired: false,
      original_credential_offer: {
        credential_issuer: 'https://trial.authlete.net/api',
        credentials: ['OpenBadgeCredential'],
        grants: {
          'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
            'pre-authorized_code':
              '9sqM3jB_ItDWDCaaPakcdevXr2vFu5HvaxRxpE3_14Q',
            user_pin_required: false,
          },
        },
      },
      version: 1011,
      supportedFlows: [],
    };

    const body: AccessTokenResponse = {
      access_token: 'ey6546.546654.64565',
      authorization_pending: false,
      c_nonce: 'c_nonce2022101300',
      c_nonce_expires_in: 2022101300,
      interval: 2022101300,
      token_type: 'Bearer',
    };

    nock(MOCK_URL).post(/.*/).reply(200, body);

    const accessTokenResponse: OpenIDResponse<AccessTokenResponse> =
      await accessTokenClient.acquireAccessToken({
        credentialOffer: CREDENTIAL,
      });

    expect(accessTokenResponse.successBody).toEqual(body);
  });
});
