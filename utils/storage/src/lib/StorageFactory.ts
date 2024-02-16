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
} from './Storage.types';

/**
 * A factory class for indexedDB's common CRUD operations
 */
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
   * @returns the newly added key
   */
  async insert(storeName: StoreNames<T>, payload: StoreRecord<T>) {
    if (!this.db) this.db = await this.#dbPromise;

    return await this.db.add(storeName, payload.value, payload.key);
  }

  /**
   * Retrieves the value of the first record in a store
   *
   * @param storeName Name of the store
   * @param key record key
   * @returns an object with `key` and `value`
   */
  async findOne(
    storeName: StoreNames<T>,
    key: IDBValidKey
  ): Promise<StoreRecord<T> | null> {
    if (!this.db) this.db = await this.#dbPromise;

    const value = await this.db.get(storeName, key as StoreRecordKey<T>);
    if (!value) return null;
    return { key: key as StoreRecordKey<T>, value } satisfies StoreRecord<T>;
  }

  /**
   * Retrieves the records in a store
   *
   * @param storeName Name of the store
   * @returns all the records of the store
   */
  async findAll(storeName: StoreNames<T>) {
    if (!this.db) this.db = await this.#dbPromise;

    const allKeys = await this.db.getAllKeys(storeName);

    const tx = this.db.transaction(storeName, 'readonly');
    const result = await Promise.all([
      ...allKeys.map((key) => tx.store.get(key)),
      tx.done,
    ]);
    
    result.pop();
    return result
      .filter((value) => value !== null)
      .map(
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
   * @param payload item to be put in the store
   */
  async update(
    storeName: StoreNames<T>,
    key: IDBValidKey,
    payload: Partial<StoreRecordValue<T>>
  ) {
    if (!this.db) this.db = await this.#dbPromise;
    const tx = this.db.transaction(storeName);
    const hasKeyPath = Boolean(tx.store.keyPath);
    tx.done;

    const payloadKey = key as StoreRecordKey<T>;
    const value = await this.db.get(storeName, payloadKey);
    if (!value) throw new Error(`No such key as ${payloadKey} in store`);

    await this.db.put(
      storeName,
      { ...value, ...payload },
      hasKeyPath ? undefined : payloadKey
    );
  }

  /**
   * Deletes records in a store matching the given key.
   *
   * @param storeName Name of the store.
   * @param key
   */
  async delete(storeName: StoreNames<T>, key: IDBValidKey) {
    if (!this.db) this.db = await this.#dbPromise;

    await this.db.delete(storeName, key as StoreRecordKey<T>);
  }

  /**
   * Delete all records in a store matching the given keys.
   *
   * In case no key is provided, all records of the store are deleted
   *
   * @param storeName Name of the store
   * @param keys keys to delete
   */
  async deleteMany(storeName: StoreNames<T>, keys?: IDBValidKey[]) {
    if (!this.db) this.db = await this.#dbPromise;

    let allKeys = await this.db.getAllKeys(storeName);
    if (keys) allKeys = allKeys.filter((keys as StoreRecordKey<T>[]).includes);

    const tx = this.db.transaction(storeName, 'readwrite');
    await Promise.all([...allKeys.map((key) => tx.store.delete(key)), tx.done]);
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
  async findManyByIndex(
    storeName: StoreNames<T>,
    indexName: IndexNames<T, StoreNames<T>>,
    query?: Omit<QueryStore<T>, 'indexName'>
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
   * @returns number of occurrences
   */
  async count(storeName: StoreNames<T>, query?: QueryStore<T>) {
    if (!this.db) this.db = await this.#dbPromise;
    if (query?.indexName)
      return await this.db.countFromIndex(storeName, query?.indexName);
    return await this.db.count(storeName, query?.key);
  }
}
