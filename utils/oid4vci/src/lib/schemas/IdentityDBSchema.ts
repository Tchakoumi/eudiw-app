import * as jose from 'jose';
import { DBSchema, StoreNames } from 'idb';

/**
 * Schema for persisting the wallet keypair to storage.
 */
export interface IdentityDBSchema extends DBSchema {
  identityStore: {
    key: string;
    value: jose.JWK;
  };
}

export const identityStoreName: StoreNames<IdentityDBSchema> = 'identityStore';
