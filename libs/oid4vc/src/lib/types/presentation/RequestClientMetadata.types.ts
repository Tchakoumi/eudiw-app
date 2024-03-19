import { JWKSet } from '../issuance';
import { VPFormat } from './Format.types';
import { ResponseType } from './v1_0_20/ResponseType.types';

export interface ClientMetadata {
  client_id?: string;
  id_token_signed_response_alg: string;
  id_token_signing_alg_values_supported?: string[] | string;
  response_types_supported?: ResponseType[] | ResponseType;
  scopes_supported?: string[] | string;
  subject_syntax_types_supported?: string[];
  vp_formats?: VPFormat;
  client_name?: string;
  logo_uri?: string;
  client_purpose?: string;
  jwks_uri?: string;
  jwks?: JWKSet;
  authorization_signed_response_alg?: string;
  authorization_encrypted_response_alg?: string;
  authorization_encrypted_response_enc?: string;
  [x: string]: unknown; // Index signature for other properties
}

export interface ResolvedClientMetadata
  extends Omit<ClientMetadata, 'jwks_uri'> {}
