import { fetch } from 'cross-fetch';

import { OID4VCIServiceError } from '../errors';
import { TokenResponse } from '../types/tmp';
import { IdentityProofGenerator } from './IdentityProofGenerator';

import {
  DiscoveryMetadata,
  CredentialIssuerMetadata,
  CredentialTypeSelector,
  CredentialSupportedSdJwtVc,
  CredentialResponse,
} from '../types';

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

    // Look up identifier fields for selected credential type
    const credentialTypeSelector = this.extractCredentialTypeSelector(
      credentialTypeKey,
      credentialIssuerMetadata
    );

    // Generate a wallet's key proof embedding the received nonce
    const keyProof = await this.identityProofGenerator.generateKeyProof(
      credentialIssuerMetadata.credential_issuer,
      nonce
    );

    // Send request
    const credentialEndpoint = credentialIssuerMetadata.credential_endpoint;
    const credential = await this.sendCredentialRequest(
      credentialTypeSelector,
      credentialEndpoint,
      accessToken,
      keyProof
    );

    // TODO! Verify credential

    return credential;
  }

  /**
   * Extracts credential type selector from credential issuer metadata.
   *
   * This encompasses specific fields to uniquely identify a credential type.
   */
  private extractCredentialTypeSelector(
    credentialTypeKey: string,
    credentialIssuerMetadata: CredentialIssuerMetadata
  ): CredentialTypeSelector {
    const credentialSupported =
      credentialIssuerMetadata.credential_configurations_supported[
        credentialTypeKey
      ];

    if (!credentialSupported) {
      throw new OID4VCIServiceError(
        'Configuration metadata for selected credential type not found.'
      );
    }

    switch (credentialSupported.format) {
      case 'vc+sd-jwt':
        return {
          format: 'vc+sd-jwt',
          vct: (credentialSupported as CredentialSupportedSdJwtVc).vct,
        };
      default:
        throw new OID4VCIServiceError('Unsupported credential type format.');
    }
  }

  /**
   * Sends HTTP request for credential issuance.
   */
  private async sendCredentialRequest(
    credentialTypeSelector: CredentialTypeSelector,
    credentialEnpoint: string,
    accessToken: string,
    keyProof: string
  ): Promise<string> {
    const data = {
      ...credentialTypeSelector,
      proof: {
        proof_type: 'jwt',
        jwt: keyProof,
      },
    };

    const credentialResponse: CredentialResponse = await fetch(
      credentialEnpoint,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    ).then(async (response) => {
      if (!response.ok) {
        console.error(await response.json());
        throw new Error('Not 2xx response');
      }

      return response.json();
    });

    return credentialResponse.credential;
  }
}
