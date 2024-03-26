import { SdJwtProcessedCredential } from '../issuance';
import { SdJwtDisclosure } from './SdJwt.types';
import { PresentationDefinition } from './pex_v2';

export interface CredentialsForRequest {
  matchingCredentials: SdJwtMatchingCredential[];
  presentationDefinition: PresentationDefinition;
}

export interface SdJwtMatchingCredential {
  credential: SdJwtProcessedCredential;

  /**
   * These are the claims to be disclosed to the verifier
   */
  disclosures: Array<SdJwtDisclosure>;
}
