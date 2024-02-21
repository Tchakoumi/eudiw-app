import {
  DBSchema,
  IDBPDatabase,
  IndexNames,
  OpenDBCallbacks,
  StoreNames,
  openDB,
} from 'idb';
import {
  StoreRecord,
  StoreRecordKey,
  StoreRecordValue,
  QueryStore,
  StorageTransaction,
  TransactionCallback,
} from './Storage.types';
import { ApplyClassWrapper } from './error/ApplyClassWrapper';
import { storageErrorHandler } from './error/StorageErrorHandler';

/**
 * A factory class for indexedDB's common CRUD operations
 */
@ApplyClassWrapper(storageErrorHandler)
export class StorageFactory<T extends DBSchema> {
  /** Opened database */
  private db: IDBPDatabase<T> | null = null;
  /**
   * Promise returning an open database
   */
  #dbPromise: Promise<IDBPDatabase<T>>;

  /**
   * Open a database
   *
   * It creates a new database when is called for the first time.
   *
   * This function is called by the constructor and must not be explicitly called by consumer.
   *
   * @param dbName Name of the indexedDB
   * @param [dbVersion=1] database version
   * @param openDBCallbacks Addittional callbacks
   */
  constructor(
    dbName: string,
    dbVersion = 1,
    openDBCallbacks?: OpenDBCallbacks<T>
  ) {
    this.#dbPromise = openDB<T>(dbName, dbVersion, openDBCallbacks);
  }

  /**
   * Insert new value to a given store of your indexedDB.
   *
   * This method will failed if the key you're trying to add already exist
   *
   * @param storeName The name of the store you want to insert data to. Stores are simalar to collections
   * @param payload Data to be stored in key/value format
   * @param tx opened transaction
   * @returns the newly added key
   */
  async insert(
    storeName: StoreNames<T>,
    payload: StoreRecord<T>,
    tx?: StorageTransaction<T, 'readwrite'>
  ) {
    if (!this.db) this.db = await this.#dbPromise;

    if (tx) {
      const store = tx.objectStore(storeName);
      return await store.add(payload.value, payload.key);
    }
    return await this.db.add(storeName, payload.value, payload.key);
  }

  /**
   * Retrieves the value of the first record in a store
   *
   * @param storeName Name of the store
   * @param key record key
   * @param tx opened transaction
   * @returns an object with `key` and `value`
   */
  async findOne(
    storeName: StoreNames<T>,
    key: IDBValidKey,
    tx?: StorageTransaction<T, 'readonly' | 'readwrite'>
  ): Promise<StoreRecord<T> | null> {
    if (!this.db) this.db = await this.#dbPromise;

    let value: StoreRecordValue<T> | undefined;
    const storedKey = key as StoreRecordKey<T>;

    if (tx) value = await tx.objectStore(storeName).get(storedKey);
    else value = await this.db.get(storeName, key as StoreRecordKey<T>);

    if (!value) return null;
    return { key: storedKey, value } satisfies StoreRecord<T>;
  }

  /**
   * Retrieves the records in a store
   *
   * @param storeName Name of the store
   * @param tx opened transaction
   * @returns all the records of the store
   */
  async findAll(
    storeName: StoreNames<T>,
    tx?: StorageTransaction<T, 'readonly' | 'readwrite'>
  ) {
    if (!this.db) this.db = await this.#dbPromise;

    const allKeys = await this.db.getAllKeys(storeName);

    const txn = tx ?? this.db.transaction(storeName, 'readonly');
    const result = await Promise.all([
      ...allKeys.map((key) => txn.objectStore(storeName).get(key)),
    ]);

    if (!tx) await txn.done;
    return result.map(
      (value, i) =>
        ({
          key: allKeys[i],
          value: value as StoreRecord<T>['value'],
        } satisfies StoreRecord<T>)
    );
  }

  /**
   * Puts an item in the store. Replaces any item with the same key.
   *
   * @param storeName Name of the store
   * @param key key of the item to be updated
   * @param payload item to be put in the store
   * @param tx opened transaction
   */
  async update(
    storeName: StoreNames<T>,
    key: IDBValidKey,
    payload: Partial<StoreRecordValue<T>>,
    tx?: StorageTransaction<T, 'readwrite'>
  ) {
    if (!this.db) this.db = await this.#dbPromise;
    const txn = tx ?? this.db.transaction(storeName, 'readwrite');
    const store = txn.objectStore(storeName);
    const hasKeyPath = Boolean(store.keyPath);

    const payloadKey = key as StoreRecordKey<T>;
    const value = await store.get(payloadKey);

    if (!value) throw new Error(`No such key as ${payloadKey} in store`);

    await store.put(
      { ...value, ...payload },
      hasKeyPath ? undefined : payloadKey
    );
    if (!tx) await txn.done;
  }

