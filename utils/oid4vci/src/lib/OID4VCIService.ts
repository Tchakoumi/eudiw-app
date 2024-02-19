import { ResolvedCredentialOffer } from './types';

/**
 * A service for handling the OID4VCI flow.
 */
export interface OID4VCIService {
  /**
   * Resolves an out-of-band credential offer (collecting issuer metadata).
   * @param credentialOffer a credential offer string provided as a link,
   *                        potentially resulting from a QR code scan
   * @returns the resolved credential offer alongside issuer metadata
   */
  resolveCredentialOffer(
    credentialOffer: string
  ): Promise<ResolvedCredentialOffer>;
}
