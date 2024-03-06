import * as jose from 'jose';

/**
 * A Client makes a Credential Request to the Credential Endpoint by sending the
 * following parameters in the entity-body of an HTTP POST request using the
 * application/json media type.
 */
export type CredentialRequest = CredentialTypeSelector & {
  /**
   * Object containing the proof of possession of the cryptographic key material
   * the issued Credential would be bound to. The proof object is REQUIRED if the
   * proof_types_supported parameter is non-empty and present in the
   * credential_configurations_supported parameter of the Issuer metadata for the
   * requested Credential.
   */
  proof?: KeyProof;

  /**
   * REQUIRED when credential_identifiers parameter was returned from the Token
   * Response. It MUST NOT be used otherwise. It is a String that identifies a
   * Credential that is being requested to be issued. When this parameter is used,
   * the format parameter and any other Credential format specific parameters such
   * as those defined in Appendix A MUST NOT be present.
   */
  credential_identifier?: string;

  /**
   * Object containing information for encrypting the Credential Response. If this
   * request element is not present, the corresponding credential response returned
   * is not encrypted.
   */
  credential_response_encryption?: {
    /**
     * Object containing a single public key as a JWK used for encrypting the Credential Response.
     */
    jwk: jose.JWK;

    /**
     * JWE alg algorithm for encrypting Credential Responses.
     */
    alg: string;

    /**
     * JWE enc algorithm for encrypting Credential Responses.
     */
    enc: string;
  };
};

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
