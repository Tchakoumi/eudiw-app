import {
  DBSchema,
  IDBPDatabase,
  OpenDBCallbacks,
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
}
