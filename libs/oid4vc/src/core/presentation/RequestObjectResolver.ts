import * as jose from 'jose';
import { OID4VCIServiceError } from '../../lib/errors';
import { PresentationError } from '../../lib/errors/Presentation.errors';
import { PresentationDefinition } from '../../lib/types/presentation/PresentationExchange.types';
import { RequestClientMetadata } from '../../lib/types/presentation/RequestClientMetadata.types';
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

    if (parsedRequestObject.client_metadata_uri) {
      parsedRequestObject.client_metadata = await this.resolveClientMetadata(
        parsedRequestObject.client_metadata_uri
      );
    }

    if (parsedRequestObject.presentation_definition_uri) {
      parsedRequestObject.presentation_definition =
        await this.resolvePresentationDefinition(
          parsedRequestObject.presentation_definition_uri
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
      throw new OID4VCIServiceError(PresentationError.MissingRequiredParams);
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
    const response = await this.httpUtil.openIdFetch<string | RequestObject>(
      requestUri as string
    );

    if (!response.successBody || response.errorBody) {
      throw new OID4VCIServiceError(PresentationError.UnResolvedRequestObject);
    }

    let requestObject = response.successBody;
    if (typeof requestObject === 'string') {
      requestObject = this.resolveRequestObjectJwt(requestObject);
    }

    return requestObject;
  }

  async resolveClientMetadata(clientMetadatUri: string) {
    const response = await this.httpUtil.openIdFetch<RequestClientMetadata>(
      clientMetadatUri
    );

    if (!response.successBody || response.errorBody) {
      throw new OID4VCIServiceError(PresentationError.UnResolvedClientMetadata);
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
