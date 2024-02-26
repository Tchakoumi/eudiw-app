/**
 * Event channels on which implementations are to send back responses.
 */
export enum OID4VCIServiceEventChannel {
  // Listen for resolved credential offers
  ProcessCredentialOffer = 'process-credential-offer',
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
}
