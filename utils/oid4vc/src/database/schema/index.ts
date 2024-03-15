import * as jose from 'jose';
import { DBSchema } from 'idb';
import { ProcessedCredential } from '../../lib/types/issuance';

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

export const dbName = 'OID4VCIServiceStorage';
export const dbVersion = 1;
export const credentialStoreName = 'credentialStore';
export const identityStoreName = 'identityStore';
