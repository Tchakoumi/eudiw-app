import * as jose from 'jose';

import { StorageFactory } from '@datev/storage';
import { OID4VCIServiceDBSchema } from '../database/schema';
import { OID4VCIServiceError } from '../lib/errors';
import { HttpUtil } from '../utils';
import { AccessTokenClient } from './AccessTokenClient';
import { ConfigClient } from './ConfigClient';
import { StoreIdentityManager } from './IdentityManager';
import { IdentityProofGenerator } from './IdentityProofGenerator';
import { SdJwtCredentialProcessor } from './SdJwtCredentialProcessor';

import {
  AccessTokenRequest,
  AccessTokenResponse,
  AuthorizationServerMetadata,
  CredentialIssuerMetadata,
  CredentialOffer,
  CredentialRequestParams,
  CredentialResponse,
  CredentialSupported,
  CredentialSupportedSdJwtVc,
  CredentialTypeSelector,
  DiscoveryMetadata,
  DisplayCredential,
  EndpointMetadata,
  GrantType,
  JWKSet,
  OpenIDResponse,
  ResolvedCredentialOffer,
} from '../lib/types';

/**
 * This class is responsible for requesting credentials
 * and handling all post-issuance operations.
 */
export class CredentialRequester {
  private readonly accessTokenClient: AccessTokenClient;
  private readonly identityProofGenerator: IdentityProofGenerator;
  private readonly sdJwtCredentialProcessor: SdJwtCredentialProcessor;

  /**
   * Constructor.
   * @param configClient a gate to retrieve configuration data through
   * @param httpUtil the service HTTP client
   * @param storage a storage to persist requested issued credentials
   */
  public constructor(
    private configClient: ConfigClient,
    private httpUtil: HttpUtil,
    storage: StorageFactory<OID4VCIServiceDBSchema>
  ) {
    this.accessTokenClient = new AccessTokenClient(httpUtil);

    this.identityProofGenerator = new IdentityProofGenerator(
      configClient,
      new StoreIdentityManager(storage)
    );

    this.sdJwtCredentialProcessor = new SdJwtCredentialProcessor(storage);
  }

  /**
   * Emits a credential issuance request, then processes the issued credential.
   *
   * This includes validating and persisting the credential.
   *
   * @param resolvedCredentialOffer a credential offer object with discovery metadata.
   * @param userOpts.credentialTypeKey a credential type identifier as specified in the
   * credential issuer metadata.
   * @param userOpts.txCode a transaction code for increased security
   * @param grantType a grant type indicative of the issuance flow type, Authorize or
   * Pre-Authorized.
   *
   * @returns a displayable credential with all fields disclosed.
   */
  public async requestCredentialIssuance(
    resolvedCredentialOffer: ResolvedCredentialOffer,
    userOpts: { credentialTypeKey: string; txCode?: string },
    grantType: GrantType
  ): Promise<DisplayCredential> {
    const { credentialOffer, discoveryMetadata } = resolvedCredentialOffer;
    const { credentialTypeKey, txCode } = userOpts;

    // Enforce grant type to match the pre-authorized flow
    if (grantType != GrantType.PRE_AUTHORIZED_CODE) {
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

    // Extract credential type configuration metadata
    const credentialSupported =
      discoveryMetadata.credentialIssuerMetadata
        .credential_configurations_supported[credentialTypeKey];

    // Request an access token to present at the credential endpoint
    const tokenResponse = await this.requestAccessToken(
      grantType,
      credentialOffer,
      discoveryMetadata.authorizationServerMetadata,
      txCode
    );

    // Prepare credential issuance request
    const credentialRequestParams = await this.prepareCredentialIssuanceRequest(
      credentialTypeKey,
      discoveryMetadata,
      tokenResponse
    );

    // Send credential request
    const credential = await this.sendCredentialRequest(
      credentialRequestParams
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
        credentialSupported as CredentialSupportedSdJwtVc,
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
   * @param txCode a transaction code for added security
   *
   * @returns an OAuth token response
   */
  private async requestAccessToken(
    grantType: GrantType,
    credentialOffer: CredentialOffer,
    authorizationServerMetadata: AuthorizationServerMetadata,
    txCode?: string
  ): Promise<AccessTokenResponse> {
    // Enforce grant type to match the pre-authorized flow

    if (grantType != GrantType.PRE_AUTHORIZED_CODE) {
      throw new OID4VCIServiceError(
        'There is only support for the Pre-Authorized Code flow.'
      );
    }

    // Extract pre-authorized code

    const preAuthorizedCode =
      credentialOffer.grants?.[grantType]?.['pre-authorized_code'];

    if (!preAuthorizedCode) {
      throw new OID4VCIServiceError(
        'Cannot proceed without a pre-authorized code.'
      );
    }

    // Prepare data for access token request

    const clientId = this.configClient.getClientId(
      credentialOffer.credential_issuer
    );

    const accessTokenRequest: AccessTokenRequest = {
      client_id: clientId,
      grant_type: grantType,
      'pre-authorized_code': preAuthorizedCode,
      tx_code: txCode,
    };

    // Delegate request to access token client

    const accessTokenResponse: OpenIDResponse<AccessTokenResponse> =
      await this.accessTokenClient.acquireAccessTokenUsingRequest({
        accessTokenRequest,
        metadata: authorizationServerMetadata as EndpointMetadata,
      });

    const tokenResponse = accessTokenResponse.successBody;
    if (!tokenResponse) {
      throw new OID4VCIServiceError('Could not obtain an access token.');
    }

    return tokenResponse;
  }

  /**
   * Prepares credential issuance request.
   *
   * @param credentialTypeKey a credential type identifier
   * @param discoveryMetadata the discovered metadata upon credential offer resolution
   * @param tokenResponse a successful access token response
   *
   * @returns a set of parameters to send a credential request
   */
  private async prepareCredentialIssuanceRequest(
    credentialTypeKey: string,
    discoveryMetadata: DiscoveryMetadata,
    tokenResponse: AccessTokenResponse
  ): Promise<CredentialRequestParams> {
    const { credentialIssuerMetadata } = discoveryMetadata;
    const { access_token: accessToken, c_nonce: nonce } = tokenResponse;

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
      request: { ...credentialTypeSelector, proof: keyProof },
      credentialEndpoint,
      accessToken,
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
   *
   * @returns the issued credential as is
   */
  private async sendCredentialRequest(
    params: CredentialRequestParams
  ): Promise<string> {
    const { request, credentialEndpoint, accessToken } = params;

    const response = await this.httpUtil.post(
      credentialEndpoint,
      JSON.stringify(request),
      {
        bearerToken: accessToken,
      }
    );

    if (!response.successBody) {
      const { status, statusText } = response.origResponse;
      throw new OID4VCIServiceError(
        `CredentialIssuerError: ${status} ${statusText}`
      );
    }

    const { credential } = response.successBody as CredentialResponse;
    return credential;
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

    const response = await this.httpUtil.openIdFetch(jwksUri);

    if (!response.successBody) {
      throw new OID4VCIServiceError(
        'Could not retrieve issuer verifying keys.'
      );
    }

    const { keys } = response.successBody as JWKSet;
    return keys;
  }

  /**
   * Prefill display credential with non-claims fields.
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
      const response = await this.httpUtil.openIdFetchIntoDataUrl(logo);
      logo = response.successBody ?? logo;
    }

    return { title, issuer, logo };
  }
}
