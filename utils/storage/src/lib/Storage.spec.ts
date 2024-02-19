import { DBSchema, StoreNames } from 'idb';
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
    expect(record1).toStrictEqual<StoreRecord<TestDBSchema>>({
      key: 'test_value_1',
      value: 'storing a test value...',
    });

    const record2 = await storageFactory.findOne(
      'inlineKeyStore',
      'john_smith_unknow_key'
    );
    expect(record2).toBe(null);
  });

  it('should find all', async () => {
    const records = await storageFactory.findAll('testStore');
    expect(records.length).toBeGreaterThanOrEqual(1);
    expect(records.length).toBeLessThanOrEqual(2);

    expect(records).toStrictEqual<StoreRecord<TestDBSchema>[]>(
      records.length === 1
        ? [
            {
              key: 'test_value_1',
              value: 'storing a test value...',
            },
          ]
        : [
            {
              key: 'test_key',
              value: 'test_value',
            },
            {
              key: 'test_value_1',
              value: 'storing a test value...',
            },
          ]
    );
  });

  it('should update value in store', async () => {
    const updateFn = (storeName: StoreNames<TestDBSchema>) =>
      storageFactory.update(storeName, 'john_smith_key', {
        name: 'Jean Kamdem',
      });

    expect(updateFn('inlineKeyStore')).resolves.not.toThrow();
    await updateFn('testStore').catch((error) => {
      expect(error.message).toBe(`No such key as john_smith_key in store`);
    });
  });

  it('should delete value in store', () => {
    expect(
      storageFactory.delete('inlineKeyStore', 'john_smith_key')
    ).resolves.not.toThrow();

    expect(
      storageFactory.delete(
        'someStore' as StoreNames<TestDBSchema>,
        'john_smith_key'
      )
    ).rejects.toThrow('No objectStore named someStore in this database');
  });
});
