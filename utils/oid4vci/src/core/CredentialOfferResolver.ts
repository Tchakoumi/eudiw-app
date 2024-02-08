import { WELL_KNOWN_ENDPOINTS } from '../constants';
import { InvalidCredentialOffer, OID4VCIServiceError } from '../errors';
import { CredentialOffer, ResolvedCredentialOffer } from '../types';

export class CredentialOfferResolver {
  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Resolves a credential offer (along with issuer metadata).
   * @param credentialOffer a credential offer string provided as a link
   *                        or resulting from a QR code scan
   * @returns the resolved credential offer alongside issuer metadata
   */
  public async resolveCredentialOffer(
    credentialOffer: string
  ): Promise<ResolvedCredentialOffer> {
    const parsedCredentialOffer = await this.parseCredentialOffer(
      credentialOffer
    );

    const credentialIssuer = parsedCredentialOffer.credential_issuer;
    if (!credentialIssuer) {
      throw new OID4VCIServiceError(
        InvalidCredentialOffer.MissingCredentialIssuer
      );
    }

    const credentialIssuerMetadata = await this.fetchCredentialIssuerMetadata(
      credentialIssuer
    );

    const authorizationServerMetadata =
      await this.fetchAuthorizationServerMetadata(credentialIssuer);

    const jwtIssuerMetadata = await this.fetchJwtIssuerMetadata(
      credentialIssuer
    );

    return {
      credentialOffer: parsedCredentialOffer,
      metadata: {
        credentialIssuerMetadata,
        authorizationServerMetadata,
        jwtIssuerMetadata,
      },
    };
  }

  /**
   * Parses an out-of-band credential offer into an object.
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
      : params.get('credential_offer');

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
   * @returns credential offer object
   */
  private async fetchCredentialOffer(
    credentialOfferURI: string
  ): Promise<string> {
    return await fetch(credentialOfferURI).then((response) => response.text());
  }

  /**
   * Fetch credential issuer metadata.
   * @param credentialIssuer the location of the crendential issuer
   * @returns metadata
   * @link https://openid.github.io/OpenID4VCI/openid-4-verifiable-credential-issuance-wg-draft.html#name-credential-issuer-metadata
   */
  private async fetchCredentialIssuerMetadata(
    credentialIssuer: string
  ): Promise<object> {
    const url = this.appendEndpoint(
      credentialIssuer,
      WELL_KNOWN_ENDPOINTS.CREDENTIAL_ISSUER_METADATA
    );
    return await this.fetchMetadata(url);
  }

  /**
   * Fetch authorization server metadata.
   *
   * This implementation first considers the endpoint to the OpenID Provider Configuration,
   * which is a superset of OAuth 2.0 Authorization Server Metadata. If unavailable, it
   * defaults to the latter's endpoint.
   *
   * @param credentialIssuer the location of the crendential issuer
   * @returns authorization server metadata
   */
  private async fetchAuthorizationServerMetadata(
    credentialIssuer: string
  ): Promise<object> {
    let metadata;

    try {
      const url = this.appendEndpoint(
        credentialIssuer,
        WELL_KNOWN_ENDPOINTS.OPENID_PROVIDER_CONFIGURATION
      );
      metadata = await this.fetchMetadata(url);
    } catch (e) {
      const url = this.appendEndpoint(
        credentialIssuer,
        WELL_KNOWN_ENDPOINTS.OAUTH_SERVER_METADATA
      );
      metadata = await this.fetchMetadata(url);
    }

    return metadata;
  }

  /**
   * Fetch JWT Issuer Metadata.
   * @param credentialIssuer the location of the crendential issuer
   * @returns JWT issuer metadata
   * @link https://datatracker.ietf.org/doc/html/draft-ietf-oauth-sd-jwt-vc-01#name-jwt-issuer-metadata
   */
  private async fetchJwtIssuerMetadata(
    credentialIssuer: string
  ): Promise<object> {
    const url = this.appendEndpoint(
      credentialIssuer,
      WELL_KNOWN_ENDPOINTS.JWT_ISSUER_METADATA
    );

    return await this.fetchMetadata(url);
  }

  private async fetchMetadata(url: string): Promise<object> {
    return await fetch(url).then((response) => response.json());
  }

  private appendEndpoint(baseUrl: string, endpoint: string) {
    const trimmedBaseUrl = baseUrl.replace(/\/$/, '');
    const trimmedEndpoint = endpoint.replace(/^\//, '');

    return `${trimmedBaseUrl}/${trimmedEndpoint}`;
  }
}
