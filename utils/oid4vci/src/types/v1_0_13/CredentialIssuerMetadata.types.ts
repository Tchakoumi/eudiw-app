/**
 * The Credential Issuer Metadata contains information on the Credential Issuer's technical capabilities,
 * supported Credentials, and (internationalized) display information.
 * @link https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0-13.html#name-credential-issuer-metadata
 */
export interface CredentialIssuerMetadata {
  /**
   * The Credential Issuer's identifier.
   */
  credential_issuer: string;

  /**
   * Array of strings, where each string is an identifier of the OAuth 2.0 Authorization Server (as defined in [RFC8414])
   * the Credential Issuer relies on for authorization. If this parameter is omitted, the entity providing the Credential
   * Issuer is also acting as the Authorization Server, i.e., the Credential Issuer's identifier is used to obtain the
   * Authorization Server metadata.
   *
   * When there are multiple entries in the array, the Wallet may be able to determine which Authorization Server to use
   * by querying the metadata; for example, by examining the grant_types_supported values, the Wallet can filter the server
   * to use based on the grant type it plans to use. When the Wallet is using authorization_server parameter in the Credential
   * Offer as a hint to determine which Authorization Server to use out of multiple, the Wallet MUST NOT proceed with the
   * flow if the authorization_server Credential Offer parameter value does not match any of the entries in the
   * authorization_servers array.
   */
  authorization_servers?: string[];

  /**
   * URL of the Credential Issuer's Credential Endpoint.
   * This URL MUST use the https scheme and MAY contain port, path, and query parameter components.
   */
  credential_endpoint: string;

  /**
   * URL of the Credential Issuer's Batch Credential Endpoint.
   * This URL MUST use the https scheme and MAY contain port, path, and query parameter components.
   * If omitted, the Credential Issuer does not support the Batch Credential Endpoint.
   */
  batch_credential_endpoint?: string;

  /**
   * URL of the Credential Issuer's Deferred Credential Endpoint.
   * This URL MUST use the https scheme and MAY contain port, path, and query parameter components.
   * If omitted, the Credential Issuer does not support the Deferred Credential Endpoint.
   */
  deferred_credential_endpoint?: string;

  /**
   * URL of the Credential Issuer's Notification Endpoint.
   * This URL MUST use the https scheme and MAY contain port, path, and query parameter components.
   * If omitted, the Credential Issuer does not support the Notification Endpoint.
   */
  notification_endpoint?: string;

  /**
   * Object containing information about whether the Credential Issuer supports encryption of
   * the Credential and Batch Credential Response on top of TLS.
   */
  credential_response_encryption?: CredentialResponseEncryption;

  /**
   * Boolean value specifying whether the Credential Issuer supports returning credential_identifiers
   * parameter in the authorization_details Token Response parameter, with true indicating support.
   * If omitted, the default value is false.
   */
  credential_identifiers_supported?: boolean;

  /**
   * String that is a signed JWT. This JWT contains Credential Issuer metadata parameters as claims.
   * The signed metadata MUST be secured using JSON Web Signature (JWS) [RFC7515] and MUST contain
   * an iat (Issued At) claim, an iss (Issuer) claim denoting the party attesting to the claims in
   * the signed metadata, and sub (Subject) claim matching the Credential Issuer identifier.
   */
  signed_metadata?: string;

  /**
   * An array of objects, where each object contains display properties of a Credential Issuer for
   * a certain language.
   */
  display?: MetadataDisplay[];

  /**
   * Object that describes specifics of the Credential that the Credential Issuer supports issuance
   * of. This object contains a list of name/value pairs, where each name is a unique identifier
   * of the supported Credential being described. This identifier is used in the Credential Offer
   * to communicate to the Wallet which Credential is being offered.
   */
  credential_configurations_supported: {
    [key: string]: CredentialSupported;
  };
}

/**
 * Contains information about whether the Credential Issuer supports encryption of
 * the Credential and Batch Credential Response on top of TLS.
 */
export interface CredentialResponseEncryption {
  /**
   * Array containing a list of the JWE [RFC7516] encryption algorithms (alg values) [RFC7518] supported
   * by the Credential and Batch Credential Endpoint to encode the Credential or Batch Credential Response
   * in a JWT [RFC7519].
   */
  alg_values_supported: string[];

