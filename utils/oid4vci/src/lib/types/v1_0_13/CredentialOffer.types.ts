import { AuthorizationServerMetadata } from '../AuthorizationServerMetadata.types';
import { JwtIssuerMetadata } from '../JwtIssuerMetadata.types';
import { CredentialIssuerMetadata } from './CredentialIssuerMetadata.types';

/**
 * The OpenID for VC Issuance Flow may start with a Credential Offer.
 *
 * @link https://openid.github.io/OpenID4VCI/openid-4-verifiable-credential-issuance-wg-draft.html#name-credential-offer
 */
export interface CredentialOffer {
  /**
   * The URL of the Credential Issuer from which the Wallet is requested to obtain one or more Credentials.
   */
  credential_issuer: string;

  /**
   * Array of unique strings that each identify one of the keys in the name/value pairs stored in the
   * `credential_configurations_supported` Credential Issuer metadata. The Wallet uses these string values
   * to obtain the respective object that contains information about the Credential being offered.
   */
  credential_configuration_ids: string[];

  /**
   * Object indicating to the Wallet the Grant Types the Credential Issuer's Authorization Server is prepared
   * to process for this Credential Offer. Every grant is represented by a name/value pair. The name is the
   * Grant Type identifier; the value is an object that contains parameters either determining the way the
   * Wallet MUST use the particular grant and/or parameters the Wallet MUST send with the respective request(s).
   * If grants is not present or is empty, the Wallet MUST determine the Grant Types the Credential Issuer's
   * Authorization Server supports using the respective metadata. When multiple grants are present, it is at
   * the Wallet's discretion which one to use.
   */
  grants?: Grant;
}

export interface Grant {
  authorization_code?: AuthorizationCodeGrant;
  'urn:ietf:params:oauth:grant-type:pre-authorized_code'?: PreAuthorizedCodeGrant;
}

export interface AuthorizationCodeGrant {
  /**
   * String value created by the Credential Issuer and opaque to the Wallet that is used to bind the
   * subsequent Authorization Request with the Credential Issuer to a context set up during previous steps.
   */
  issuer_state?: string;

  /**
   * String that the Wallet can use to identify the Authorization Server to use with this grant type
   * when authorization_servers parameter in the Credential Issuer metadata has multiple entries.
   * It MUST NOT be used otherwise. The value of this parameter MUST match with one of the values in
   * the authorization_servers array obtained from the Credential Issuer metadata.
   */
  authorization_server?: string;
}

export interface PreAuthorizedCodeGrant {
  /**
   * The code representing the Credential Issuer's authorization for the Wallet to obtain Credentials
   * of a certain type. This code MUST be short lived and single use. If the Wallet decides to use the
   * Pre-Authorized Code Flow, this parameter value MUST be included in the subsequent Token Request
   * with the Pre-Authorized Code Flow.
   */
  'pre-authorized_code': string;

  /**
   * Object specifying whether the Authorization Server expects presentation of a Transaction Code by
   * the End-User along with the Token Request in a Pre-Authorized Code Flow. If the Authorization Server
   * does not expect a Transaction Code, this object is absent; this is the default. The Transaction Code
   * is intended to bind the Pre-Authorized Code to a certain transaction to prevent replay of this code
   * by an attacker that, for example, scanned the QR code while standing behind the legitimate End-User.
   * It is RECOMMENDED to send the Transaction Code via a separate channel. If the Wallet decides to use
   * the Pre-Authorized Code Flow, the Transaction Code value MUST be sent in the tx_code parameter with
   * the respective Token Request as defined in Section 6.1. If no length or description is given, this
   * object may be empty, indicating that a Transaction Code is required.
   */
  tx_code?: {
    /**
     * String specifying the input character set.
     * @default TxCodeInputMode.Numeric
     */
    input_mode?: TxCodeInputMode;

    /**
     * Integer specifying the length of the Transaction Code. This helps the Wallet to render the input
     * screen and improve the user experience.
     */
    length?: number;

    /**
     * String containing guidance for the Holder of the Wallet on how to obtain the Transaction Code,
     * e.g., describing over which communication channel it is delivered.
     */
    description?: string;
  };

  /**
   * The minimum amount of time in seconds that the Wallet SHOULD wait between polling requests to the
   * token endpoint (in case the Authorization Server responds with error code authorization_pending).
   * If no value is provided, Wallets MUST use 5 as the default.
   */
  interval?: number;

  /**
   * String that the Wallet can use to identify the Authorization Server to use with this grant type
   * when authorization_servers parameter in the Credential Issuer metadata has multiple entries.
   * It MUST NOT be used otherwise. The value of this parameter MUST match with one of the values in
   * the authorization_servers array obtained from the Credential Issuer metadata.
   */
  authorization_server?: string;
}

export enum TxCodeInputMode {
  Numeric = 'numeric', // only digits
  Text = 'text', // any characters
}

/**
 * Resolved credential offer object along with credential issuer metadata.
 */
export interface ResolvedCredentialOffer {
  credentialOffer: CredentialOffer;
  discoveryMetadata?: DiscoveryMetadata;
}

/**
 * Payload for discovery metadata.
 */
export interface DiscoveryMetadata {
  credentialIssuerMetadata?: CredentialIssuerMetadata;
  authorizationServerMetadata?: AuthorizationServerMetadata;
  jwtIssuerMetadata?: JwtIssuerMetadata;
}
