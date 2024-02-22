import { credentialStoreName } from '../../lib/schemas/CredentialDBSchema';
import { PRE_AUTHORIZED_GRANT_TYPE } from '../../lib/types';
import { CredentialRequester } from '../CredentialRequester';
import { IdentityProofGenerator } from '../IdentityProofGenerator';

import {
  credentialOfferObjectRef1,
  discoveryMetadataRef1,
  storage,
} from './fixtures';

describe('CredentialRequester', () => {
  const identityProofGenerator = new IdentityProofGenerator();
  const credentialRequester = new CredentialRequester(
    identityProofGenerator,
    storage
  );

  beforeAll(() => {
    jest.setTimeout(30e3);
  });

  it('should successfully request a credential', async () => {
    const credentialOffer = credentialOfferObjectRef1;
    const discoveryMetadata = discoveryMetadataRef1;
    const credentialTypeKey = 'IdentityCredential';

    const credential = await credentialRequester.requestCredentialIssuance(
      { credentialOffer, discoveryMetadata },
      credentialTypeKey,
      PRE_AUTHORIZED_GRANT_TYPE
    );

    const stored = await storage.findOne(
      credentialStoreName,
      credential.id as IDBValidKey
    );

    expect(credential).toEqual(stored?.value.display);
  });
});