  /**
   * Array containing a list of the JWE [RFC7516] encryption algorithms (enc values) [RFC7518] supported
   * by the Credential and Batch Credential Endpoint to encode the Credential or Batch Credential Response
   * in a JWT [RFC7519].
   */
  enc_values_supported: string[];

  /**
   * Boolean value specifying whether the Credential Issuer requires the additional encryption on top of
   * TLS for the Credential Response. If the value is true, the Credential Issuer requires encryption
   * for every Credential Response and therefore the Wallet MUST provide encryption keys in the
   * Credential Request. If the value is false, the Wallet MAY chose whether it provides encryption
   * keys or not.
   */
  encryption_required: boolean;
}

/**
 * Contains display properties of a Credential Issuer for a certain language.
 */
export interface MetadataDisplay {
  /**
   * String value of a display name for the Credential Issuer.
   */
  name?: string;

  /**
   * String value that identifies the language of this object represented as
   * a language tag taken from values defined in BCP47 [RFC5646]. There MUST
   * be only one object for each language identifier.
   */
  locale?: string;

  /**
   * Object with information about the logo of the Credential Issuer.
   */
  logo?: {
    /**
     * REQUIRED. String value that contains a URI where the Wallet can obtain
     * the logo of the Credential Issuer. The Wallet needs to determine the
     * scheme, since the URI value could use the `https:` scheme, the `data:`
     * scheme, etc.
     */
    uri?: string;

    /**
     * @deprecated Use `uri`.
     */
    url?: string;

    /**
     * String value of the alternative text for the logo image.
     */
    alt_text?: string;
  };
}

/**
 * Entry for attribute credential_configurations_supported.
 */
export type CredentialSupported =
  | CommonCredentialSupported
  | CredentialSupportedJwtVcJson
  | CredentialSupportedJwtVcJsonLdAndLdpVc
  | CredentialSupportedMsoMdoc
  | CredentialSupportedSdJwtVc;

/**
 * Generic entry for attribute credential_configurations_supported.
 */
interface CommonCredentialSupported {
  /**
   * String identifying the format of this Credential, i.e., `jwt_vc_json` or `ldp_vc`. Depending on the format
   * value, the object contains further elements defining the type and (optionally) particular claims the
   * Credential MAY contain and information about how to display the Credential.
   */
  format: string;

  /**
   * String identifying the scope value that this Credential Issuer supports for this particular Credential
   */
  scope?: string;

  /**
   * Array of case sensitive strings that identify how the Credential is bound
   * to the identifier of the End-User who possesses the Credential.
   */
  cryptographic_binding_methods_supported?: string[];

  /**
   * Array of case sensitive strings that identify the cryptographic suites that
   * are supported for the cryptographic_binding_methods_supported.
   */
  cryptographic_suites_supported?: string[];

  /**
   * Will replace `cryptographic_suites_supported`.
   */
  credential_signing_alg_values_supported?: string[];

  /**
   * Array of case sensitive strings, each representing a proof_type that the Credential Issuer supports,
   * one of which MUST be used in the Credential Request. If this array is non-empty and present,
   * the Credential Issuer requires proof of possession of the cryptographic key material. If the parameter
   * is omitted or the array is empty, the Credential Issuer does not require proof of possession of the
   * cryptographic key material.
   */
  proof_types?: string[];

  /**
   * Array of objects, where each object contains the display properties of the supported Credential for
   * a certain language.
   */
  display?: CredentialSupportedDisplay[];
}

export interface CredentialSupportedDisplay extends MetadataDisplay {
  /**
   * String value of a description of the Credential.
   */
  description?: string;

  /**
   * String value of a background color of the Credential represented as numerical color values.
   */
  background_color?: string;

  /**
   * String value of a text color of the Credential represented as numerical color values.
   */
  text_color?: string;
}

/**
 * Specifies normative fields for JWT VCs.
 */
export interface CredentialSupportedJwtVcJson
  extends CommonCredentialSupported {
  /**
   * String identifying the format of this Credential.
   * @type {'jwt_vc_json'}
   */
  format: string;

  /**
   * Object containing the detailed description of the Credential type.
   */
  credential_definition: {
    /**
     * Array designating the types a certain Credential type supports.
     */
    type: string[];

    /**
     * Object containing a list of name/value pairs, where each name identifies a claim offered in
     * the Credential. The value can be another such object (nested data structures), or an array
     * of such objects.
     */
    credentialSubject?: IssuerCredentialSubject;
  };

  /**
   * Array of the claim name values that lists them in the order they should be displayed by the Wallet.
   */
  order?: string[];
}

