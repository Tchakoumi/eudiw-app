import { OID4VCIServiceError } from '../errors';
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
    const credentialIssuerMetadata = discoveryMetadata.credentialIssuerMetadata;
    const { access_token: accessToken, c_nonce: nonce } = tokenResponse;

    if (!credentialIssuerMetadata) {
      throw new OID4VCIServiceError(
        'Cannot proceed without credential issuer metadata.'
      );
    }

    const proof = await this.identityProofGenerator.generateKeyProof(
      credentialIssuerMetadata.credential_issuer,
      nonce
    );

    return [accessToken, proof].join('-');
  }
}
