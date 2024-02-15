import {
  DBSchema,
  IDBPDatabase,
  OpenDBCallbacks,
  StoreKey,
  StoreNames,
  StoreValue,
  openDB,
} from 'idb';

export type StoreRecord<T> = {
  key: StoreKey<T, StoreNames<T>>;
  value: StoreValue<T, StoreNames<T>>;
};

/**
 * A factory class for indexedDB's common CRUD operations
 */
export class StorageFactory<T extends DBSchema> {
  private dbName: string;
  private dbVersion: number;
  private db: IDBPDatabase<T> | null = null;
  private openDBCallbacks: OpenDBCallbacks<T> | undefined;
  /**
   * A boolean indicating wheter or not the database was initialized
   */
  isInitialized: boolean = false;

  constructor(
    dbName: string,
    dbVersion = 1,
    openDBCallbacks?: OpenDBCallbacks<T>
  ) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.openDBCallbacks = openDBCallbacks;
    this.init()
      .then(() => console.log('StorageFactory was successfully initialized !'))
      .catch(console.error);
  }

  /**
   * Open a database
   *
   * It creates a new database when is called for the first time.
   * 
   * This function is called by the constructor and must not be explicitly called by consumer.
   */
  async init() {
    this.db = await openDB<T>(
      this.dbName,
      this.dbVersion,
      this.openDBCallbacks
    );
    this.isInitialized = true;
  }

  /**
   * Insert new value to a given store of your indexedDB. This method will failed if the key you're trying to add already exist
   * @param storeName The name of the store you want to insert data to. Stores are simalar to collections
   * @param payload Data to be stored in key/value format
   * @returns the newly added key
   */
  async insert(storeName: StoreNames<T>, payload: StoreRecord<T>) {
    if (!this.db) throw new Error('Database not initialized !');

    return await this.db.add(storeName, payload.value, payload.key);
  }

  /**
   * Retrieves the value of the first record in a store
   * @param storeName Name of the store
   * @param key record key
   * @returns an object with `key` and `value`
   */
  async findOne(
    storeName: StoreNames<T>,
    key: StoreKey<T, StoreNames<T>>
  ): Promise<StoreRecord<T> | null> {
    if (!this.db) throw new Error('Database not initialized !');

    const value = await this.db.get(storeName, key);
    if (!value) return null;
    return { key, value } satisfies StoreRecord<T>;
  }

  /**
   * Retrieves the records in a store
   * @param storeName Name of the store
   * @returns all the records of the store
   */
  async findAll(storeName: StoreNames<T>) {
    if (!this.db) throw new Error('Database not initialized !');

    const allKeys = await this.db.getAllKeys(storeName);
    return Promise.all(allKeys.map((key) => this.findOne(storeName, key)));
  }

  /**
   * Puts an item in the store. Replaces any item with the same key.
   * @param storeName Name of the store
   * @param payload item to be put in the store
   */
  async update(storeName: StoreNames<T>, payload: StoreRecord<T>) {
    if (!this.db) throw new Error('Database not initialized !');

    const key = await this.db.getKey(storeName, payload.key);
    if (!key) throw new Error(`No such key as ${payload.key} in store`);

    await this.db.put(storeName, payload.value, payload.key);
  }

  /**
   * Deletes records in a store matching the given key.
   *
   * @param storeName Name of the store.
   * @param key
   */
  async delete(storeName: StoreNames<T>, key: StoreRecord<T>['key']) {
    if (!this.db) throw new Error('Database not initialized !');

    await this.db.delete(storeName, key);
  }
}
