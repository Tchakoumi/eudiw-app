import * as jose from 'jose';
import { OID4VCIServiceError } from '../../lib/errors';
import { PresentationError } from '../../lib/errors/Presentation.errors';
import { JWKSet } from '../../lib/types';
import { PresentationDefinition } from '../../lib/types/presentation/PresentationExchange.types';
import { ClientMetadata } from '../../lib/types/presentation/RequestClientMetadata.types';
import { RequestObject } from '../../lib/types/presentation/v1_0_20/RequestObject.types';
import { HttpUtil } from '../../utils';

export class RequestObjectResolver {
  /**
   * Constructor.
   * @param httpUtil the service HTTP client
   */
  public constructor(private httpUtil: HttpUtil) {}

  async resolveRequestObject(requestObjectUri: string) {
    const parsedRequestObject = await this.parsedRequestObjectUri(
      requestObjectUri
    );

    if (parsedRequestObject.presentation_definition_uri) {
      parsedRequestObject.presentation_definition =
        await this.resolvePresentationDefinition(
          parsedRequestObject.presentation_definition_uri
        );
      delete parsedRequestObject.presentation_definition_uri;
    }

    if (parsedRequestObject.client_metadata) {
      if (parsedRequestObject.client_metadata.jwks_uri) {
        parsedRequestObject.client_metadata.jwks =
          await this.resolveClientMetadataJwks(
            parsedRequestObject.client_metadata.jwks_uri
          );
        delete parsedRequestObject.client_metadata.jwks_uri;
      }
    } else if (parsedRequestObject.client_metadata_uri) {
      parsedRequestObject.client_metadata = await this.resolveClientMetadata(
        parsedRequestObject.client_metadata_uri
      );
    }

    return parsedRequestObject;
  }

  async parsedRequestObjectUri(encodedUri: string) {
    const url = new URL(encodedUri);
    if (!url.search) {
      throw new OID4VCIServiceError(PresentationError.MissingQueryString);
    }

    const params = new URLSearchParams(url.search);
    const request = params.get('request');
    const requestUri = params.get('request_uri');
    const presentationDefinitionUri = params.get('presentation_definition_uri');

    if (!request && !requestUri && !presentationDefinitionUri) {
      throw new OID4VCIServiceError(PresentationError.MissingRequiredParams);
    }

    let parsedRequestObject: RequestObject = {};
    if (request) {
      parsedRequestObject = this.resolveRequestObjectJwt(request);
    } else if (requestUri) {
      parsedRequestObject = await this.fetchRequestObject(requestUri);
    } else {
      for (const [key, value] of params.entries()) {
        parsedRequestObject[key] = value;
      }
    }

    if (
      !parsedRequestObject.redirect_uri &&
      !parsedRequestObject.response_uri
    ) {
      throw new OID4VCIServiceError(PresentationError.MissingResponseParams);
    }

    return parsedRequestObject;
  }

  private resolveRequestObjectJwt(request: string) {
    try {
      return jose.decodeJwt<RequestObject>(request);
    } catch (e) {
      throw new OID4VCIServiceError(PresentationError.InvalidRequestObjectJwt);
    }
  }

  async fetchRequestObject(requestUri: string) {
    const response = await this.httpUtil.openIdFetch<string>(
      requestUri as string
    );

    if (!response.successBody || response.errorBody) {
      throw new OID4VCIServiceError(PresentationError.UnResolvedRequestObject);
    }

    return this.resolveRequestObjectJwt(response.successBody);
  }

  async resolveClientMetadata(clientMetadatUri: string) {
    const response = await this.httpUtil.openIdFetch<ClientMetadata>(
      clientMetadatUri
    );

    if (!response.successBody || response.errorBody) {
      throw new OID4VCIServiceError(PresentationError.UnResolvedClientMetadata);
    }

    const clientMetadata = response.successBody;
    if (response.successBody.jwks_uri) {
      clientMetadata.jwks = await this.resolveClientMetadataJwks(
        response.successBody.jwks_uri
      );
      delete clientMetadata.jwks_uri;
    }

    return clientMetadata;
  }

  async resolveClientMetadataJwks(jwksUri: string) {
    const response = await this.httpUtil.openIdFetch<JWKSet>(jwksUri);

    if (!response.successBody || response.errorBody) {
      throw new OID4VCIServiceError(
        PresentationError.UnResolvedClientMetadataJwk
      );
    }
    return response.successBody;
  }

  async resolvePresentationDefinition(presentationDefinitionUri: string) {
    const response = await this.httpUtil.openIdFetch<PresentationDefinition>(
      presentationDefinitionUri
    );

    if (!response.successBody || response.errorBody) {
      throw new OID4VCIServiceError(
        PresentationError.UnResolvedPresentationDefinition
      );
    }

    return response.successBody;
  }
}
