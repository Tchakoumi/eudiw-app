// Define enums for JWT and LDP formats
export enum JwtFormat {
  JWT = 'jwt',
  JWT_VC = 'jwt_vc',
  JWT_VP = 'jwt_vp',
}

export enum LdpFormat {
  LPD = 'ldp',
  LDP_VC = 'ldp_vc',
  LDP_VP = 'ldp_vp',
}
export enum SdJwtFormat {
  VC_SD_JWT = 'vc+sd-jwt',
  // VP_SD_JWT = 'vp+sd-jwt',
}

export interface SdJwtObject {
  ['sd-jwt_alg_values']?: Array<string>;
  ['kb-jwt_alg_values']?: Array<string>;
}

export interface JwtObject {
  alg: Array<string>;
}

export interface LdpObject {
  proof_type: Array<string>;
}

export interface DiObject {
  proof_type: Array<string>;
  cryptosuite: Array<string>;
}

// Define the format types using mapped types
export type FormatType<T extends string, K extends object> = {
  [format in T]?: K;
};

// Define the specific format types
export type JwtFormatType = FormatType<JwtFormat, JwtObject>;
export type LdpFormatType = FormatType<LdpFormat, LdpObject>;
export type SDJwtFormatType = FormatType<SdJwtFormat, SdJwtObject>;

// Export the combined format type
export type VPFormat = JwtFormatType | LdpFormatType | SDJwtFormatType;
