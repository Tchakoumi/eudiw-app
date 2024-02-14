import { DBSchema } from 'idb';
import { StorageFactory } from './StorageFactory';

// Mocking indexdedDB functionality
import 'fake-indexeddb/auto';

interface TestDBSchema extends DBSchema {
  test_store: {
    key: string;
    value: string;
  };
}

describe('StorageFactory', () => {
  const storageFactory = new StorageFactory<TestDBSchema>('test_db', 1, {
    upgrade(db) {
      db.createObjectStore('test_store');
    },
  });

  it('should work', async () => {
    await storageFactory.init();
  });

  it('should insert data', async () => {
    await storageFactory.init();
    const addedKey = await storageFactory.insert('test_store', {
      key: 'test_key',
      value: 'test_value',
    });
    expect(addedKey).toBe('test_key');
  });
});
