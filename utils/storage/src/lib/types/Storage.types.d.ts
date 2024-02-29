import type {
  IDBPTransaction,
  IndexNames,
  StoreKey,
  StoreNames,
  StoreValue,
} from 'idb';

type StoreRecordKey<T> = StoreKey<T, StoreNames<T>>;
type StoreRecordValue<T> = StoreValue<T, StoreNames<T>>;
type StoreIndexNames<T, S extends StoreNames<T>> = IndexNames<T, S>;
type StoreRecord<T> = {
  /**
   * Should not be provided for object stores using in-line keys.
   *
   * for example a profile object store using `profileId` as keyPath
   */
  key?: StoreRecordKey<T>;
  value: StoreRecordValue<T>;
};
type QueryStore<T, S> = {
  key?: IDBKeyRange;
  count?: number;
  indexName: StoreIndexNames<T, S>;
};

type StorageTransaction<T, M extends IDBTransactionMode> = IDBPTransaction<
  T,
  StoreNames<T>[],
  M
>;
interface TransactionCallback<T, M extends IDBTransactionMode> {
  (tx: StorageTransaction<T, M>): void | Promise<void>;
}

type MethodNames<T extends DBSchema> = keyof StorageFactory<T>;
type StorageMethodType<T extends DBSchema> = StorageFactory<T>[MethodNames<T>];
