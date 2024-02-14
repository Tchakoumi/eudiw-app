import { DiscoveryMetadata } from '../types';
import { TokenResponse } from '../types/tmp';
import { IdentityProofGenerator } from './IdentityProofGenerator';

export class CredentialRequester {
  /**
   * Constructor.
   */
  public constructor(private identityProofGenerator: IdentityProofGenerator) {}

  /**
   * Emits a credential issuance request.
   */
  public async requestCredentialIssuance(
    credentialTypeKey: string,
    discoveryMetadata: DiscoveryMetadata,
    tokenResponse: TokenResponse
  ): Promise<string> {
    const { access_token: accessToken, c_nonce: nonce } = tokenResponse;

    const proof = this.identityProofGenerator.generateKeyProof(nonce);

    return [accessToken, proof].join('-');
  }
}
