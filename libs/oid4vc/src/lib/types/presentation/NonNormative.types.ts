import { DisplayCredential } from '../issuance';
import { PresentationDefinition } from './pex_v2';

export interface CredentialsForRequest {
  matchingCredentials: SdJwtMatchingCredential[];
  presentationDefinition: PresentationDefinition;
}

export interface SdJwtMatchingCredential {
  credential: DisplayCredential;

  /**
   * These are the claims to be disclosed to the verifier
   */
  disclosures: Record<string, string>;
}
