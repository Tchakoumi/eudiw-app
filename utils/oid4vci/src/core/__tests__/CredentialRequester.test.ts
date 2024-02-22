import { StorageFactory } from '@datev/storage';
import { PRE_AUTHORIZED_GRANT_TYPE } from '../../lib/types';
import { CredentialRequester } from '../CredentialRequester';
import { IdentityProofGenerator } from '../IdentityProofGenerator';
import { credentialOfferObjectRef1, discoveryMetadataRef1 } from './fixtures';

import {
  CredentialDBSchema,
  CredentialStorage,
} from '../../lib/schemas/CredentialDBSchema';

// Mocking indexdedDB functionality
import 'core-js/stable/structured-clone';
import 'fake-indexeddb/auto';

describe('CredentialRequester', () => {
  const storage: CredentialStorage = new StorageFactory<CredentialDBSchema>(
    'testDB',
    1,
    {
      upgrade(db) {
        db.createObjectStore('credentialStore');
      },
    }
  );

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
      'credentialStore',
      credential.id as IDBValidKey
    );

    expect(credential).toEqual(stored?.value.display);
    console.log(credential);
  });
});
