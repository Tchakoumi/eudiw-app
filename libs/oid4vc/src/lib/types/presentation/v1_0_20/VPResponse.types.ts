import { PresentationSubmission } from '../pex_v2';

export interface VPResponse extends AuthorizationResponseCommonPayload {
  /**
   *  JSON String containing a single Verifiable Presentation
   * or an array of JSON Strings each of them containing a Verifiable Presentations.
   * Each Verifiable Presentation represented as a SD JWT string
   */
  vp_token: string | string[];
  /**
   * The presentation_submission element as defined in
   * [DIF.PresentationExchange](https://identity.foundation/presentation-exchange/spec/v2.0.0/#presentation-submission).
   */
  presentation_submission: PresentationSubmission;
}

export interface AuthorizationResponseCommonPayload {
  state?: string;
  code?: string;
  id_token?: string;
  iss?: string;
}
