import { DisplayCredential } from '../issuance';
import { ResolvedRequestObject } from './v1_0_20';

export interface PresentationExchange {
  matchingCredentials: SdJwtMatchingCredential[];
  resolvedRequestObject: ResolvedRequestObject;
}

export type DisclosureRecord = Record<string, string | number | boolean>;
export interface SdJwtMatchingCredential {
  credential: DisplayCredential;

  /**
   * These are the claims to be disclosed to the verifier
   */
  disclosures: DisclosureRecord;
}
