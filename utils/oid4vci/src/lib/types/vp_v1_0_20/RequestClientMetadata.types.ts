import { OID4VPFormatType } from './Format.types';

export interface RequestClientMetadata {
  client_id?: string;
  id_token_signing_alg_values_supported?: SigningAlgo[] | SigningAlgo;
  request_object_signing_alg_values_supported?: SigningAlgo[] | SigningAlgo;
  response_types_supported?: ResponseType[] | ResponseType;
  scopes_supported?: Scope[] | Scope;
  subject_types_supported?: SubjectType[] | SubjectType;
  subject_syntax_types_supported?: string[];
  vp_formats?: OID4VPFormatType;
  client_name?: string;
  logo_uri?: string;
  client_purpose?: string;
  [x: string]: unknown; // Index signature for other properties
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
  [x: string]: unknown;
}

export declare enum SigningAlgo {
  EDDSA = 'EdDSA',
  RS256 = 'RS256',
  PS256 = 'PS256',
  ES256 = 'ES256',
  ES256K = 'ES256K',
}

export declare enum Scope {
  OPENID = 'openid',
  OPENID_DIDAUTHN = 'openid did_authn',
  PROFILE = 'profile',
  EMAIL = 'email',
  ADDRESS = 'address',
  PHONE = 'phone',
}

export declare enum SubjectType {
  PUBLIC = 'public',
  PAIRWISE = 'pairwise',
}
