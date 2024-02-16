import type { DBSchema } from 'idb';

interface WalletDBSchema extends DBSchema {
  profile: {
    // key: string;
    value: {
      name: string;
      age: number;
      email: string;
      profileId: number;
    };
    indexes: { 'by-email': string };
  };
}
