import {
  IDBPTransaction,
  IndexNames,
  StoreKey,
  StoreNames,
  StoreValue,
} from 'idb';

export type StoreRecordKey<T> = StoreKey<T, StoreNames<T>>;
export type StoreRecordValue<T> = StoreValue<T, StoreNames<T>>;
export type StoreIndexNames<T, S extends StoreNames<T>> = IndexNames<T, S>;

export type StoreRecord<T> = {
  /**
   * Should not be provided for object stores using in-line keys.
   *
   * for example a profile object store using `profileId` as keyPath
   */
  key?: StoreRecordKey<T>;
  value: StoreRecordValue<T>;
};
export type QueryStore<T, S> = {
  key?: IDBKeyRange;
  count?: number;
  indexName: StoreIndexNames<T, S>;
};

export type StorageTransaction<
  T,
  M extends IDBTransactionMode
> = IDBPTransaction<T, StoreNames<T>[], M>;
export interface TransactionCallback<T, M extends IDBTransactionMode> {
  (tx: StorageTransaction<T, M>): void | Promise<void>;
}
