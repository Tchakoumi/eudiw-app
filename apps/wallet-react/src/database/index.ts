import { StorageFactory } from '@datev/storage';
import { WalletDBSchema } from './schema';

// open a new database named `storage` following the `WalletDBSchema` schema
const storageFactory = new StorageFactory<WalletDBSchema>('storage', 1, {
  upgrade(db, oldVersion, newVersion, transaction, event) {
    //creating a new store `profile`
    const testStore = db.createObjectStore('profile', {
      // The 'profileId' property of the object will be the key.
      keyPath: 'profileId',
    });
    testStore.createIndex('by-email', 'email');
  },
  blocked(currentVersion, blockedVersion, event) {
    // …
  },
  blocking(currentVersion, blockedVersion, event) {
    // …
  },
  terminated() {
    // …
  },
});

export { storageFactory, storageFactory as default };
