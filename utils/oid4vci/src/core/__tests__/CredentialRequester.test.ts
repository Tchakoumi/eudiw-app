import { TokenResponse } from '../../lib/types/tmp';
import { CredentialRequester } from '../CredentialRequester';
import { IdentityProofGenerator } from '../IdentityProofGenerator';
import { discoveryMetadataRef1 } from './fixtures';

describe('CredentialRequester', () => {
  const identityProofGenerator = new IdentityProofGenerator();
  const credentialRequester = new CredentialRequester(identityProofGenerator);

  it('should successfully request a credential', async () => {
    jest.setTimeout(30e3);

    const discoveryMetadata = discoveryMetadataRef1;
    const credentialTypeKey = 'IdentityCredential';

    const tokenResponse: TokenResponse = {
      access_token: 'iDV_P3mLcxbOxbMxySc9sgJ_OjwQbGPiQCcs5wPVXzA',
      token_type: 'Bearer',
      expires_in: 86400,
      scope: null,
      refresh_token: 'QcxNHvTnwSoEVBbkacRWR2JfcJos-U21UQQ8HpfHr5U',
      c_nonce: 'UMAELxhn4IY2a5_eLr_cVkPLmktVYv-29mEx9LULPQ0',
      c_nonce_expires_in: 86400,
    };

    const credential = await credentialRequester.requestCredentialIssuance(
      credentialTypeKey,
      discoveryMetadata,
      tokenResponse
    );

    console.log(credential);
  });
});
