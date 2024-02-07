import { MetadataClient } from './MetadataClient';
import {
  assertedUniformCredentialOffer,
  getIssuerFromCredentialOfferPayload,
  toUniformCredentialOfferRequest,
} from './functions/CredentialOfferUtil';
import { convertJsonToURI } from './functions/Encoding';
import { formPost } from './functions/HttpUtils';
import {
  AccessTokenRequest,
  AccessTokenRequestOpts,
  AuthorizationServerOpts,
  AuthzFlowType,
  EndpointMetadata,
  GrantTypes,
  IssuerOpts,
  PRE_AUTH_CODE_LITERAL,
  TokenErrorResponse,
  UniformCredentialOfferPayload,
} from './types';
import { OpenIDResponse, AccessTokenResponse } from './types';

export class AccessTokenClient {
  public async acquireAccessToken(
    opts: AccessTokenRequestOpts,
  ): Promise<OpenIDResponse<AccessTokenResponse>> {
    const { asOpts, pin, codeVerifier, code, redirectUri, metadata } = opts;

    const credentialOffer = opts.credentialOffer
      ? await assertedUniformCredentialOffer(opts.credentialOffer)
      : undefined;
    const isPinRequired =
      credentialOffer &&
      this.isPinRequiredValue(credentialOffer.credential_offer);
    const issuer =
      opts.credentialIssuer ??
      (credentialOffer
        ? getIssuerFromCredentialOfferPayload(credentialOffer.credential_offer)
        : (metadata?.issuer as string));
    if (!issuer) {
      throw Error('Issuer required at this point');
    }
    const issuerOpts = {
      issuer,
    };

    return await this.acquireAccessTokenUsingRequest({
      accessTokenRequest: await this.createAccessTokenRequest({
        credentialOffer,
        asOpts,
        codeVerifier,
        code,
        redirectUri,
        pin,
      }),
      isPinRequired,
      metadata,
      asOpts,
      issuerOpts,
    });
  }

  public async acquireAccessTokenUsingRequest({
    accessTokenRequest,
    isPinRequired,
    metadata,
    asOpts,
    issuerOpts,
  }: {
    accessTokenRequest: AccessTokenRequest;
    isPinRequired?: boolean;
    metadata?: EndpointMetadata;
    asOpts?: AuthorizationServerOpts;
    issuerOpts?: IssuerOpts;
  }): Promise<OpenIDResponse<AccessTokenResponse>> {
    this.validate(accessTokenRequest, isPinRequired);

    const requestTokenURL = AccessTokenClient.determineTokenURL({
      asOpts,
      issuerOpts,
      metadata: metadata
        ? metadata
        : issuerOpts?.fetchMetadata
          ? await MetadataClient.retrieveAllMetadata(issuerOpts.issuer, {
              errorOnNotFound: false,
            })
          : undefined,
    });

    return this.sendAuthCode(requestTokenURL, accessTokenRequest);
  }

  private async sendAuthCode(
    requestTokenURL: string,
    accessTokenRequest: AccessTokenRequest,
  ): Promise<OpenIDResponse<AccessTokenResponse>> {
    return await formPost(
      requestTokenURL,
      convertJsonToURI(accessTokenRequest),
    );
  }

  private isPinRequiredValue(
    requestPayload: UniformCredentialOfferPayload,
  ): boolean {
    let isPinRequired = false;
    if (!requestPayload) {
      throw new Error(TokenErrorResponse.invalid_request);
    }
    const issuer = getIssuerFromCredentialOfferPayload(requestPayload);
    if (
      requestPayload.grants?.[
        'urn:ietf:params:oauth:grant-type:pre-authorized_code'
      ]
    ) {
      isPinRequired =
        requestPayload.grants[
          'urn:ietf:params:oauth:grant-type:pre-authorized_code'
        ]?.user_pin_required ?? false;
    }
    return isPinRequired;
  }

