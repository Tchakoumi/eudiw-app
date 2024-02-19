import { DBSchema } from 'idb';
import { StoreRecord } from './Storage.types';
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
      name: string;
      email: string;
      inlineId: string;
    };
  };
}

describe('StorageFactory', () => {
  let storageFactory: StorageFactory<TestDBSchema>;

  beforeAll(() => {
    storageFactory = new StorageFactory<TestDBSchema>('testDB', 1, {
      upgrade(db) {
        db.createObjectStore('testStore');
        db.createObjectStore('inlineKeyStore', {
          keyPath: 'inlineId',
        });
      },
    });
  });

  beforeEach(async () => {
    await storageFactory.insert('inlineKeyStore', {
      value: {
        email: 'johnsmith@gmail.com',
        inlineId: 'john_smith_key',
        name: 'John Smith',
      },
    });
    await storageFactory.insert('testStore', {
      key: 'test_value_1',
      value: 'storing a test value...',
    });
  });

  afterEach(async () => {
    await storageFactory.delete('testStore', 'test_value_1');
    await storageFactory.delete('inlineKeyStore', 'john_smith_key');
  });

  afterAll(() => {
    storageFactory.clear('testStore');
    storageFactory.clear('inlineKeyStore');
  });

  it('should be defined', async () => {
    expect(storageFactory).toBeDefined();
    expect(storageFactory).toBeInstanceOf(StorageFactory);
  });

  it('should insert data', async () => {
    const payload1: StoreRecord<TestDBSchema> = {
      key: 'test_key',
      value: 'test_value',
    };
    const addedKey1 = await storageFactory.insert('testStore', payload1);
    expect(addedKey1).toBe('test_key');

    const payload2: StoreRecord<TestDBSchema> = {
      value: {
        inlineId: 'test_in_line_key',
        name: 'Joe',
        email: 'joe237@gmail.com',
      },
    };
    const addedKey2 = await storageFactory.insert('inlineKeyStore', payload2);
    expect(addedKey2).toBe('test_in_line_key');
  });

  it('should find one', async () => {
    const record1 = await storageFactory.findOne('testStore', 'test_value_1');
    expect(record1).toEqual({
      key: 'test_value_1',
      value: 'storing a test value...',
    });

    const record2 = await storageFactory.findOne(
      'inlineKeyStore',
      'john_smith_key'
    );
    expect(record2).toEqual({
      key: 'john_smith_key',
      value: {
        email: 'johnsmith@gmail.com',
        inlineId: 'john_smith_key',
        name: 'John Smith',
      },
    });
  });
});
