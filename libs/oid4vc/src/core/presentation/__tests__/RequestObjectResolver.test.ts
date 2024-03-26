import { ResponseMode, ClientIdScheme } from '../../../lib/types';
import { PresentationError } from '../../../lib/errors/Presentation.errors';
import { HttpUtil } from '../../../utils/HttpUtil';
import { RequestObjectResolver } from '../RequestObjectResolver';
import {
  clientMetadataValue,
  clientMetadataValueJwks,
  encodedRequestObjectUri,
  encodedRequestUri,
  noClientMetadataResolvedRequestObject,
  presentationDefinitionValue,
  requestObjectJwt,
  requestObjectJwtWithClientMetadata,
  resolvedPresentationExchange,
  requestObjectJwtWithInssufientParams,
  resolvedRequestObject,
  sdJwtProcessedCredentialObjRef1,
  sdJwtProcessedCredentialObjRef2,
} from './fixtures/RequestObjectResolver.fixtures';

import nock from 'nock';
import { DBConnection } from '../../../database/DBConnection';
import { SdJwtCredentialProcessor } from '../../issuance/SdJwtCredentialProcessor';

const MOCK_URL = 'https://verifier.ssi.tir.budru.de';

describe('RequestObjectResolver', () => {
  const httpUtil = new HttpUtil();
  const requestObjectResolver = new RequestObjectResolver(httpUtil);
  const storage = DBConnection.getStorage();
  const sdJwtCredentialProcessor = new SdJwtCredentialProcessor(storage);

  beforeAll(async () => {
    nock.disableNetConnect();
  });

  beforeEach(async () => {
    nock.cleanAll();
  });

  afterAll(async () => {
    nock.cleanAll();
  });

  it('should succesfully return one credential', async () => {
    nock(MOCK_URL)
      .get('/presentation/authorization-request')
      .query({
        id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
        crossDevice: 'true',
      })
      .reply(200, requestObjectJwt);

    // Inserting two credentials, we will have one returning match.
    await sdJwtCredentialProcessor.storeCredential(
      sdJwtProcessedCredentialObjRef1
    );

    await sdJwtCredentialProcessor.storeCredential(
      sdJwtProcessedCredentialObjRef2
    );

    const resolvedURI = await requestObjectResolver.getCredentialsForRequest(
      encodedRequestUri
    );

    expect(resolvedURI).toStrictEqual(resolvedPresentationExchange);
  });

  it('should successfully resolve request uri (Passed By Reference)', async () => {
    nock(MOCK_URL)
      .get('/presentation/authorization-request')
      .query({
        id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
        crossDevice: 'true',
      })
      .reply(200, requestObjectJwt);

    const requestObject = await requestObjectResolver.resolveRequestObject(
      encodedRequestUri
    );

    expect(requestObject).toStrictEqual(noClientMetadataResolvedRequestObject);
  });

  it('should successfully resolve request object encoded in uri (Passed By Value)', async () => {
    nock(MOCK_URL)
      .get('/presentation/definition')
      .query({
        id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
      })
      .reply(200, presentationDefinitionValue)
      .get('/presentation/client-metadata.json')
      .reply(200, clientMetadataValue)
      .get('/presentation/jwks.json')
      .reply(200, clientMetadataValueJwks);

    const requestObject = await requestObjectResolver.resolveRequestObject(
      encodedRequestObjectUri
    );
    const expectedRequestObject = {
      ...resolvedRequestObject,
      client_id_scheme: ClientIdScheme.REDIRECT_URI,
    };
    delete expectedRequestObject['redirect_uri'];
    expect(requestObject).toStrictEqual(expectedRequestObject);
  });

  it('should resolve request object containing client metadata', async () => {
    nock(MOCK_URL)
      .get('/presentation/definition')
      .query({
        id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
      })
      .reply(200, presentationDefinitionValue)
      .get('/presentation/client-metadata.json')
      .reply(200, clientMetadataValue)
      .get('/presentation/jwks.json')
      .reply(200, clientMetadataValueJwks);

    const requestObject = await requestObjectResolver.resolveRequestObject(
      `haip://?client_id=verifier.datatev.de&request=${requestObjectJwtWithClientMetadata}`
    );

    const expectedObject = {
      ...resolvedRequestObject,
      client_id: 'verifier.datatev.de',
      response_mode: ResponseMode.FRAGMENT,
      client_id_scheme: ClientIdScheme.PRE_REGISTERED,
    };
    expect(requestObject).toStrictEqual(expectedObject);
  });

  it('should successfully resolve request object jwt (Passed By value)', async () => {
    const requestObject = await requestObjectResolver.resolveRequestObject(
      `haip://?client_id=verifier.ssi.tir.budru.de&request=${requestObjectJwt}`
    );

    expect(requestObject).toStrictEqual(noClientMetadataResolvedRequestObject);
  });

  it('should not parsed invalid request object', async () => {
    await expect(
      requestObjectResolver.resolveRequestObject('haip://')
    ).rejects.toThrow(PresentationError.MissingQueryString);

    await expect(
      requestObjectResolver.resolveRequestObject(
        'haip://?client_id=verifier.ssi.tir.budru.de'
      )
    ).rejects.toThrow(PresentationError.MissingRequiredParams);

    await expect(
      requestObjectResolver.resolveRequestObject(
        `haip://?client_id=verifier.ssi.tir.budru.de&request=eyInvalidJwt`
      )
    ).rejects.toThrow(PresentationError.InvalidRequestObjectJwt);
  });

  it('should not resolve request object with missing response params', async () => {
    nock(MOCK_URL)
      .get('/presentation/definition')
      .query({
        id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
      })
      .reply(200, presentationDefinitionValue);

    await expect(
      requestObjectResolver.resolveRequestObject(
        `haip://?client_id=verifier.ssi.tir.budru.de&request=${requestObjectJwtWithInssufientParams}`
      )
    ).rejects.toThrow(PresentationError.MissingResponseParams);
  });

  it('should not resolve request object', async () => {
    nock(MOCK_URL)
      .get('/presentation/authorization-request')
      .query({
        id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
        crossDevice: 'true',
      })
      .reply(500);

    await expect(
      requestObjectResolver.resolveRequestObject(encodedRequestUri)
    ).rejects.toThrow(PresentationError.UnResolvedRequestObject);
  });

  it('schould not resolve presentation definition', async () => {
    nock(MOCK_URL)
      .get('/presentation/authorization-request')
      .query({
        id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
        crossDevice: 'true',
      })
      .reply(200, requestObjectJwt)
      .get('/presentation/client-metadata.json')
      .reply(200, clientMetadataValue)
      .get('/presentation/jwks.json')
      .reply(200, clientMetadataValueJwks)
      .get('/presentation/definition')
      .query({
        id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
      })
      .reply(500);

    await expect(
      requestObjectResolver.resolveRequestObject(encodedRequestObjectUri)
    ).rejects.toThrow(PresentationError.UnResolvedPresentationDefinition);
  });

  it('should not resolve client metadata', async () => {
    nock(MOCK_URL)
      .get('/presentation/authorization-request')
      .query({
        id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
        crossDevice: 'true',
      })
      .reply(200, requestObjectJwt)
      .get('/presentation/definition')
      .query({
        id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
      })
      .reply(200, presentationDefinitionValue)
      .get('/presentation/client-metadata.json')
      .reply(500);

    await expect(
      requestObjectResolver.resolveRequestObject(encodedRequestObjectUri)
    ).rejects.toThrow(PresentationError.UnResolvedClientMetadata);
  });

  it('should resolve client metadata jwks', async () => {
    nock(MOCK_URL)
      .get('/presentation/authorization-request')
      .query({
        id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
        crossDevice: 'true',
      })
      .reply(200, requestObjectJwt)
      .get('/presentation/definition')
      .query({
        id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
      })
      .reply(200, presentationDefinitionValue)
      .get('/presentation/client-metadata.json')
      .reply(200, clientMetadataValue)
      .get('/presentation/jwks.json')
      .reply(500);

    await expect(
      requestObjectResolver.resolveRequestObject(encodedRequestObjectUri)
    ).rejects.toThrow(PresentationError.UnResolvedClientMetadataJwk);
  });
});
