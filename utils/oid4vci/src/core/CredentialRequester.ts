import { fetch } from 'cross-fetch';
import * as jose from 'jose';

import { OID4VCIServiceError } from '../lib/errors';
import { TokenResponse } from '../lib/types/tmp';
import { IdentityProofGenerator } from './IdentityProofGenerator';
import { SdJwtCredentialProcessor } from './SdJwtCredentialProcessor';
import { CLIENT_ID } from '../config';

import {
  DiscoveryMetadata,
  CredentialTypeSelector,
  CredentialSupportedSdJwtVc,
  CredentialResponse,
  CredentialRequestParams,
  GrantType,
  ResolvedCredentialOffer,
  AuthorizationServerMetadata,
  CredentialOffer,
  CredentialSupported,
  ProcessedCredential,
} from '../lib/types';

export class CredentialRequester {
  readonly sdJwtCredentialProcessor = new SdJwtCredentialProcessor();

  /**
   * Constructor.
   */
  public constructor(private identityProofGenerator: IdentityProofGenerator) {}

  /**
   * Emits a credential issuance request.
   */
  public async requestCredentialIssuance(
    resolvedCredentialOffer: ResolvedCredentialOffer,
    credentialTypeKey: string,
    grantType: GrantType
  ): Promise<ProcessedCredential> {
    const { credentialOffer, discoveryMetadata } = resolvedCredentialOffer;

    // Enforce grant type to match the pre-authorized flow
    if (grantType != 'urn:ietf:params:oauth:grant-type:pre-authorized_code') {
      throw new OID4VCIServiceError(
        'There is only support for the Pre-Authorized Code flow.'
      );
    }

    // Enforce the availability of discovery metadata.
    if (
      !discoveryMetadata ||
      !discoveryMetadata.credentialIssuerMetadata ||
      !discoveryMetadata.authorizationServerMetadata
    ) {
      throw new OID4VCIServiceError(
        'Cannot proceed without discovery metadata.'
      );
    }

    // Request an access token to present at the credential endpoint
    const { access_token: accessToken, c_nonce: nonce } =
      await this.requestAccessToken(
        grantType,
        credentialOffer,
        discoveryMetadata.authorizationServerMetadata
      );

    // Prepare credential issuance request
    const credentialRequestParams = await this.prepareCredentialIssuanceRequest(
      credentialTypeKey,
      discoveryMetadata,
      nonce
    );

    // Send credential request
    const credential = await this.sendCredentialRequest(
      credentialRequestParams,
      accessToken
    );

    // Process credential: verify + decode + store
    // TODO! Support other credential formats.
    const processedCredential = await this.sdJwtCredentialProcessor.processCredential(
      credential,
      await this.resolveIssuerVerifyingKeys(discoveryMetadata)
    );

    return processedCredential;
  }

  /**
   * Requests access token.
   */
  private async requestAccessToken(
    grantType: string,
    credentialOffer: CredentialOffer,
    authorizationServerMetadata: AuthorizationServerMetadata
  ): Promise<TokenResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const params = {
      client_id: CLIENT_ID,
      grant_type: grantType,
      credentialOffer,
      authorizationServerMetadata,
      // pre_authorized_code: credentialOffer.grants?.['urn:ietf:params:oauth:grant-type:pre-authorized_code']?.['pre-authorized_code'],
      // token_endpoint: discoveryMetadata?.authorizationServerMetadata?.token_endpoint,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const tokenResponse: TokenResponse = {
      access_token: 'iDV_P3mLcxbOxbMxySc9sgJ_OjwQbGPiQCcs5wPVXzA',
      token_type: 'Bearer',
      expires_in: 86400,
      scope: null,
      refresh_token: 'QcxNHvTnwSoEVBbkacRWR2JfcJos-U21UQQ8HpfHr5U',
      c_nonce: 'UMAELxhn4IY2a5_eLr_cVkPLmktVYv-29mEx9LULPQ0',
      c_nonce_expires_in: 86400,
    };

    return tokenResponse;
  }

  /**
   * Prepares credential issuance request.
   */
  private async prepareCredentialIssuanceRequest(
    credentialTypeKey: string,
    discoveryMetadata: DiscoveryMetadata,
    nonce?: string
  ): Promise<CredentialRequestParams> {
    const { credentialIssuerMetadata } = discoveryMetadata;

    // Assertions

    if (!credentialIssuerMetadata) {
      throw new OID4VCIServiceError(
        'Cannot proceed without credential issuer metadata.'
      );
    }

    const credentialSupported =
      credentialIssuerMetadata.credential_configurations_supported[
        credentialTypeKey
      ];

    if (!credentialSupported) {
      throw new OID4VCIServiceError(
        'Configuration metadata for selected credential type not found.'
      );
    }

    if (
      credentialIssuerMetadata.credential_response_encryption
        ?.encryption_required
    ) {
      throw new OID4VCIServiceError(
        'No support for credential response encryption.'
      );
    }

    // Look up identifier fields for selected credential type

    const credentialTypeSelector =
      this.extractCredentialTypeSelector(credentialSupported);

    // Generate a wallet's key proof embedding the received nonce

    const keyProof =
      await this.identityProofGenerator.generateCompatibleKeyProof(
        credentialSupported,
        credentialIssuerMetadata.credential_issuer,
        nonce
      );

    // Read credential endpoint

    const credentialEndpoint = credentialIssuerMetadata.credential_endpoint;

    // Return params

    return {
      credentialTypeSelector,
      credentialEndpoint,
      keyProof,
    };
  }

  /**
   * Extracts credential type selector from credential issuer metadata.
   *
   * This encompasses specific fields to uniquely identify a credential type.
   */
  private extractCredentialTypeSelector(
    credentialSupported: CredentialSupported
  ): CredentialTypeSelector {
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
    params: CredentialRequestParams,
    accessToken: string
  ): Promise<string> {
    const { credentialTypeSelector, credentialEndpoint, keyProof } = params;

    const data = {
      ...credentialTypeSelector,
      ...keyProof,
    };

    const credentialResponse: CredentialResponse = await fetch(
      credentialEndpoint,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    ).then(async (response) => {
      const payload = await response.json();

      if (!response.ok) {
        throw new OID4VCIServiceError(
          `CredentialIssuerError: ${payload.error}`
        );
      }

      return payload;
    });

    return credentialResponse.credential;
  }

  /**
   * Resolve issuer verifying keys.
   */
  private async resolveIssuerVerifyingKeys(
    discoveryMetadata: DiscoveryMetadata
  ): Promise<jose.JWK[]> {
    const { authorizationServerMetadata, jwtIssuerMetadata } =
      discoveryMetadata;

    if (jwtIssuerMetadata?.jwks) {
      return jwtIssuerMetadata?.jwks.keys;
    }

    const jwksUri =
      jwtIssuerMetadata?.jwks_uri ?? authorizationServerMetadata?.jwks_uri;

    if (!jwksUri) {
      throw new OID4VCIServiceError(
        'Could not find a URI to retrieve issuer verifying keys from.'
      );
    }

    const jwks = await fetch(jwksUri).then(async (response) => {
      if (!response.ok) {
        throw new Error('Not 2xx response');
      }

      return response.json();
    });

    return jwks.keys as jose.JWK[];
  }
}
