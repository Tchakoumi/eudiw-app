import * as jose from 'jose';
import { DBSchema, StoreNames } from 'idb';
import { ProcessedCredential } from '../lib/types';

export interface OID4VCIServiceDBSchema extends DBSchema {
  credentialStore: {
    key: number;
    value: ProcessedCredential;
  };
  identityStore: {
    key: string;
    value: jose.JWK;
  };
}

export const credentialStoreName: StoreNames<OID4VCIServiceDBSchema> =
  'credentialStore';

export const identityStoreName: StoreNames<OID4VCIServiceDBSchema> =
  'identityStore';
