import { OID4VCIServiceError, InvalidCredentialOffer } from '../lib/errors';
import { convertJsonToURI } from '../utils/Encoding';
import { formPost } from '../utils/HttpUtils';

import {
  AccessTokenRequest,
  AuthorizationServerOpts,
  EndpointMetadata,
  GrantType,
  IssuerOpts,
  PRE_AUTH_CODE_LITERAL,
  OpenIDResponse,
  AccessTokenResponse,
} from '../lib/types';

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
    this.assertTxCode(accessTokenRequest.tx_code);
    const requestTokenURL = AccessTokenClient.determineTokenURL({
      asOpts,
      issuerOpts,
      metadata,
    });

    return this.sendAuthCode(requestTokenURL, accessTokenRequest);
  }

  private async sendAuthCode(
    requestTokenURL: string,
    accessTokenRequest: AccessTokenRequest
  ): Promise<OpenIDResponse<AccessTokenResponse>> {
    return await formPost(
      requestTokenURL,
      convertJsonToURI(accessTokenRequest)
    );
  }

  private validate(accessTokenRequest: AccessTokenRequest): void {
    if (accessTokenRequest.grant_type === GrantType.PRE_AUTHORIZED_CODE) {
      this.assertPreAuthorizedGrantType(accessTokenRequest.grant_type);
      this.assertNonEmptyPreAuthorizedCode(accessTokenRequest);
    }
  }

  private assertPreAuthorizedGrantType(grantType: GrantType): void {
    if (GrantType.PRE_AUTHORIZED_CODE !== grantType) {
      throw new Error(`grant type must be ${GrantType.PRE_AUTHORIZED_CODE}`);
    }
  }

  private assertNonEmptyPreAuthorizedCode(
    accessTokenRequest: AccessTokenRequest
  ): void {
    if (!accessTokenRequest[PRE_AUTH_CODE_LITERAL]) {
      throw new Error(
        'Pre-authorization must be proven by presenting the pre-authorized code. Code must be present.'
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
        'Cannot determine token URL if no issuer, metadata and no Authorization Server values are present'
      );
    }
    let url;
    if (asOpts && asOpts.as) {
      url = this.createTokenURLFromURL(
        asOpts.as,
        asOpts?.allowInsecureEndpoints,
        asOpts.tokenEndpoint
      );
    } else if (metadata?.token_endpoint) {
      url = metadata.token_endpoint;
    } else {
      if (!issuerOpts?.issuer) {
        throw Error(
          'Either authorization server options, a token endpoint or issuer options are required at this point'
        );
      }
      url = this.createTokenURLFromURL(
        issuerOpts.issuer,
        asOpts?.allowInsecureEndpoints,
        issuerOpts.tokenEndpoint
      );
    }

    return url;
  }

  private static createTokenURLFromURL(
    url: string,
    allowInsecureEndpoints?: boolean,
    tokenEndpoint?: string
  ): string {
    if (allowInsecureEndpoints !== true && url.startsWith('http:')) {
      throw Error(
        `Unprotected token endpoints are not allowed ${url}. Adjust settings if you really need this (dev/test settings only!!)`
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

  private assertTxCode(tx_code?: string): void {
    // Check if tx_code is not undefined but is an empty string
    if (tx_code !== undefined && tx_code.trim() === '') {
      // Throw an error with a specific type/message
      throw new OID4VCIServiceError(InvalidCredentialOffer.invalid_client);
    }
  }
}
