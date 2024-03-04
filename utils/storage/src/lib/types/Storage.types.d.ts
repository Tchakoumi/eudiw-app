import type {
  IDBPTransaction,
  IndexNames,
  StoreKey,
  StoreNames,
  StoreValue,
} from 'idb';
import type { StorageFactory } from '../../core/StorageFactory';

type StoreRecordKey<T, S extends StoreNames<T> = StoreNames<T>> = StoreKey<
  T,
  S
>;
type StoreRecordValue<T, S extends StoreNames<T> = StoreNames<T>> = StoreValue<
  T,
  S
>;
type StoreIndexNames<T, S extends StoreNames<T>> = IndexNames<T, S>;
type StoreRecord<T, S extends StoreNames<T> = StoreNames<T>> = {
  /**
   * Should not be provided for object stores using in-line keys.
   *
   * for example a profile object store using `profileId` as keyPath
   */
  key?: StoreRecordKey<T, S>;
  value: StoreRecordValue<T, S>;
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

type MethodNames = keyof StorageFactory<T>;
type StorageMethodType<T extends DBSchema> = StorageFactory<T>[MethodNames<T>];
