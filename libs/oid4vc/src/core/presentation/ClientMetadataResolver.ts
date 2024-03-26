import { OID4VCIServiceError } from '../../lib/errors';
import { PresentationError } from '../../lib/errors/Presentation.errors';
import {
  ClientMetadata,
  JWKSet,
  ResolvedClientMetadata,
} from '../../lib/types';
import { HttpUtil } from '../../utils';

export class ClientMetadataResolver {
  /**
   * Constructor.
   * @param httpUtil the service HTTP client
   */
  public constructor(private readonly httpUtil: HttpUtil) {}

  async resolveClientMetadataOrUri(
    clientMetadataOrUri: ClientMetadata | string
  ) {
    if (typeof clientMetadataOrUri === 'string') {
      return this.resolveClientMetadata(clientMetadataOrUri);
    } else {
      if (clientMetadataOrUri.jwks_uri) {
        const jwks = await this.resolveClientMetadataJwks(
          clientMetadataOrUri.jwks_uri
        );
        clientMetadataOrUri = { ...clientMetadataOrUri, jwks };
        delete clientMetadataOrUri.jwks_uri;
      }
      return clientMetadataOrUri;
    }
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

    return clientMetadata as ResolvedClientMetadata;
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
}
