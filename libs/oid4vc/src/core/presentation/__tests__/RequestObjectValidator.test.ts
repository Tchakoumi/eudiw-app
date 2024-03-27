import { PresentationError } from '../../../lib/errors/Presentation.errors';
import { ClientIdScheme } from '../../../lib/types';
import { HttpUtil } from '../../../utils';
import { RequestObjectValidator } from '../RequestObjectValidator';
import {
  TEST_JWK_KID,
  X5C_CERTIFICATE,
  resolvedRequestObject,
  signRequestPayload,
} from './fixtures';

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

  it('should throw invalid request object jwt signature exception (pre-registered)', async () => {
    const { signedJwt } = await signRequestPayload({
      ...resolvedRequestObject,
      client_metadata: {
        ...resolvedRequestObject.client_metadata,
        jwks: {
          keys: [
            {
              alg: 'RS256',
              kty: 'RSA',
              n: 'invalid-jwt-key-header',
              e: 'AQAB',
              kid: TEST_JWK_KID,
            },
          ],
        },
      },
      client_id_scheme: ClientIdScheme.PRE_REGISTERED,
    });

    await expect(requestObjectValidator.validate(signedJwt)).rejects.toThrow(
      PresentationError.InvalidRequestObjectJwtSignature
    );
  });

  it('should throw missing jwt required header params exception', async () => {
    const { signedJwt } = await signRequestPayload({
      ...resolvedRequestObject,
      client_id_scheme: ClientIdScheme.X509_SAN_DNS,
    });

    await expect(requestObjectValidator.validate(signedJwt)).rejects.toThrow(
      PresentationError.MissingJwtRequiredHeaderParams
    );
  });

  it('should throw invalid jwk header params exception', async () => {
    const { signedJwt } = await signRequestPayload(
      {
        ...resolvedRequestObject,
        client_id_scheme: ClientIdScheme.X509_SAN_DNS,
      },
      { alg: 'ES256', x5c: ['Invalid-certificate'] }
    );

    await expect(requestObjectValidator.validate(signedJwt)).rejects.toThrow(
      PresentationError.InvalidJwkHeaderParams
    );
  });

  it('should throw invalid request object jwt signature exception (x509_san_dns)', async () => {
    const { signedJwt } = await signRequestPayload(
      {
        ...resolvedRequestObject,
        client_id_scheme: ClientIdScheme.X509_SAN_DNS,
      },
      // The certificate is a valid one but not correspond to the keypair used to sign with
      { alg: 'ES256', x5c: [X5C_CERTIFICATE] }
    );

    await expect(requestObjectValidator.validate(signedJwt)).rejects.toThrow(
      PresentationError.InvalidRequestObjectJwtSignature
    );
  });
});
