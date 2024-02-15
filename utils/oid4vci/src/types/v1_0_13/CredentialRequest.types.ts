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

export type CredentialResponse = {
  credential: string;
  c_nonce: string;
  c_nonce_expires_in: number;
};
