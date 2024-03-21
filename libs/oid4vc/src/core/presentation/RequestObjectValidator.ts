import * as jose from 'jose';
import { OID4VCIServiceError } from '../../lib/errors';
import { PresentationError } from '../../lib/errors/Presentation.errors';
import { ClientIdScheme, JWKSet, RequestObject } from '../../lib/types';
import { HttpUtil, isValidDNSName } from '../../utils';
import { ClientMetadataResolver } from './ClientMetadataResolver';

export class RequestObjectValidator {
  private readonly clientMetadataResolver: ClientMetadataResolver;
  /**
   * Constructor.
   * @param httpUtil the service HTTP client
   */
  public constructor(httpUtil: HttpUtil) {
    this.clientMetadataResolver = new ClientMetadataResolver(httpUtil);
  }

  /**
   * Validate an authorization request object matching the specified client identifier scheme
   *  @see https://openid.net/specs/openid-4-verifiable-presentations-1_0-20.html#name-verifier-metadata-managemen
   *
   * @param requestObjectJwt JWT Signed request object
   * @returns a valid decode request object
   */
  async validate(requestObjectJwt: string) {
    const requestObject = this.decodeRequestJwt(requestObjectJwt);
    if (!requestObject.redirect_uri && !requestObject.response_uri) {
      throw new OID4VCIServiceError(PresentationError.MissingResponseParams);
    }

    const resolvedRequestObject = await this.resolveRequestClientMetadata(
      requestObject
    );

    switch (requestObject.client_id_scheme) {
      case ClientIdScheme.X509_SAN_DNS: {
        await this.x509SanDnsSchemeValidator(requestObjectJwt);
        return resolvedRequestObject;
      }
      case ClientIdScheme.REDIRECT_URI: {
        // request must not be signed when `client_id_scheme` is set to `redirect_uri`
        //https://openid.net/specs/openid-4-verifiable-presentations-1_0-20.html#section-5.7-3.2.1
        throw new OID4VCIServiceError(PresentationError.MisusedClientIdScheme);
      }
      case ClientIdScheme.PRE_REGISTERED: {
        const jwks = resolvedRequestObject.client_metadata?.jwks;
        if (!jwks || jwks.keys.length < 1) {
          throw new OID4VCIServiceError(
            PresentationError.UnResolvedClientMetadataJwk
          );
        }

        await this.preRegisteredSchemeValidator(requestObjectJwt, jwks);
        return resolvedRequestObject;
      }

      default:
        throw new OID4VCIServiceError(
          PresentationError.UnSupportedClientScheme
        );
    }
  }

  private async resolveRequestClientMetadata(requestObject: RequestObject) {
    const clientMetadataOrUri =
      requestObject.client_metadata || requestObject.client_metadata_uri;
    if (clientMetadataOrUri) {
      requestObject = {
        ...requestObject,
        client_metadata:
          await this.clientMetadataResolver.resolveClientMetadataOrUri(
            clientMetadataOrUri
          ),
      };
      delete requestObject.client_metadata_uri;
      delete requestObject.client_metadata?.jwks_uri;
    }
    return requestObject;
  }

  async redirectUriSchemeValidator(requestObject: RequestObject) {
    if (
      requestObject.redirect_uri &&
      requestObject.redirect_uri !== requestObject.client_id
    ) {
      throw new OID4VCIServiceError(PresentationError.MismatchedClientId);
    }

    return this.resolveRequestClientMetadata(requestObject);
  }

  async preRegisteredSchemeValidator(requestObjectJwt: string, jwks: JWKSet) {
    const header = this.decodeRequestHeaderJwt(requestObjectJwt);

    const jwk = jwks.keys.find((_) => _.kid === header.kid);
    if (!jwk) {
      throw new OID4VCIServiceError(
        PresentationError.UnResolvedClientMetadataJwk
      );
    }

    let importedJwk: jose.KeyLike | Uint8Array;
    try {
      importedJwk = await jose.importJWK(jwk);
    } catch (e) {
      throw new OID4VCIServiceError(
        PresentationError.InvalidClientMetadataJwks
      );
    }

    try {
      const result = await jose.jwtVerify<RequestObject>(
        requestObjectJwt,
        importedJwk
      );
      return result.payload as RequestObject;
    } catch (e) {
      throw new OID4VCIServiceError(
        PresentationError.InvalidRequestObjectJwtSignature
      );
    }
  }

  async x509SanDnsSchemeValidator(requestObjectJwt: string) {
    const header = this.decodeRequestHeaderJwt(requestObjectJwt);

    if (!header?.x5c || !header.alg)
      throw new OID4VCIServiceError(
        PresentationError.MissingJwtRequiredHeaderParams
      );
    const jwk = await this.createJWKFromX5C(header.x5c, header.alg);

    let requestObject: RequestObject;
    try {
      const result = await jose.jwtVerify<RequestObject>(requestObjectJwt, jwk);
      requestObject = result.payload;
    } catch (e) {
      throw new OID4VCIServiceError(
        PresentationError.InvalidRequestObjectJwtSignature
      );
    }

    if (!requestObject.client_id || !isValidDNSName(requestObject.client_id)) {
      throw new OID4VCIServiceError(PresentationError.MismatchedClientId);
    }

    return requestObject;
  }

  /**
   * Decodes a request object jwt string
   * @param requestObjectJwt Request object encryted in jwt
   * @returns
   */
  private decodeRequestJwt(requestObjectJwt: string) {
    try {
      return jose.decodeJwt<RequestObject>(requestObjectJwt);
    } catch (e) {
      throw new OID4VCIServiceError(PresentationError.InvalidRequestObjectJwt);
    }
  }

  /**
   * Decodes a request object jwt protected header
   * @param requestObjectJwt Request object encryted in jwt
   * @returns
   */
  private decodeRequestHeaderJwt(requestObjectJwt: string) {
    try {
      return jose.decodeProtectedHeader(requestObjectJwt);
    } catch (e) {
      throw new OID4VCIServiceError(PresentationError.InvalidRequestObjectJwt);
    }
  }

  /**
   * Create a JWK (JSON Web Key) from the X.509 certificate chain
   * @param x5cArray `x5c` from jwt header
   */
  private async createJWKFromX5C(x5cArray: string[], alg: string) {
    // Convert x5c to PEM format
    const pemCert = `-----BEGIN CERTIFICATE-----\n${x5cArray[0]}\n-----END CERTIFICATE-----`;

    try {
      // Create JWK from X.509 certificate chain
      return await jose.importX509(pemCert, alg);
    } catch (e) {
      throw new OID4VCIServiceError(
        PresentationError.InvalidJwkHeaderParams
      );
    }
  }
}