  public async createAccessTokenRequest(
    opts: AccessTokenRequestOpts,
  ): Promise<AccessTokenRequest> {
    const { asOpts, pin, codeVerifier, code, redirectUri } = opts;
    const credentialOfferRequest = opts.credentialOffer
      ? await toUniformCredentialOfferRequest(opts.credentialOffer)
      : undefined;
    const request: Partial<AccessTokenRequest> = {};

    if (asOpts?.clientId) {
      request.client_id = asOpts.clientId;
    }

    if (
      credentialOfferRequest?.supportedFlows.includes(
        AuthzFlowType.PRE_AUTHORIZED_CODE_FLOW,
      )
    ) {
      this.assertNumericPin(
        this.isPinRequiredValue(credentialOfferRequest.credential_offer),
        pin,
      );
      request.user_pin = pin;

      request.grant_type = GrantTypes.PRE_AUTHORIZED_CODE;
      // we actually know it is there because of the isPreAuthCode call
      request[PRE_AUTH_CODE_LITERAL] =
        credentialOfferRequest?.credential_offer.grants?.[
          'urn:ietf:params:oauth:grant-type:pre-authorized_code'
        ]?.[PRE_AUTH_CODE_LITERAL];

      return request as AccessTokenRequest;
    }

    if (
      !credentialOfferRequest ||
      credentialOfferRequest.supportedFlows.includes(
        AuthzFlowType.AUTHORIZATION_CODE_FLOW,
      )
    ) {
      request.grant_type = GrantTypes.AUTHORIZATION_CODE;
      request.code = code;
      request.redirect_uri = redirectUri;

      if (codeVerifier) {
        request.code_verifier = codeVerifier;
      }

      return request as AccessTokenRequest;
    }

    throw new Error(
      'Credential offer request does not follow neither pre-authorized code nor authorization code flow requirements.',
    );
  }

  private validate(
    accessTokenRequest: AccessTokenRequest,
    isPinRequired?: boolean,
  ): void {
    if (accessTokenRequest.grant_type === GrantTypes.PRE_AUTHORIZED_CODE) {
      this.assertPreAuthorizedGrantType(accessTokenRequest.grant_type);
      this.assertNonEmptyPreAuthorizedCode(accessTokenRequest);
      this.assertNumericPin(isPinRequired, accessTokenRequest.user_pin);
    }
  }

  private assertPreAuthorizedGrantType(grantType: GrantTypes): void {
    if (GrantTypes.PRE_AUTHORIZED_CODE !== grantType) {
      throw new Error(
        "grant type must be 'urn:ietf:params:oauth:grant-type:pre-authorized_code'",
      );
    }
  }

  private assertNonEmptyPreAuthorizedCode(
    accessTokenRequest: AccessTokenRequest,
  ): void {
    if (!accessTokenRequest[PRE_AUTH_CODE_LITERAL]) {
      throw new Error(
        'Pre-authorization must be proven by presenting the pre-authorized code. Code must be present.',
      );
    }
  }

  private assertNumericPin(isPinRequired?: boolean, pin?: string): void {
    if (isPinRequired) {
      if (!pin || !/^\d{1,8}$/.test(pin)) {
        throw new Error(
          'A valid pin consisting of maximal 8 numeric characters must be present.',
        );
      }
    } else if (pin) {
      throw new Error('Cannot set a pin, when the pin is not required.');
    }
  }

  public static determineTokenURL({
    asOpts,
    issuerOpts,
    metadata,
  }: {
    asOpts?: AuthorizationServerOpts;
    issuerOpts?: IssuerOpts;
    metadata?: EndpointMetadata;
  }): string {
    if (!asOpts && !metadata?.token_endpoint && !issuerOpts) {
      throw new Error(
        'Cannot determine token URL if no issuer, metadata and no Authorization Server values are present',
      );
    }
    let url;
    if (asOpts && asOpts.as) {
      url = this.creatTokenURLFromURL(
        asOpts.as,
        asOpts?.allowInsecureEndpoints,
        asOpts.tokenEndpoint,
      );
    } else if (metadata?.token_endpoint) {
      url = metadata.token_endpoint;
    } else {
      if (!issuerOpts?.issuer) {
        throw Error(
          'Either authorization server options, a token endpoint or issuer options are required at this point',
        );
      }
      url = this.creatTokenURLFromURL(
        issuerOpts.issuer,
        asOpts?.allowInsecureEndpoints,
        issuerOpts.tokenEndpoint,
      );
    }

    console.log(`Token endpoint determined to be ${url}`);
    return url;
  }

  private static creatTokenURLFromURL(
    url: string,
    allowInsecureEndpoints?: boolean,
    tokenEndpoint?: string,
  ): string {
    if (allowInsecureEndpoints !== true && url.startsWith('http:')) {
      throw Error(
        `Unprotected token endpoints are not allowed ${url}. Adjust settings if you really need this (dev/test settings only!!)`,
      );
    }
    const hostname = url.replace(/https?:\/\//, '').replace(/\/$/, '');
    const endpoint = tokenEndpoint
      ? tokenEndpoint.startsWith('/')
        ? tokenEndpoint
        : tokenEndpoint.substring(1)
      : '/token';
    const scheme = url.split('://')[0];
    return `${scheme ? scheme + '://' : 'https://'}${hostname}${endpoint}`;
  }
}
