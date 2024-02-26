import { CredentialTypeSelector, KeyProof } from './v1_0_13';

export enum ServiceResponseStatus {
  Success = 'success',
  Error = 'error',
}

export interface ServiceResponse {
  status: ServiceResponseStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

export interface CredentialRequestParams {
  credentialTypeSelector: CredentialTypeSelector;
  credentialEndpoint: string;
  keyProof?: KeyProof;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any;
  };
}
