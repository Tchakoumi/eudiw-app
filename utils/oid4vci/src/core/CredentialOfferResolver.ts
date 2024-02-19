import { fetch } from 'cross-fetch';

import { WELL_KNOWN_ENDPOINTS } from '../constants';
import { InvalidCredentialOffer, OID4VCIServiceError } from '../lib/errors';
import { composeUrl } from '../utils';

import {
  AuthorizationServerMetadata,
  CredentialIssuerMetadata,
  CredentialOffer,
  DiscoveryMetadata,
  Grant,
  JwtIssuerMetadata,
  ResolvedCredentialOffer,
} from '../lib/types';

export class CredentialOfferResolver {
  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Resolves a credential offer (along with issuer metadata).
   * @param credentialOffer a credential offer string provided as a link,
   *                        potentially resulting from a QR code scan
   * @returns the resolved credential offer alongside issuer metadata
   */
  public async resolveCredentialOffer(
    credentialOffer: string
  ): Promise<ResolvedCredentialOffer> {
    const parsedCredentialOffer = await this.parseCredentialOffer(
      credentialOffer
    );

    return {
      credentialOffer: parsedCredentialOffer,
      discoveryMetadata: await this.fetchDiscoveryMetadata(
        parsedCredentialOffer
      ),
    };
  }

  /**
   * Parses an out-of-band credential offer into an object.
   *
   * It handles dereferencing offers by reference.
   *
   * @param credentialOffer out-of-band credential offer
   * @returns credential offer object
   */
  private async parseCredentialOffer(credentialOffer: string) {
    const query = credentialOffer.split('?')[1];
    if (query == undefined) {
      throw new OID4VCIServiceError(InvalidCredentialOffer.MissingQueryString);
    }

    const params = new URLSearchParams(query);
    const paramLength = Array.from(params.keys()).length;

    if (paramLength !== 1) {
      throw new OID4VCIServiceError(InvalidCredentialOffer.WrongParamCount);
    }

    if (
      !params.has('credential_offer') &&
      !params.has('credential_offer_uri')
    ) {
      throw new OID4VCIServiceError(
        InvalidCredentialOffer.MissingRequiredParams
      );
    }

    const credentialOfferURI = params.get('credential_offer_uri');
    const parsedCredentialOffer = credentialOfferURI
      ? await this.fetchCredentialOffer(credentialOfferURI)
      : params.get('credential_offer') ?? '';

    try {
      return JSON.parse(parsedCredentialOffer ?? '') as CredentialOffer;
    } catch (e) {
      throw new OID4VCIServiceError(
        InvalidCredentialOffer.DeserializationError
      );
    }
  }

  /**
   * Fetch credential offer from a resource link.
   * @param credentialOfferURI a resource link to retrieve a credential offer payload from
   * @returns credential offer object as stringified JSON
   */
  private async fetchCredentialOffer(
    credentialOfferURI: string
  ): Promise<string> {
    return await fetch(credentialOfferURI).then((response) => {
      if (!response.ok) {
        throw new Error('Not 2xx response');
      }

      return response.text();
    });
  }

  /**
   * Fetch discovery metadata associated with the issuer.
   * @param credentialOffer the crendential offer object
   * @returns discovery metadata
   */
  private async fetchDiscoveryMetadata(
    credentialOffer: CredentialOffer
  ): Promise<DiscoveryMetadata> {
    const { credential_issuer: credentialIssuer } = credentialOffer;
    if (!credentialIssuer) {
      throw new OID4VCIServiceError(
        InvalidCredentialOffer.MissingCredentialIssuer
      );
    }

    const credentialIssuerMetadata = await this.fetchCredentialIssuerMetadata(
      credentialIssuer
    );

    const authorizationServerMetadata =
      await this.fetchSuitableAuthorizationServerMetadata(
        credentialOffer,
        credentialIssuerMetadata
      );

    const jwtIssuerMetadata = await this.fetchJwtIssuerMetadata(
      credentialIssuer
    );

    return {
      credentialIssuerMetadata,
      authorizationServerMetadata,
      jwtIssuerMetadata,
    };
  }

