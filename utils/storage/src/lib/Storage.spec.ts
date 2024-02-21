import { DBSchema, StoreNames } from 'idb';
import {
  StoreRecord,
  StoreRecordValue,
  TransactionCallback,
} from './Storage.types';
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
    indexes: { byEmail: 'email' };
  };
}

describe('StorageFactory', () => {
  let storageFactory: StorageFactory<TestDBSchema>;

  beforeAll(() => {
    storageFactory = new StorageFactory<TestDBSchema>('testDB', 1, {
      upgrade(db) {
        db.createObjectStore('testStore');
        const inlineKeyStore = db.createObjectStore('inlineKeyStore', {
          keyPath: 'inlineId',
        });
        inlineKeyStore.createIndex('byEmail', 'email');
      },
    });
  });

  beforeEach(async () => {
    await Promise.all([
      storageFactory.insert('inlineKeyStore', {
        value: {
          email: 'johnsmith@gmail.com',
          inlineId: 'john_smith_key',
          name: 'John Smith',
        },
      }),
      storageFactory.insert('testStore', {
        key: 'test_value_1',
        value: 'storing a test value...',
      }),
    ]);
  });

  afterEach(async () => {
    await Promise.all([
      storageFactory.delete('testStore', 'test_value_1'),
      storageFactory.delete('inlineKeyStore', 'john_smith_key'),
    ]);
  });

  afterAll(async () => {
    await Promise.all([
      storageFactory.clear('testStore'),
      storageFactory.clear('inlineKeyStore'),
    ]);
  });

  it('should be defined', () => {
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
    const updateFn = jest.fn((storeName: StoreNames<TestDBSchema>) =>
      storageFactory.update(storeName, 'john_smith_key', {
        name: 'Jean Kamdem',
      })
    );

    expect(updateFn('inlineKeyStore')).resolves.not.toThrow();
    expect(updateFn('testStore')).rejects.toThrow(
      `No such key as john_smith_key in store`
    );
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

  it('should delete many values in store', () => {
    const keysToBeDelected: IDBValidKey[] = ['john_smith_key'];

    expect(storageFactory.deleteMany('testStore')).resolves.not.toThrow();
    expect(
      storageFactory.deleteMany('inlineKeyStore', keysToBeDelected)
    ).resolves.not.toThrow();

    // will only delete data for existing keys, will then ignored `test_value_1` key
    expect(
      storageFactory.deleteMany('inlineKeyStore', [
        ...keysToBeDelected,
        'test_value_1',
      ])
    ).resolves.not.toThrow();

    expect(
      storageFactory.deleteMany('unknownStore' as StoreNames<TestDBSchema>)
    ).rejects.toThrow();
  });

  it('should retrieves the number of records matching the given query in a store', async () => {
    const itemCount = await storageFactory.count('testStore');
    expect(itemCount).toBeGreaterThanOrEqual(1);
    expect(itemCount).toBeLessThanOrEqual(2);

    const indexItemCount = await storageFactory.count('inlineKeyStore', {
      indexName: 'byEmail',
    });
    expect(indexItemCount).toBeGreaterThanOrEqual(1);
    expect(indexItemCount).toBeLessThanOrEqual(2);
  });

  it('should retrieves values in an index that match the query.', async () => {
    const records = await storageFactory.findManyByIndex(
      'inlineKeyStore',
      'byEmail'
    );
    expect(records.length).toBeGreaterThanOrEqual(1);
    expect(records.length).toBeLessThanOrEqual(2);

    expect(records).toStrictEqual<StoreRecordValue<TestDBSchema>[]>(
      records.length === 1
        ? [
            {
              inlineId: 'john_smith_key',
              email: 'johnsmith@gmail.com',
              name: 'John Smith',
            },
          ]
        : [
            {
              inlineId: 'test_in_line_key',
              email: 'joe237@gmail.com',
              name: 'Joe',
            },
            {
              inlineId: 'john_smith_key',
              email: 'johnsmith@gmail.com',
              name: 'John Smith',
            },
          ]
    );
  });

  it('should start and close a new transaction', async () => {
    const transactionCallback: TransactionCallback<TestDBSchema, 'readwrite'> =
      jest.fn(async (transaction) => {
        await storageFactory.insert(
          'testStore',
          {
            value: 'tx_value_1',
            key: 'tx_key_1',
          },
          transaction
        );
        storageFactory.findOne('testStore', 'tx_key_1', transaction);
        storageFactory.update(
          'testStore',
          'tx_key_1',
          'tx_value_2',
          transaction
        );
        await storageFactory.delete('testStore', 'tx_key_2', transaction);
      });

    await storageFactory.$transaction(
      ['testStore'],
      'readwrite',
      transactionCallback
    );
    expect(transactionCallback).toHaveBeenCalled();
  });

  it('should clear all data in store', () => {
    expect(storageFactory.clear('testStore')).resolves.not.toThrow();
    expect(
      storageFactory.clear('someStore' as StoreNames<TestDBSchema>)
    ).rejects.toThrow('No objectStore named someStore in this database');
  });
});
