import { OID4VCIServiceError } from '../../lib/errors';
import { PresentationError } from '../../lib/errors/Presentation.errors';
import { PresentationDefinition } from '../../lib/types/presentation/vp_v1_0_20/PresentationExchange.types';
import { RequestClientMetadata } from '../../lib/types/presentation/vp_v1_0_20/RequestClientMetadata.types';
import { RequestObject } from '../../lib/types/presentation/vp_v1_0_20/RequestObject.types';
import { HttpUtil } from '../../utils';

export class RequestObjectResolver {
  /**
   * Constructor.
   * @param httpUtil the service HTTP client
   */
  public constructor(private httpUtil: HttpUtil) {}

  async resolveRequestObject(requestJwtOrUri: string) {
    const response =
      await this.httpUtil.openIdFetch<RequestObject>(
        requestJwtOrUri
      );

    if (!response.successBody || response.errorBody) {
      throw new OID4VCIServiceError(PresentationError.UnResolvedRequestObject);
    }
    const requestObject = response.successBody;
    // const { client_metadata: clientMetadata, client_metadata_uri: clientMetadatUri } = response.successBody;

    if (requestObject.client_metadata_uri) {
      requestObject.client_metadata = await this.resolvedClientMetadata(
        requestObject.client_metadata_uri
      );
    }

    if (requestObject.presentation_definition_uri) {
      requestObject.presentation_definition =
        await this.resolvedPresentationDefinition(
          requestObject.presentation_definition_uri
        );
    }
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