  /**
   * Fetch credential issuer metadata from normative well-known endpoint.
   * @param credentialIssuer the crendential issuer URI
   * @returns its credential issuer metadata
   * @link https://openid.github.io/OpenID4VCI/openid-4-verifiable-credential-issuance-wg-draft.html#name-credential-issuer-metadata
   */
  private async fetchCredentialIssuerMetadata(
    credentialIssuer: string
  ): Promise<CredentialIssuerMetadata> {
    const url = composeUrl(
      credentialIssuer,
      WELL_KNOWN_ENDPOINTS.CREDENTIAL_ISSUER_METADATA
    );

    const metadata = await this.fetchMetadata(url);

    return metadata as CredentialIssuerMetadata;
  }

  /**
   * Fetch authorization server metadata from identified suitable server.
   *
   * @param credentialOffer the crendential offer object
   * @param credentialIssuerMetadata the crendential issuer metadata
   * @param grantType the grant type of interest
   *
   * @returns authorization server metadata
   */
  private async fetchSuitableAuthorizationServerMetadata(
    credentialOffer: CredentialOffer,
    credentialIssuerMetadata: CredentialIssuerMetadata,
    grantType: keyof Grant = 'urn:ietf:params:oauth:grant-type:pre-authorized_code'
  ): Promise<AuthorizationServerMetadata> {
    const authorizationServers =
      credentialIssuerMetadata.authorization_servers ?? [];

    // If an authorization server is referenced in the credential offer,
    // the wallet MUST not proceed if it is not featured in the credential
    // issuer metadata.

    const authorizationServer =
      credentialOffer.grants?.[grantType]?.authorization_server;

    if (authorizationServer) {
      if (!authorizationServers.includes(authorizationServer)) {
        throw new OID4VCIServiceError(
          InvalidCredentialOffer.UnresolvableAuthorizationServer
        );
      }

      return await this.fetchAuthorizationServerMetadata(authorizationServer);
    }

    // Else, provided the list of authorization servers is not empty,
    // return the first entry that has support for requested grant type.

    if (authorizationServers.length > 0) {
      for (const authorizationServer of authorizationServers) {
        const metadata = await this.fetchAuthorizationServerMetadata(
          authorizationServer
        );

        if (metadata.grant_types_supported?.includes(grantType)) {
          return metadata;
        }
      }

      throw new OID4VCIServiceError(
        InvalidCredentialOffer.UnresolvableAuthorizationServer
      );
    }

    // Else, just assume the credential issuer serves as the authorization server.

    return await this.fetchAuthorizationServerMetadata(
      credentialOffer.credential_issuer
    );
  }

  /**
   * Fetch authorization server metadata.
   *
   * This implementation first considers the well-known endpoint to the OpenID Provider
   * Configuration, which is a superset of OAuth 2.0 Authorization Server Metadata.
   * If unavailable, it defaults to the latter's well-known endpoint.
   *
   * @param authorizationServer the authorization server URL
   * @returns authorization server metadata
   */
  private async fetchAuthorizationServerMetadata(
    authorizationServer: string
  ): Promise<AuthorizationServerMetadata> {
    let metadata: AuthorizationServerMetadata;

    try {
      const url = composeUrl(
        authorizationServer,
        WELL_KNOWN_ENDPOINTS.OPENID_PROVIDER_CONFIGURATION
      );
      metadata = (await this.fetchMetadata(url)) as AuthorizationServerMetadata;
    } catch (e) {
      const url = composeUrl(
        authorizationServer,
        WELL_KNOWN_ENDPOINTS.OAUTH_SERVER_METADATA
      );
      metadata = (await this.fetchMetadata(url)) as AuthorizationServerMetadata;
    }

    return metadata;
  }

  /**
   * Fetch JWT Issuer Metadata.
   * @param credentialIssuer the crendential issuer URI
   * @returns its JWT issuer metadata
   * @link https://datatracker.ietf.org/doc/html/draft-ietf-oauth-sd-jwt-vc-01#name-jwt-issuer-metadata
   */
  private async fetchJwtIssuerMetadata(
    credentialIssuer: string
  ): Promise<JwtIssuerMetadata | undefined> {
    const url = composeUrl(
      credentialIssuer,
      WELL_KNOWN_ENDPOINTS.JWT_ISSUER_METADATA
    );

    // Tolerate unavailable JWT issuer metadata
    const metadata = await this.fetchMetadata(url).catch(() => {});

    return metadata as JwtIssuerMetadata | undefined;
  }

  /**
   * Fetch metadata agnostically.
   * @param url a URL to retrieve the metadata payload from
   * @returns the retrieved metadata as JSON
   */
  private async fetchMetadata(url: string): Promise<object> {
    return await fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error('Not 2xx response');
      }

      return response.json();
    });
  }
}
