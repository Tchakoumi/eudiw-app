import type { DBSchema } from 'idb';

interface WalletDBSchema extends DBSchema {
  test_store: {
    key: string;
    value: string;
  };
}
