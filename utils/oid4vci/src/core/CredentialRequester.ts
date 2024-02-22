import { fetch } from 'cross-fetch';
import * as jose from 'jose';

import { OID4VCIServiceError } from '../lib/errors';
import { TokenResponse } from '../lib/types/tmp';
import { IdentityProofGenerator } from './IdentityProofGenerator';
import { SdJwtCredentialProcessor } from './SdJwtCredentialProcessor';
import { CLIENT_ID } from '../config';
import { fetchIntoDataUrl } from '../utils';

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
  CredentialIssuerMetadata,
  DisplayCredential,
} from '../lib/types';
import { CredentialStorage } from '../lib/schemas/CredentialDBSchema';

/**
 * This class is responsible for requesting credentials
 * and handling all post-issuance operations.
 */
export class CredentialRequester {
  private readonly sdJwtCredentialProcessor: SdJwtCredentialProcessor;

  /**
   * Constructor.
   * @param identityProofGenerator an identify proof generator for key binding
   * @param storage a storage to persist requested issued credentials
   */
  public constructor(
    private identityProofGenerator: IdentityProofGenerator,
    private storage: CredentialStorage
  ) {
    this.sdJwtCredentialProcessor = new SdJwtCredentialProcessor(storage);
  }

  /**
   * Emits a credential issuance request, then processes the issued credential.
   *
   * This includes validating and persisting the credential.
   *
   * @param resolvedCredentialOffer a credential offer object with discovery metadata.
   * @param credentialTypeKey a credential type identifier as specified in the
   * credential issuer metadata.
   * @param grantType a grant type indicative of the issuance flow type, Authorize or
   * Pre-Authorized.
   *
   * @returns a displayable credential with all fields disclosed.
   */
  public async requestCredentialIssuance(
    resolvedCredentialOffer: ResolvedCredentialOffer,
    credentialTypeKey: string,
    grantType: GrantType
  ): Promise<DisplayCredential> {
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

    // Prefill display credential
    const displayCredentialStarter = await this.prefillDisplayCredential(
      discoveryMetadata.credentialIssuerMetadata,
      credentialTypeKey
    );

    // Process credential: validate + decode + store
    // TODO! Add support other credential formats.
    const processedCredential =
      await this.sdJwtCredentialProcessor.processCredential(
        credential,
        await this.resolveIssuerVerifyingKeys(discoveryMetadata),
        displayCredentialStarter
      );

    return processedCredential.display;
  }

  /**
   * Requests access token.
   *
   * @param grantType a grant type indicative of the issuance flow type
   * @param credentialOffer a credential offer object embedding authorization means
   * @param authorizationServerMetadata the metadata of the target authorization server
   *
   * @returns an OAuth token response
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
      access_token: 'IPuHfCiJUkamvVuY2Vn2e47J7c5s9wedHYcGlXBR7GY',
      token_type: 'Bearer',
      expires_in: 86400,
      scope: null,
      refresh_token: 'fnKw1U8dtxXK-Id74AIK-1tQl64j0qCy3Jjkwdocv-8',
      c_nonce: 'ydgr1wPZ2xaOg7wmmZcUIJk0bFDZFghCcyEn3LqwFGY',
      c_nonce_expires_in: 86400,
    };

    return tokenResponse;
  }

  /**
   * Prepares credential issuance request.
   *
   * @param credentialTypeKey a credential type identifier
   * @param discoveryMetadata the discovered metadata upon credential offer resolution
   * @param nonce a server-provided nonce value for key proof
   *
   * @returns a set of parameters to send a credential request
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
    // Add support for `credential_identifier` selection

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
   *
   * @param credentialSupported the target credential type's configuration metadata
   *
   * @returns the specific fields to uniquely identify the credential type
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
   *
   * @param params a set of parameters to send a credential request
   * @param accessToken a bearer token for authorization at the credential endpoint
   *
   * @returns the issued credential as is
   */
  private async sendCredentialRequest(
    params: CredentialRequestParams,
    accessToken: string
  ): Promise<string> {
    const { credentialTypeSelector, credentialEndpoint, keyProof } = params;

    const data = {
      ...credentialTypeSelector,
      proof: keyProof,
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
      if (!response.ok) {
        throw new OID4VCIServiceError(
          `CredentialIssuerError: ${response.status} ${response.statusText}`
        );
      }

      return response.json();
    });

    return credentialResponse.credential;
  }

  /**
   * Resolve issuer verifying keys.
   * @param discoveryMetadata the discovered metadata upon credential offer resolution
   * @returns an array of potential verifying keys
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

  /**
   * Prefill display credential with non-format specific fields.
   *
   * TODO! Handle i18n.
   *
   * @param credentialIssuerMetadata the target credential issuer's metadata
   * @param credentialTypeKey a credential type identifier
   * @param locale the user's locale
   *
   * @returns a pre-filled display credential
   */
  private async prefillDisplayCredential(
    credentialIssuerMetadata: CredentialIssuerMetadata,
    credentialTypeKey: string,
    locale: string = 'en-US'
  ): Promise<DisplayCredential> {
    const credentialSupported =
      credentialIssuerMetadata.credential_configurations_supported[
        credentialTypeKey
      ];

    // Credential display metadata
    let display = credentialSupported?.display?.find(
      (e) => e.locale == undefined || e.locale == locale
    );

    // Read title
    const title = display?.name ?? credentialTypeKey;

    // Issuer display metadata
    display = credentialIssuerMetadata.display?.find(
      (e) => e.locale == undefined || e.locale == locale
    );

    // Read issuer name
    const issuer =
      display?.name ?? new URL(credentialIssuerMetadata.credential_issuer).host;

    // Fetch logo
    let logo = display?.logo?.uri ?? display?.logo?.url;
    if (logo?.startsWith('http://') || logo?.startsWith('https://')) {
      logo = await fetchIntoDataUrl(logo).catch(() => logo);
    }

    return { title, issuer, logo } satisfies DisplayCredential;
  }
}
