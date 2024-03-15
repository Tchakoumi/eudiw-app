import { PresentationDefinition } from '../PresentationExchange.types';
import { RequestClientMetadata } from '../RequestClientMetadata.types';
import { ResponseMode } from './ResponseType.types';

export enum ClientIdScheme {
  PRE_REGISTERED = 'pre-registered',
  REDIRECT_URI = 'redirect_uri',
  ENTITY_ID = 'entity_id',
  DID = 'did',
  VERIFIER_ATTESTATION = 'verifier_attestation',
  X509_SAN_DNS = 'x509_san_dns',
  X509_SAN_URI = 'x509_san_uri',
}

export interface RequestObject extends AuthorizationRequestCommonPayload {
  client_id?: string;
  client_id_scheme?: ClientIdScheme;

  client_metadata?: RequestClientMetadata;
  client_metadata_uri?: string;

  presentation_definition?: PresentationDefinition;
  presentation_definition_uri?: string;

  id_token_type?: string;
  response_uri?: string;
}

export interface AuthorizationRequestCommonPayload
  extends RequestCommonPayload {
  request?: string;
  request_uri?: string;
}
export interface RequestCommonPayload extends JWTPayload {
  scope?: string;
  response_type?: ResponseType | string;
  client_id?: string;
  redirect_uri?: string;
  id_token_hint?: string;
  nonce?: string;
  state?: string;
  response_mode?: ResponseMode;
}

export interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  iat?: number;
  nbf?: number;
  type?: string;
  exp?: number;
  rexp?: number;
  jti?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}
