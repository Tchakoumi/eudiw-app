import { AccessTokenClient } from '../AccessTokenClient';
import {
  AccessTokenRequest,
  AccessTokenResponse,
  GrantTypes,
  OpenIDResponse,
} from '../types';

test('true is true', async () => {
  const TOKEN_ENDPOINT = 'https://trial.authlete.net/api/';

  const accessTokenClient: AccessTokenClient = new AccessTokenClient();

  const accessTokenRequest: AccessTokenRequest = {
    grant_type: GrantTypes.PRE_AUTHORIZED_CODE,
    'pre-authorized_code': '-nlq6ZIu6lWCl0uJmL6JBHSpQ9CdGqvnFSt1Vl4dXqo',
    client_id: '218232426',
  } as AccessTokenRequest;

  const accessTokenResponse: OpenIDResponse<AccessTokenResponse> =
    await accessTokenClient.acquireAccessTokenUsingRequest({
      accessTokenRequest,
      asOpts: { as: TOKEN_ENDPOINT },
    });

  console.log('accessTokenResponse: ', accessTokenResponse);
  expect(true).toBe(true);
});
