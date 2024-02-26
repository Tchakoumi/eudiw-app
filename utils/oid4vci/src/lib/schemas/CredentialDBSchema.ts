import { DBSchema, StoreNames } from 'idb';
import { ProcessedCredential } from '../types';
import { StorageFactory } from '@datev/storage';

/**
 * Schema for persisting credentials to wallet storage.
 *
 * Implementers MUST support autoincrement on key path `display.id`.
 */
export interface CredentialDBSchema extends DBSchema {
  credentialStore: {
    key: number;
    value: ProcessedCredential;
  };
}

export const credentialStoreName: StoreNames<CredentialDBSchema> =
  'credentialStore';

export type CredentialStorage = StorageFactory<CredentialDBSchema>;
