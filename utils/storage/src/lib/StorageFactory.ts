import {
  DBSchema,
  IDBPDatabase,
  OpenDBCallbacks,
  StoreKey,
  StoreNames,
  StoreValue,
  openDB,
} from 'idb';

/**
 * A factory class for indexedDB's common CRUD operations
 */
export class StorageFactory<T extends DBSchema> {
  private dbName: string;
  private dbVersion: number;
  private db: IDBPDatabase<T> | null = null;
  private openDBCallbacks: OpenDBCallbacks<T> | undefined;

  constructor(
    dbName: string,
    dbVersion = 1,
    openDBCallbacks?: OpenDBCallbacks<T>
  ) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.openDBCallbacks = openDBCallbacks;
  }

  /**
   * Open a database
   */
  async init() {
    this.db = await openDB<T>(
      this.dbName,
      this.dbVersion,
      this.openDBCallbacks
    );
  }

  /**
   * Insert new value to a given store of your indexedDB. This method will failed if the key you're trying to add already exist
   * @param storeName The name of the store you want to insert data to. Stores are simalar to collections
   * @param payload Data to be stored in key/value format 
   * @returns the newly added keys
   */
  async insert(
    storeName: StoreNames<T>,
    payload: {
      key: StoreKey<T, StoreNames<T>>;
      value: StoreValue<T, StoreNames<T>>;
    }
  ) {
    if (!this.db) throw new Error('Database not initialized !');

    return await this.db.add(storeName, payload.value, payload.key);
  }
}
