import { PresentationError } from '../../../lib/errors/Presentation.errors';
import { ClientIdScheme } from '../../../lib/types';
import { HttpUtil } from '../../../utils';
import { RequestObjectValidator } from '../RequestObjectValidator';
import { TEST_JWK_KID, resolvedRequestObject, signRequestPayload } from './fixtures';

describe('RequestObjectValidator', () => {
  const httpUtil = new HttpUtil();
  const requestObjectValidator = new RequestObjectValidator(httpUtil);

  it('should throw unsupported client identifier scheme exception', async () => {
    const { signedJwt } = await signRequestPayload({
      ...resolvedRequestObject,
      client_id_scheme: ClientIdScheme.ENTITY_ID,
    });

    await expect(requestObjectValidator.validate(signedJwt)).rejects.toThrow(
      PresentationError.UnSupportedClientScheme
    );
  });

  it('should throw misused client identifier scheme exception', async () => {
    const { signedJwt } = await signRequestPayload({
      ...resolvedRequestObject,
      client_id_scheme: ClientIdScheme.REDIRECT_URI,
    });

    await expect(requestObjectValidator.validate(signedJwt)).rejects.toThrow(
      PresentationError.MisusedClientIdScheme
    );
  });

  it('should throw unresolved client metadata jwks exception', async () => {
    const { signedJwt: signedJwt1 } = await signRequestPayload({
      ...resolvedRequestObject,
      client_metadata: {
        ...resolvedRequestObject.client_metadata,
        jwks: undefined,
      },
      client_id_scheme: ClientIdScheme.PRE_REGISTERED,
    });

    await expect(requestObjectValidator.validate(signedJwt1)).rejects.toThrow(
      PresentationError.UnResolvedClientMetadataJwk
    );

    const { signedJwt } = await signRequestPayload({
      ...resolvedRequestObject,
      client_metadata: {
        ...resolvedRequestObject.client_metadata,
        jwks: {
          keys: [{ alg: 'RS256', kid: 'not-found-key-id' }],
        },
      },
      client_id_scheme: ClientIdScheme.PRE_REGISTERED,
    });

    await expect(requestObjectValidator.validate(signedJwt)).rejects.toThrow(
      PresentationError.UnResolvedClientMetadataJwk
    );
  });

  it('should throw invalid client metadata jwks exception', async () => {
    const { signedJwt } = await signRequestPayload({
      ...resolvedRequestObject,
      client_metadata: {
        ...resolvedRequestObject.client_metadata,
        jwks: {
          keys: [
            {
              alg: 'RS256',
              kty: 'RSA',
              e: 'AQAB',
              kid: TEST_JWK_KID,
            },
          ],
        },
      },
      client_id_scheme: ClientIdScheme.PRE_REGISTERED,
    });

    await expect(requestObjectValidator.validate(signedJwt)).rejects.toThrow(
      PresentationError.InvalidClientMetadataJwks
    );
  });

  it('should throw mismatched client identifier exception', async () => {
    await expect(
      requestObjectValidator.redirectUriSchemeValidator({
        ...resolvedRequestObject,
        client_id_scheme: ClientIdScheme.REDIRECT_URI,
      })
    ).rejects.toThrow(PresentationError.MismatchedClientId);
  });
});
