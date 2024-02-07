import { ResolvedCredentialOffer } from '../types';

/**
 * A service for handling the OID4VCI flow.
 */
export interface OID4VCIService {
  /**
   * Resolves an out-of-band credential offer (along with issuer metadata).
   */
  resolveCredentialOffer(
    credentialOffer: string
  ): Promise<ResolvedCredentialOffer>;
}
