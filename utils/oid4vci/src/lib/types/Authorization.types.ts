import { ErrorResponse } from './Generic.types';

export enum Encoding {
  FORM_URL_ENCODED = 'application/x-www-form-urlencoded',
  UTF_8 = 'UTF-8',
}

export interface OpenIDResponse<T> {
  origResponse: Response;
  successBody?: T;
  errorBody?: ErrorResponse;
}

export interface AuthorizationServerOpts {
  allowInsecureEndpoints?: boolean;
  as?: string; // If not provided the issuer hostname will be used!
  tokenEndpoint?: string; // Allows to override the default '/token' endpoint
  clientId?: string;
}

export interface AccessTokenResponse {
  access_token: string;
  scope?: string;
  token_type: string;
  expires_in?: number; // in seconds
  c_nonce?: string;
  c_nonce_expires_in?: number; // in seconds
  authorization_pending?: boolean;
  interval?: number; // in seconds
  refresh_token?: string;
  authorization_details: AuthorizationDetail[];
}

export interface AuthorizationDetail {
  type: string;
  credential_configuration_id: string;
  credential_identifiers?: string[];
}

export interface AccessTokenRequest {
  grant_type: GrantType;
  client_id?: string;
  code?: string;
  code_verifier?: string;
  'pre-authorized_code': string;
  redirect_uri?: string;
  tx_code?: string;
}

export enum GrantType {
  AUTHORIZATION_CODE = 'authorization_code',
  PRE_AUTHORIZED_CODE = 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
}

export interface IssuerOpts {
  issuer: string;
  tokenEndpoint?: string;
}
