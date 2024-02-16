import type { DBSchema } from 'idb';

interface WalletDBSchema extends DBSchema {
  profile: {
    // key: string;
    value: {
      name: string;
      age: number;
      email: string;
      // will be auto incremented
      profileId?: number;
    };
    indexes: { 'by-email': string };
  };
}
