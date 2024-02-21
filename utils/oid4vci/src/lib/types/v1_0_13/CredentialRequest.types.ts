export interface CredentialRequestParams {
  credentialTypeSelector: CredentialTypeSelector;
  credentialEndpoint: string;
  keyProof?: KeyProof;
}

export type CredentialTypeSelector =
  | {
      format: 'jwt_vc_json' | 'ldp_vc' | 'jwt_vc_json-ld';
      type: string[];
    }
  | {
      format: 'mso_mdoc';
      doctype: string;
    }
  | {
      format: 'vc+sd-jwt';
      vct: string;
    };

export type KeyProof = JwtKeyProof | CwtKeyProof | LdpVpKeyProof;

export interface JwtKeyProof {
  proof_type: 'jwt';
  jwt: string;
}

interface CwtKeyProof {
  proof_type: 'cwt';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cwt: any; // CBOR
}

interface LdpVpKeyProof {
  proof_type: 'ldp_vp';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ldp_vp: any; // W3C Credential Format
}

export interface CredentialResponse {
  credential: string;
  c_nonce: string;
  c_nonce_expires_in: number;
}

export type ProcessedCredential = SdJwtProcessedCredential;

export interface SdJwtProcessedCredential {
  encoded: string;
  display: DisplayCredential;
}

export interface DisplayCredential {
  id?: string;
  title?: string;
  issuer?: string;
  logo?: string;

  // Specific claims
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}
