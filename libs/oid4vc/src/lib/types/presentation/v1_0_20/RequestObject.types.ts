import { JWTPayload } from 'jose';
import { PresentationDefinition } from '../PresentationExchange.types';
import {
  ClientMetadata,
  ResolvedClientMetadata,
} from '../RequestClientMetadata.types';
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

  client_metadata?: ClientMetadata;
  client_metadata_uri?: string;

  presentation_definition?: PresentationDefinition;
  presentation_definition_uri?: string;

  id_token_type?: string;
  response_uri?: string;
}

export interface ResolvedRequestObject extends RequestObject {
  client_metadata?: ResolvedClientMetadata;
  presentation_definition: PresentationDefinition;
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
