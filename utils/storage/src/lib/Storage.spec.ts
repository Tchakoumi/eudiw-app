import { DBSchema } from 'idb';
import { StorageFactory } from './StorageFactory';

// Mocking indexdedDB functionality
import 'core-js/stable/structured-clone';
import 'fake-indexeddb/auto';

interface TestDBSchema extends DBSchema {
  testStore: {
    key: string;
    value: string;
  };
  inlineKeyStore: {
    key: string;
    value: {
      id: string;
      name: string;
      email: string;
    };
  };
}

describe('StorageFactory', () => {
  let storageFactory: StorageFactory<TestDBSchema>;

  const payload1 = { key: 'test_key', value: 'test_value' };
  const payload2 = {
    key: 'test_in_line_key',
    value: { id: 'test_in_line_key', name: 'Joe', email: 'joe237@gmail.com' },
  };

  beforeAll(() => {
    storageFactory = new StorageFactory<TestDBSchema>('testDB', 1, {
      upgrade(db) {
        db.createObjectStore('testStore');
        db.createObjectStore('inlineKeyStore', { keyPath: 'id' });
      },
    });
  });

  it('should be defined', async () => {
    expect(storageFactory).toBeDefined();
  });

  it('should insert data', async () => {
    const addedKey1 = await storageFactory.insert('testStore', payload1);
    expect(addedKey1).toBe('test_key');

    const addedKey2 = await storageFactory.insert('inlineKeyStore', payload2);
    expect(addedKey2).toEqual('test_in_line_key');
  });

  it('should find one', async () => {
    const record = await storageFactory.findOne('testStore', 'test_key');
    expect(record).toEqual(payload1);
  });
});
