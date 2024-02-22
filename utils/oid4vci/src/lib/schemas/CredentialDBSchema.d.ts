import { DBSchema } from 'idb';
import { ProcessedCredential } from '../types';
import { StorageFactory } from '@datev/storage';

export interface CredentialDBSchema extends DBSchema {
  credentialStore: {
    key: string;
    value: ProcessedCredential;
  };
}

// export const credentialStoreName = 'credentialStore' as const;
export type CredentialStorage = StorageFactory<CredentialDBSchema>;
