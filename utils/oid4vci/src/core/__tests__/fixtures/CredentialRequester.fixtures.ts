import { StorageFactory } from '@datev/storage';
import {
  CredentialDBSchema,
  CredentialStorage,
  credentialStoreName,
} from '../../../lib/schemas/CredentialDBSchema';

// Mocking indexdedDB functionality
import 'core-js/stable/structured-clone';
import 'fake-indexeddb/auto';

export const storage: CredentialStorage =
  new StorageFactory<CredentialDBSchema>('testDB', 1, {
    upgrade(db) {
      db.createObjectStore(credentialStoreName);
    },
  });
