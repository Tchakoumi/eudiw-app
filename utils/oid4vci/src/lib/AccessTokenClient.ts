import { OID4VCIServiceError } from './errors';
import { InvalidCredentialOffer } from './errors/AccessToken.errors';
import { formPost } from './functions/HttpUtils';
import {
  AccessTokenRequest,
  AuthorizationServerOpts,
  EndpointMetadata,
  GrantTypes,
  IssuerOpts,
  PRE_AUTH_CODE_LITERAL,
} from './types';
import { OpenIDResponse, AccessTokenResponse } from './types';

export class AccessTokenClient {
  public async acquireAccessTokenUsingRequest({
    accessTokenRequest,
    metadata,
    asOpts,
    issuerOpts,
  }: {
    accessTokenRequest: AccessTokenRequest;
    metadata?: EndpointMetadata;
    asOpts?: AuthorizationServerOpts;
    issuerOpts?: IssuerOpts;
  }): Promise<OpenIDResponse<AccessTokenResponse>> {
    this.validate(accessTokenRequest);
    this.assertTx_Code(accessTokenRequest.tx_code);
    const requestTokenURL = AccessTokenClient.determineTokenURL({
      asOpts,
      issuerOpts,
      metadata,
    });

    return this.sendAuthCode(requestTokenURL, accessTokenRequest);
  }

  private async sendAuthCode(
    requestTokenURL: string,
    accessTokenRequest: AccessTokenRequest,
  ): Promise<OpenIDResponse<AccessTokenResponse>> {
    return await formPost(requestTokenURL, JSON.stringify(accessTokenRequest));
  }

  private validate(accessTokenRequest: AccessTokenRequest): void {
    if (accessTokenRequest.grant_type === GrantTypes.PRE_AUTHORIZED_CODE) {
      this.assertPreAuthorizedGrantType(accessTokenRequest.grant_type);
      this.assertNonEmptyPreAuthorizedCode(accessTokenRequest);
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
      url = this.createTokenURLFromURL(
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
      url = this.createTokenURLFromURL(
        issuerOpts.issuer,
        asOpts?.allowInsecureEndpoints,
        issuerOpts.tokenEndpoint,
      );
    }

    console.log(`Token endpoint determined to be ${url}`);
    return url;
  }

  private static createTokenURLFromURL(
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

  private assertTx_Code(tx_code?: string): void {
    // Check if tx_code is not undefined but is an empty string
    if (tx_code !== undefined && tx_code.trim() === '') {
      // Throw an error with a specific type/message
      throw new OID4VCIServiceError(InvalidCredentialOffer.invalid_client);
    }
  }
}
