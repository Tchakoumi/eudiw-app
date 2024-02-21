import { PRE_AUTHORIZED_GRANT_TYPE } from '../../lib/types';
import { CredentialRequester } from '../CredentialRequester';
import { IdentityProofGenerator } from '../IdentityProofGenerator';
import { credentialOfferObjectRef1, discoveryMetadataRef1 } from './fixtures';

describe('CredentialRequester', () => {
  const identityProofGenerator = new IdentityProofGenerator();
  const credentialRequester = new CredentialRequester(identityProofGenerator);

  it('should successfully request a credential', async () => {
    jest.setTimeout(30e3);

    const credentialOffer = credentialOfferObjectRef1;
    const discoveryMetadata = discoveryMetadataRef1;
    const credentialTypeKey = 'IdentityCredential';

    const credential = await credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      credentialTypeKey,
      PRE_AUTHORIZED_GRANT_TYPE
    );

    console.log(credential);
  });
});
