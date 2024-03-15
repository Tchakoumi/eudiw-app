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

  async resolveRequestObject(requestObject: string) {
    const parsedRequestObject = await this.parsedRequestObject(requestObject);

    if (parsedRequestObject.client_metadata_uri) {
      parsedRequestObject.client_metadata = await this.resolvedClientMetadata(
        parsedRequestObject.client_metadata_uri
      );
    }

    if (parsedRequestObject.presentation_definition_uri) {
      parsedRequestObject.presentation_definition =
        await this.resolvedPresentationDefinition(
          parsedRequestObject.presentation_definition_uri
        );
    }
    return parsedRequestObject;
  }

  async parsedRequestObject(encodedUri: string) {
    const url = new URL(encodedUri);
    if (!url.search) {
      throw new OID4VCIServiceError(PresentationError.MissingQueryString);
    }

    const params = new URLSearchParams(url.search);
    if (!params.has('request_uri')) {
      throw new OID4VCIServiceError(PresentationError.MissingRequiredParams);
    }

    const requestUri = params.get('request_uri');
    const response = await this.httpUtil.openIdFetch<RequestObject>(
      requestUri as string
    );

    if (!response.successBody || response.errorBody) {
      throw new OID4VCIServiceError(PresentationError.UnResolvedRequestObject);
    }

    let requestObject = response.successBody;
    if (typeof requestObject === 'string') {
      requestObject = jose.decodeJwt<RequestObject>(requestObject);
    }

    return requestObject;
  }

  async resolvedClientMetadata(clientMetadatUri: string) {
    const response = await this.httpUtil.openIdFetch<RequestClientMetadata>(
      clientMetadatUri
    );

    if (!response.successBody || response.errorBody) {
      throw new OID4VCIServiceError(PresentationError.UnResolvedClientMetadata);
    }

    return response.successBody;
  }

  async resolvedPresentationDefinition(presentationDefinitionUri: string) {
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
