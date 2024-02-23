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
  inlineAutoIncrement: {
    key: number;
    value: {
      data: {
        id?: number;
        value: string;
      };
    };
  };
}

describe('StorageFactory', () => {
  let storageFactory: StorageFactory<TestDBSchema>;
  const testData = {
    inlineKeyStore: {
      value: {
        email: 'johnsmith@gmail.com',
        inlineId: 'john_smith_key',
        name: 'John Smith',
      },
    },
    testStore: {
      key: 'test_value_1',
      value: 'storing a test value...',
    },
    inlineAutoIncrement: {
      value: { data: { value: 'Storing with incremental key' } },
    },
  };

  beforeAll(() => {
    storageFactory = new StorageFactory<TestDBSchema>('testDB', 1, {
      upgrade(db) {
        db.createObjectStore('testStore');
        db.createObjectStore('inlineAutoIncrement', {
          keyPath: 'data.id',

          //default to `false`
          autoIncrement: true,
        });
        const inlineKeyStore = db.createObjectStore('inlineKeyStore', {
          keyPath: 'inlineId',
        });
        inlineKeyStore.createIndex('byEmail', 'email');
      },
    });
  });

  beforeEach(async () => {
    await Promise.all([
      storageFactory.insert('inlineKeyStore', testData.inlineKeyStore),
      storageFactory.insert('testStore', testData.testStore),
      storageFactory.insert(
        'inlineAutoIncrement',
        testData.inlineAutoIncrement
      ),
    ]);
  });

  afterEach(async () => {
    await Promise.all([
      storageFactory.delete('testStore', testData.testStore.key),
      storageFactory.delete(
        'inlineKeyStore',
        testData.inlineKeyStore.value.inlineId
      ),
      storageFactory.deleteMany('inlineAutoIncrement'),
    ]);
  });

  afterAll(async () => {
    await Promise.all([
      storageFactory.clear('testStore'),
      storageFactory.clear('inlineKeyStore'),
      storageFactory.clear('inlineAutoIncrement'),
    ]);
  });

  it('should be defined', () => {
    expect(storageFactory).toBeDefined();
    expect(storageFactory).toBeInstanceOf(StorageFactory);
  });

  it('should insert data', async () => {
    const addedKey1 = await storageFactory.insert('testStore', {
      key: 'test_key',
      value: 'test_value',
    });
    expect(addedKey1).toBe('test_key');

    const addedKey2 = await storageFactory.insert('inlineKeyStore', {
      value: {
        inlineId: 'test_in_line_key',
        name: 'Joe',
        email: 'joe237@gmail.com',
      },
    });
    expect(addedKey2).toBe('test_in_line_key');

    const addedKey3 = await storageFactory.insert('inlineAutoIncrement', {
      value: { data: { value: 'Incremented value' } },
    });
    expect(typeof addedKey3).toBe('number');

    // clearing insertions
    await Promise.all([
      storageFactory.delete('testStore', addedKey1),
      storageFactory.delete('inlineKeyStore', addedKey2),
      storageFactory.delete('inlineAutoIncrement', addedKey3),
    ]);
  });

  it('should find one', async () => {
    const record1 = await storageFactory.findOne(
      'testStore',
      testData.testStore.key
    );
    expect(record1).toStrictEqual<StoreRecord<TestDBSchema>>(
      testData.testStore
    );

    const record2 = await storageFactory.findOne(
      'inlineKeyStore',
      'john_smith_unknow_key'
    );
    expect(record2).toBe(null);
  });

  it('should find all', async () => {
    const records = await storageFactory.findAll('testStore');
    expect(records.length).toEqual(1);

    expect(records).toStrictEqual<StoreRecord<TestDBSchema>[]>([
      testData.testStore,
    ]);

    const record3 = await storageFactory.findAll('inlineAutoIncrement');
    expect(record3).toStrictEqual([
      {
        key: expect.any(Number),
        value: {
          data: {
            id: expect.any(Number),
            value: testData.inlineAutoIncrement.value.data.value,
          },
        },
      },
    ]);
  });

  it('should update value in store', async () => {
    const updateFn = jest.fn((storeName: StoreNames<TestDBSchema>) =>
      storageFactory.update(storeName, testData.inlineKeyStore.value.inlineId, {
        name: 'Jean Kamdem',
      })
    );

    expect(updateFn('inlineKeyStore')).resolves.not.toThrow();
    expect(updateFn('testStore')).rejects.toThrow(
      `No such key as john_smith_key in store`
    );
  });

  it('should delete value in store', () => {
    const inlineId = testData.inlineKeyStore.value.inlineId;
    expect(
      storageFactory.delete('inlineKeyStore', inlineId)
    ).resolves.not.toThrow();

    expect(
      storageFactory.delete('someStore' as StoreNames<TestDBSchema>, inlineId)
    ).rejects.toThrow('No objectStore named someStore in this database');
  });

  it('should delete many values in store', () => {
    const keysToBeDelected: IDBValidKey[] = [
      testData.inlineKeyStore.value.inlineId,
    ];

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
    expect(itemCount).toEqual(1);

    const indexItemCount = await storageFactory.count('inlineKeyStore', {
      indexName: 'byEmail',
    });
    expect(indexItemCount).toEqual(1);

    const incrementItemCount = await storageFactory.count(
      'inlineAutoIncrement'
    );
    expect(incrementItemCount).toEqual(1);
  });

  it('should retrieves values in an index that match the query.', async () => {
    const records = await storageFactory.findManyByIndex(
      'inlineKeyStore',
      'byEmail'
    );
    expect(records.length).toEqual(1);

    expect(records).toStrictEqual<StoreRecordValue<TestDBSchema>[]>([
      testData.inlineKeyStore.value,
    ]);
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
        await storageFactory.delete('testStore', 'tx_key_1', transaction);
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
