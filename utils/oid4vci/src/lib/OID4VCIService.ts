import { GrantType, ResolvedCredentialOffer } from '../lib/types';

/**
 * Event channels on which implementations are to send back responses.
 */
export enum OID4VCIServiceEventChannel {
  // Listen for resolved credential offers
  ProcessCredentialOffer = 'process-credential-offer',
  // Listen for credential propositions
  CredentialProposition = 'credential-proposition',
  RetrieveCredentialHeaders = 'retrieve-credential-headers',
}

/**
 * A service for handling the OID4VCI flow.
 */
export interface OID4VCIService {
  /**
   * Resolves an out-of-band credential offer (collecting issuer metadata).
   *
   * The service replies on `OID4VCIServiceEventChannel.ProcessCredentialOffer`
   * with either:
   * - the resolved credential offer alongside issuer metadata,
   * - or an error message indicative of what went wrong.
   *
   * @param opts.credentialOffer a credential offer string provided as a link,
   * potentially resulting from a QR code scan
   */
  resolveCredentialOffer(opts: { credentialOffer: string }): void;

  /**
   * Requests a credential from a credential issuer given a credential type.
   *
   * The service replies on `OID4VCIServiceEventChannel.CredentialProposition`
   * with either:
   * - a displayable credential,
   * - or an error message indicative of what went wrong.
   *
   * @param resolvedCredentialOffer a credential offer object with discovery metadata
   * @param userOpts.credentialTypeKey a credential type identifier as specified in the
   * credential issuer metadata
   * @param userOpts.txCode a transaction code for increased security
   * @param grantType a grant type indicative of the issuance flow type, Authorize or
   * Pre-Authorized
   */
  requestCredentialIssuance(
    resolvedCredentialOffer: ResolvedCredentialOffer,
    userOpts: { credentialTypeKey: string; txCode?: string },
    grantType?: GrantType
  ): Promise<void>;

  /**
   * Retrieves stored credential headers to show them on the landing page
   *
   * The service replies on `OID4VCIServiceEventChannel.RetrieveCredentialHeaders`
   * with either:
   * - one or many credential headers,
   * - or an error message indicative of what went wrong.
   *
   */
  retrieveCredentialHeaders(): Promise<void>;
}