  /**
   * Deletes records in a store matching the given key.
   *
   * @param storeName Name of the store.
   * @param key
   * @param tx opened transaction
   */
  async delete(
    storeName: StoreNames<T>,
    key: IDBValidKey,
    tx?: StorageTransaction<T, 'readwrite'>
  ) {
    if (!this.db) this.db = await this.#dbPromise;

    const storedKey = key as StoreRecordKey<T>;
    if (tx) await tx.objectStore(storeName).delete(storedKey);
    else await this.db.delete(storeName, storedKey);
  }

  /**
   * Delete all records in a store matching the given keys.
   *
   * In case no key is provided, all records of the store are deleted
   *
   * @param storeName Name of the store
   * @param keys keys to delete
   * @param tx opened transaction
   */
  async deleteMany(
    storeName: StoreNames<T>,
    keys?: IDBValidKey[],
    tx?: StorageTransaction<T, 'readwrite'>
  ) {
    if (!this.db) this.db = await this.#dbPromise;

    let allKeys = await this.db.getAllKeys(storeName);
    if (keys) {
      allKeys = allKeys.filter((key) =>
        (keys as StoreRecordKey<T>[]).includes(key)
      );
    }
    const txn = tx ?? this.db.transaction(storeName, 'readwrite');
    await Promise.all([
      ...allKeys.map((key) => {
        const store = txn.objectStore(storeName);
        return store.delete(key);
      }),
    ]);
    if (!tx) await txn.done;
  }

  /**
   * Retrieves values in an index that match the query.
   *
   * @param storeName Name of the store
   * @param indexName Name of the index in the store
   * @param count Number of occurrences you want to retrieve
   * @param query
   * @returns records with the given index
   */
  async findManyByIndex<S extends StoreNames<T>>(
    storeName: S,
    indexName: IndexNames<T, S>,
    query?: Omit<QueryStore<T, S>, 'indexName'>
  ) {
    if (!this.db) this.db = await this.#dbPromise;

    return await this.db.getAllFromIndex(
      storeName,
      indexName,
      query?.key,
      query?.count
    );
  }

  /**
   * Retrieves the number of records matching the given query in a store.
   *
   * @param storeName Name of the store
   * @param query query params
   * @param tx opened transaction
   * @returns number of occurrences
   */
  async count<S extends StoreNames<T>>(
    storeName: S,
    query?: QueryStore<T, S>,
    tx?: StorageTransaction<T, 'readonly' | 'readwrite'>
  ) {
    if (!this.db) this.db = await this.#dbPromise;

    if (query?.indexName)
      return await this.db.countFromIndex(storeName, query?.indexName);
    else if (tx) {
      return await tx.objectStore(storeName).count(query?.key);
    } else return await this.db.count(storeName, query?.key);
  }

  /**
   * Start and close new transaction.
   *
   * @param storeNames Names of the store involved in the transaction
   * @param mode "readonly" | "readwrite"
   * @param callback
   */
  async $transaction<M extends IDBTransactionMode>(
    storeNames: StoreNames<T>[],
    mode: M,
    /**
     * Callback to be executed within the context of the transaction.
     * 
     * Only await the `StorageFactory` methods supporting the `tx` parameter in this callback
     * 
     * @example
     * const transactionCallback: TransactionCallback<DBSchema, 'readwrite'> =
        async (transaction) => {
          const records = storageFactory.findAll('testStore', transaction);
          if(records.length > 0)
            await storageFactory.update('testStore', records[0].key, 'tx_value_2', transaction);
          else await storageFactory.insert(
            'testStore',
            {
              key: 'tx_key_1',
              value: 'tx_value_1',
            },
            transaction
          );
        };
     */
    callback: TransactionCallback<T, M>
  ) {
    if (!this.db) this.db = await this.#dbPromise;

    await callback(this.db.transaction(storeNames, mode));
  }

  /**
   * Deletes all records in a store.
   *
   * @param storeName Name of the store
   */
  async clear(storeName: StoreNames<T>) {
    if (!this.db) this.db = await this.#dbPromise;

    await this.db.clear(storeName);
  }
}
