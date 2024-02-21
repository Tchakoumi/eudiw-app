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

export type KeyProof =
  | {
      proof_type: 'jwt';
      jwt: string;
    }
  | {
      proof_type: 'cwt';
      cwt: string;
    }
  | {
      proof_type: 'ldp_vp';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ldp_vp: any; // W3C Credential Format
    };

export interface CredentialResponse {
  credential: string;
  c_nonce: string;
  c_nonce_expires_in: number;
}
