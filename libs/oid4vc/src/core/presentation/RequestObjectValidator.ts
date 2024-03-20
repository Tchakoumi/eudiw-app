import * as jose from 'jose';
import { OID4VCIServiceError } from '../../lib/errors';
import { PresentationError } from '../../lib/errors/Presentation.errors';
import { ClientIdScheme, RequestObject } from '../../lib/types';
import { isValidDNSName } from '../../utils';

export class RequestObjectValidator {
  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Validate an authorization request object matching the specified client identifier scheme
   *  @see https://openid.net/specs/openid-4-verifiable-presentations-1_0-20.html#name-verifier-metadata-managemen
   *
   * @param requestObjectJwt JWT Signed request object
   * @returns
   */
  validate(requestObjectJwt: string) {
    const requestObject = this.decodeRequestJwt(requestObjectJwt);
    if (!requestObject.redirect_uri && !requestObject.response_uri) {
      throw new OID4VCIServiceError(PresentationError.MissingResponseParams);
    }

    switch (requestObject.client_id_scheme) {
      case ClientIdScheme.X509_SAN_DNS:
        return this.x509SanDnsSchemeValidator(requestObjectJwt);
      case ClientIdScheme.REDIRECT_URI:
        // request must not be signed when `client_id_scheme` is set to `redirect_uri`
        //https://openid.net/specs/openid-4-verifiable-presentations-1_0-20.html#section-5.7-3.2.1
        throw new OID4VCIServiceError(PresentationError.MisusedClientIdScheme);
      case ClientIdScheme.PRE_REGISTERED:
        return this.preRegisteredSchemeValidator(requestObject);

      default:
        throw new OID4VCIServiceError(
          PresentationError.InvalidRequestObjectJwt
        );
    }
  }

  redirectUriSchemeValidator(requestObject: RequestObject) {
    if (
      requestObject.redirect_uri &&
      requestObject.redirect_uri !== requestObject.client_id
    ) {
      throw new OID4VCIServiceError(PresentationError.MismatchedClientId);
    }

    return requestObject;
  }

  preRegisteredSchemeValidator(requestObject: RequestObject) {
    //TODO validate client metadata according to `pre-registered` scheme
    return requestObject;
  }

  async x509SanDnsSchemeValidator(requestObjectJwt: string) {
    let header: jose.ProtectedHeaderParameters;
    try {
      header = jose.decodeProtectedHeader(requestObjectJwt);
    } catch (e) {
      throw new OID4VCIServiceError(PresentationError.InvalidRequestObjectJwt);
    }

    if (!header?.x5c || !header?.kid || !header.alg)
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
        PresentationError.UnResolvedJwkHeaderParams
      );
    }
  }
}
