import { OID4VCIServiceError } from '../../lib/errors';
import { PresentationError } from '../../lib/errors/Presentation.errors';
import {
  PresentationDefinition,
  RequestObject,
  ResolvedRequestObject
} from '../../lib/types';
import { HttpUtil } from '../../utils';
import { RequestObjectValidator } from './RequestObjectValidator';

export class RequestObjectResolver {
  private readonly requestObjectValidator: RequestObjectValidator;
  /**
   * Constructor.
   * @param httpUtil the service HTTP client
   */
  public constructor(private readonly httpUtil: HttpUtil) {
    this.requestObjectValidator = new RequestObjectValidator(httpUtil);
  }

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

    return parsedRequestObject as ResolvedRequestObject;
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
      parsedRequestObject = await this.resolveRequestObjectJwt(request);
    } else if (requestUri) {
      parsedRequestObject = await this.fetchRequestObject(requestUri);
    } else {
      //authorization request is not signed for `redirect_uri` scheme
      for (const [key, value] of params.entries()) {
        Object.assign(parsedRequestObject, { [key]: value });
      }

      parsedRequestObject =
        await this.requestObjectValidator.redirectUriSchemeValidator(
          parsedRequestObject
        );
    }

    return parsedRequestObject;
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

  private resolveRequestObjectJwt(requestObjectJwt: string) {
    return this.requestObjectValidator.validate(requestObjectJwt);
  }
}
