import { GrantType, ResolvedCredentialOffer } from '../lib/types';
import EventEmitter from 'eventemitter3';

/**
 * Event channels on which implementations are to send back responses.
 */
export enum OID4VCIServiceEventChannel {
  // Listen for resolved credential offers
  SendCredentialOffer = 'send-credential-offer',
}

/**
 * A service for handling the OID4VCI flow.
 */
export interface OID4VCIService {
  /**
   * Returns a reference to the event bus on which to listen for responses.
   */
  getEventBus(): EventEmitter;

  /**
   * Resolves an out-of-band credential offer (collecting issuer metadata).
   *
   * The service replies on `OID4VCIServiceEventChannel.SendCredentialOffer`
   * with either:
   * - the resolved credential offer alongside issuer metadata,
   * - or an error message indicative of what went wrong.
   *
   * @param opts.credentialOffer a credential offer string provided as a link,
   * potentially resulting from a QR code scan
   */
  resolveCredentialOffer(opts: { credentialOffer: string }): Promise<void>;

  /**
   * Requests a credential from a credential issuer given a credential type.
   *
   * The service replies on `OID4VCIServiceEventChannel.???`
   * with either:
   * - a displayable credential,
   * - or an error message indicative of what went wrong.
   *
   * @param opts.resolvedCredentialOffer a credential offer object with discovery metadata.
   * @param opts.credentialTypeKey a credential type identifier as specified in the
   * credential issuer metadata.
   * @param opts.grantType a grant type indicative of the issuance flow type, Authorize or
   * Pre-Authorized.
   */
  requestCredentialIssuance(opts: {
    resolvedCredentialOffer: ResolvedCredentialOffer;
    credentialTypeKey: string;
    grantType?: GrantType;
  }): Promise<void>;
}
