import { ErrorResponse } from './Generic.types';
import { UniformCredentialOffer } from './CredentialIssuance.types';
import { EndpointMetadata } from './ServerMetadata.types';

export enum Encoding {
  FORM_URL_ENCODED = 'application/x-www-form-urlencoded',
  UTF_8 = 'UTF-8',
}

export interface OpenIDResponse<T> {
  origResponse: Response;
  successBody?: T;
  errorBody?: ErrorResponse;
}

export interface AccessTokenRequestOpts {
  credentialOffer?: UniformCredentialOffer;
  credentialIssuer?: string;
  asOpts?: AuthorizationServerOpts;
  metadata?: EndpointMetadata;
  codeVerifier?: string; // only required for authorization flow
  code?: string; // only required for authorization flow
  redirectUri?: string; // only required for authorization flow
  pin?: string; // Pin-number. Only used when required
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
  token_type?: string;
  expires_in?: number; // in seconds
  c_nonce?: string;
  c_nonce_expires_in?: number; // in seconds
  authorization_pending?: boolean;
  interval?: number; // in seconds
}

export interface AccessTokenRequest {
  client_id?: string;
  code?: string;
  code_verifier?: string;
  grant_type: GrantTypes;
  'pre-authorized_code': string;
  redirect_uri?: string;
  scope?: string;
  user_pin?: string;
}

export enum GrantTypes {
  AUTHORIZATION_CODE = 'authorization_code',
  PRE_AUTHORIZED_CODE = 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
  PASSWORD = 'password',
}

export interface IssuerOpts {
  issuer: string;
  tokenEndpoint?: string;
  fetchMetadata?: boolean;
}

export enum AuthzFlowType {
  AUTHORIZATION_CODE_FLOW = 'Authorization Code Flow',
  PRE_AUTHORIZED_CODE_FLOW = 'Pre-Authorized Code Flow',
}
