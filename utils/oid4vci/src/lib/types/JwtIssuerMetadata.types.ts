/**
 * JWT Issuer Metadata.
 *
 * @link https://www.ietf.org/archive/id/draft-terbu-sd-jwt-vc-02.html#name-jwt-issuer-metadata-4
 */
export interface JwtIssuerMetadata {
  /**
   * The JWT Issuer identifier, which MUST be identical to the iss value in the JWT.
   */
  issuer: string;

  /**
   * URL string referencing the JWT Issuer's JSON Web Key (JWK) Set [RFC7517] document
   * which contains the JWT Issuer's public keys. The value of this field MUST point to
   * a valid JWK Set document. Use of this parameter is RECOMMENDED, as it allows for
   * easy key rotation.
   */
  jwks_uri?: string;

  /**
   * JWT Issuer's JSON Web Key Set [RFC7517] document value, which contains the JWT
   * Issuer's public keys. The value of this field MUST be a JSON object containing
   * a valid JWK Set.
   */
  jwks?: string;
}
