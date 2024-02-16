import { AccessTokenClient } from '../AccessTokenClient';
import {
  AccessTokenRequest,
  AccessTokenResponse,
  GrantTypes,
  OpenIDResponse,
} from '../types';
const nock = require('nock');

const MOCK_URL = 'https://trial.authlete.net/api';
const UNIT_TEST_TIMEOUT = 30000;

describe('AccessTokenResolver', () => {
  beforeEach(async () => {
    nock.cleanAll();
  });

  afterAll(async () => {
    nock.cleanAll();
  });

  it(
    'should successfully acquire an access token using a pre-authorized code',
    async () => {
      const accessTokenClient: AccessTokenClient = new AccessTokenClient();

      const accessTokenRequest: AccessTokenRequest = {
        grant_type: GrantTypes.PRE_AUTHORIZED_CODE,
        'pre-authorized_code': '20221013',
        client_id: 'test',
      } as AccessTokenRequest;

      const body: AccessTokenResponse = {
        access_token: 'ey6546.546654.64565',
        authorization_pending: false,
        c_nonce: 'c_nonce2022101300',
        c_nonce_expires_in: 2022101300,
        interval: 2022101300,
        token_type: 'Bearer',
        authorization_details: [
          {
            type: 'openid_credential',
            credential_configuration_id: 'UniversityDegreeCredential',
            credential_identifiers: [
              'CivilEngineeringDegree-2023',
              'ElectricalEngineeringDegree-2023',
            ],
          },
        ],
      };
      nock(MOCK_URL).post(/.*/).reply(200, JSON.stringify(body));

      const accessTokenResponse: OpenIDResponse<AccessTokenResponse> =
        await accessTokenClient.acquireAccessTokenUsingRequest({
          accessTokenRequest,
          asOpts: { as: MOCK_URL },
        });

      expect(accessTokenResponse.successBody).toEqual(body);
    },
    UNIT_TEST_TIMEOUT,
  );

  it(
    'should throw an error when a pre-authorized code is missing',
    async () => {
      const accessTokenClient: AccessTokenClient = new AccessTokenClient();

      const accessTokenRequest: AccessTokenRequest = {
        grant_type: GrantTypes.PRE_AUTHORIZED_CODE,
        'pre-authorized_code': '',
      } as AccessTokenRequest;

      nock(MOCK_URL).post(/.*/).reply(200, {});

      await expect(
        accessTokenClient.acquireAccessTokenUsingRequest({
          accessTokenRequest,
          asOpts: { as: MOCK_URL },
        }),
      ).rejects.toThrow(
        'Pre-authorization must be proven by presenting the pre-authorized code. Code must be present.',
      );
    },
    UNIT_TEST_TIMEOUT,
  );

  // it(
  //   'should throw an error when a required pin is missing',
  //   async () => {
  //     const accessTokenClient: AccessTokenClient = new AccessTokenClient();

  //     const accessTokenRequest: AccessTokenRequest = {
  //       grant_type: GrantTypes.PRE_AUTHORIZED_CODE,
  //       'pre-authorized_code': '20221013',
  //     } as AccessTokenRequest;

  //     nock(MOCK_URL).post(/.*/).reply(200, {});

  //     await expect(
  //       accessTokenClient.acquireAccessTokenUsingRequest({
  //         accessTokenRequest,
  //         isPinRequired: true,
  //         asOpts: { as: MOCK_URL },
  //       }),
  //     ).rejects.toThrow(
  //       'A valid pin consisting of maximal 8 numeric characters must be present.',
  //     );
  //   },
  //   UNIT_TEST_TIMEOUT,
  // );

  // it(
  //   'should throw an error for a pin longer than the maximum allowed length',
  //   async () => {
  //     const accessTokenClient: AccessTokenClient = new AccessTokenClient();

  //     const accessTokenRequest: AccessTokenRequest = {
  //       grant_type: GrantTypes.PRE_AUTHORIZED_CODE,
  //       'pre-authorized_code': '20221013',
  //       client_id: 'test',
  //       user_pin: '123456789',
  //     } as AccessTokenRequest;

  //     nock(MOCK_URL).post(/.*/).reply(200, {});

  //     await expect(
  //       accessTokenClient.acquireAccessTokenUsingRequest({
  //         accessTokenRequest,
  //         isPinRequired: true,
  //         asOpts: { as: MOCK_URL },
  //       }),
  //     ).rejects.toThrow(
  //       Error(
  //         'A valid pin consisting of maximal 8 numeric characters must be present.',
  //       ),
  //     );
  //   },
  //   UNIT_TEST_TIMEOUT,
  // );

  it(
    'should successfully validate a correct length pin',
    async () => {
      const accessTokenClient: AccessTokenClient = new AccessTokenClient();

      const accessTokenRequest: AccessTokenRequest = {
        grant_type: GrantTypes.PRE_AUTHORIZED_CODE,
        'pre-authorized_code': '20221013',
        client_id: 'test',
        user_pin: '12345678',
      } as AccessTokenRequest;

      const body: AccessTokenResponse = {
        access_token: 'ey6546.546654.64565',
        authorization_pending: false,
        c_nonce: 'c_nonce2022101300',
        c_nonce_expires_in: 2022101300,
        interval: 2022101300,
        token_type: 'Bearer',
        authorization_details: [
          {
            type: 'openid_credential',
            credential_configuration_id: 'UniversityDegreeCredential',
            credential_identifiers: [
              'CivilEngineeringDegree-2023',
              'ElectricalEngineeringDegree-2023',
            ],
          },
        ],
      };
      nock(MOCK_URL).post(/.*/).reply(200, body);

      const response = await accessTokenClient.acquireAccessTokenUsingRequest({
        accessTokenRequest,
        asOpts: { as: MOCK_URL },
      });
      expect(response.successBody).toEqual(body);
    },
    UNIT_TEST_TIMEOUT,
  );

  it('should throw an error when determining the token URL if necessary parameters are missing', async () => {
    await expect(() =>
      AccessTokenClient.determineTokenURL({
        asOpts: undefined,
        issuerOpts: undefined,
        metadata: undefined,
      }),
    ).toThrow(
      Error(
        'Cannot determine token URL if no issuer, metadata and no Authorization Server values are present',
      ),
    );
  });
});
