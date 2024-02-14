import { Grant, ResolvedCredentialOffer } from '../types';

/**
 * A service for handling the OID4VCI flow.
 */
export interface OID4VCIService {
  /**
   * Resolves an out-of-band credential offer (collecting issuer metadata).
   * @param credentialOffer a credential offer string provided as a link
   *                        or resulting from a QR code scan
   * @returns the resolved credential offer alongside issuer metadata
   */
  resolveCredentialOffer(
    credentialOffer: string
  ): Promise<ResolvedCredentialOffer>;

  /**
   * Request a credential from a credential issuer given a credential type.
   *
   * @param resolvedCredentialOffer a credential offer object with discovery metadata.
   * @param credentialTypeKey a credential type identifier as specified in the
   *                          credential issuer metadata.
   * @param grantType a grant type indicative of the issuance flow type, Authorize or
   *                  Pre-Authorized.
   *
   * @returns the issued credential
   */
  requestCredentialIssuance(
    resolvedCredentialOffer: ResolvedCredentialOffer,
    credentialTypeKey: string,
    grantType: keyof Grant
  ): Promise<string>;
}
