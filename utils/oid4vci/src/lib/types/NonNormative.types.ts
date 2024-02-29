import { CredentialRequest } from './v1_0_13';
import * as jose from 'jose';

export enum ServiceResponseStatus {
  Success = 'success',
  Error = 'error',
}

export interface ServiceResponse {
  status: ServiceResponseStatus;
  payload: unknown;
}

export interface CredentialRequestParams {
  request: CredentialRequest;
  credentialEndpoint: string;
  accessToken: string;
}

export type ProcessedCredential = SdJwtProcessedCredential;

export interface SdJwtProcessedCredential {
  encoded: string;
  display: DisplayCredential;
}

export interface DisplayCredential {
  id?: number;
  title?: string;
  issuer?: string;
  logo?: string;
  issued_at?: number;

  // Specific claims
  claims?: {
    [x: string]: unknown;
  };
}

export interface Record {
  key: string | number;
  value: SdJwtProcessedCredential | jose.JWK;
}
