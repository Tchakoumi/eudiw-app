import { TokenResponse } from '../../types/tmp';
import { CredentialRequester } from '../CredentialRequester';
import { IdentityProofGenerator } from '../IdentityProofGenerator';
import { discoveryMetadataRef1 } from './__fixtures__';

describe('CredentialRequester', () => {
  const identityProofGenerator = new IdentityProofGenerator();
  const credentialRequester = new CredentialRequester(identityProofGenerator);

  it('should successfully request a credential', async () => {
    jest.setTimeout(30e3);

    const discoveryMetadata = discoveryMetadataRef1;
    const credentialTypeKey = 'IdentityCredential';

    const tokenResponse: TokenResponse = {
      access_token: 'o-wb7jYoq3faRuhZPlNd-JQBAYSwFCRcMIDdERLRDfw',
      token_type: 'Bearer',
      expires_in: 86400,
      scope: null,
      refresh_token: 'mxIWl3Oun-2vdMF1UorZ7B_leEtD6xj4225gth6hNB0',
      c_nonce: 'cHGOO6elWn31Avc9piCRYxNLDqN_cpTDJwInpH6oQIM',
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
