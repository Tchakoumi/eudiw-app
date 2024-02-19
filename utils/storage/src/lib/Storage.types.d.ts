import { IndexNames, StoreKey, StoreNames, StoreValue } from 'idb';

export type StoreRecordKey<T> = StoreKey<T, StoreNames<T>>;
export type StoreRecordValue<T> = StoreValue<T, StoreNames<T>>;
export type StoreIndexNames<T> = IndexNames<T, StoreNames<T>>;

export type StoreRecord<T> = {
  /**
   * Should not be provided for object stores using in-line keys.
   *
   * for example a profile object store using `profileId` as keyPath
   */
  key?: StoreRecordKey<T>;
  value: StoreRecordValue<T>;
};
export type QueryStore<T> = {
  key?: IDBKeyRange;
  count?: number;
  indexName: StoreIndexNames<T>;
};

export interface TransactionCallback<T> {
  (tx: IDBPTransaction<T, StoreNames<T>[], IDBTransactionMode>): void;
}