/**
 * Specifies normative fields for W3C VCs as per the VC data model format.
 */
export interface CredentialSupportedJwtVcJsonLdAndLdpVc
  extends CommonCredentialSupported {
  /**
   * String identifying the format of this Credential.
   * @type {'ldp_vc' | 'jwt_vc_json-ld'}
   */
  format: string;

  /**
   * Object containing the detailed description of the Credential type.
   */
  credential_definition: {
    /**
     * Context array as per the VC data model specification.
     */
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    '@context': (string | Record<string, any>)[];

    /**
     * Array designating the types a certain Credential type supports.
     */
    type: string[];

    /**
     * Object containing a list of name/value pairs, where each name identifies a claim offered in
     * the Credential. The value can be another such object (nested data structures), or an array
     * of such objects.
     */
    credentialSubject?: IssuerCredentialSubject;
  };

  /**
   * Array of the claim name values that lists them in the order they should be displayed by the Wallet.
   */
  order?: string[];
}

/**
 * Specifies normative fields for SD-JWT VCs.
 */
export interface CredentialSupportedMsoMdoc extends CommonCredentialSupported {
  /**
   * String identifying the format of this Credential.
   * @type {'mso_mdoc'}
   */
  format: string;

  /**
   * String identifying the Credential type, as defined in [ISO.18013-5].
   */
  doctype: string;

  /**
   * Object containing a list of name/value pairs, where the name is a certain namespace
   * as defined in [ISO.18013-5] (or any profile of it), and the value is an object.
   * This object also contains a list of name/value pairs, where the name is a claim name
   * value that is defined in the respective namespace and is offered in the Credential.
   * The value is an object detailing the specifics of the claim.
   */
  claims?: {
    [key: string]: IssuerCredentialSubject;
  };

  /**
   * Array of namespaced claim name values that lists them in the order they should be
   * displayed by the Wallet. The values MUST be two strings separated by a tilde (`~`)
   * character, where the first string is a namespace value and a second is a claim name
   * value. For example, `org.iso.18013.5.1~given_name`.
   */
  order?: string[];
}

/**
 * Specifies normative fields for SD-JWT VCs.
 */
export interface CredentialSupportedSdJwtVc extends CommonCredentialSupported {
  /**
   * String identifying the format of this Credential.
   * @type {'vc+sd-jwt'}
   */
  format: string;

  /**
   * String designating the type of a Credential.
   */
  vct: string;

  /**
   * Object containing a list of name/value pairs, where each name identifies a claim about the subject
   * offered in the Credential. The value can be another such object (nested data structures), or an
   * array of such objects.
   */
  claims?: IssuerCredentialSubject;

  /**
   * Array of the claim name values that lists them in the order they should be displayed by the Wallet.
   */
  order?: string[];
}

export interface IssuerCredentialSubject {
  [key: string]: IssuerCredentialSubjectDisplay;
}

export type IssuerCredentialSubjectDisplay =
  | CredentialSubjectDisplay
  | { [key: string]: IssuerCredentialSubjectDisplay };

export interface CredentialSubjectDisplay {
  /**
   * Boolean which when set to true indicates the claim MUST be present in the issued Credential.
   * If the mandatory property is omitted its default should be assumed to be false.
   */
  mandatory?: boolean;

  /**
   * String value determining type of value of the claim. A non-exhaustive list of valid values
   * defined by this specification are string, number, and image media types such as image/jpeg
   * as defined in IANA media type registry for images.
   * @link https://www.iana.org/assignments/media-types/media-types.xhtml#image
   */
  value_type?: string;

  /**
   * An array of objects, where each object contains display properties of a certain claim in
   * the Credential for a certain language.
   */
  display?: Array<{
    /**
     * String value of a display name for the claim.
     */
    name?: string;

    /**
     * String value that identifies the language of this object represented as
     * a language tag taken from values defined in BCP47 [RFC5646]. There MUST
     * be only one object for each language identifier.
     */
    locale?: string;
  }>;
}
