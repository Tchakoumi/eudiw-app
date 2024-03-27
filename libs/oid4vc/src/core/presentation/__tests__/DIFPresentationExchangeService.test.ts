import { DBConnection } from '../../../database/DBConnection';
import { credentialStoreName } from '../../../database/schema';
import { HttpUtil } from '../../../utils';
import { SdJwtCredentialProcessor } from '../../issuance/SdJwtCredentialProcessor';
import {
  clientMetadataValueJwks1,
  encodedRequestObjectUri,
  presentationDefinitionValue1,
  presentationExchangeObject,
  resolvedClientMetadata1,
  sdJwtProcessedCredentialObjRef10
} from '../../presentation/__tests__/fixtures';
import { DIFPresentationExchangeService } from '../DifPresentationExchangeService';
const UNIT_TEST_TIMEOUT = 30000;

import nock from 'nock';
const MOCK_URL = 'https://verifier.ssi.tir.budru.de';

describe('DIFPresentationExchangeService', () => {
  const httpUtil = new HttpUtil();
  const storage = DBConnection.getStorage();
  const processor = new SdJwtCredentialProcessor(storage);
  const pex = new DIFPresentationExchangeService(storage, httpUtil);

  beforeAll(async () => {
    nock.disableNetConnect();
    await processor.storeCredential(sdJwtProcessedCredentialObjRef10);
  });

  afterEach(async () => {
    nock.cleanAll();
  });

  afterAll(async () => {
    nock.cleanAll();
    await storage.clear(credentialStoreName);
  });

  it(
    'should successfully  process request object.',
    async () => {
      nock(MOCK_URL)
        .get('/presentation/definition')
        .query({
          id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
        })
        .reply(200, presentationDefinitionValue1)
        .get('/presentation/client-metadata.json')
        .reply(200, resolvedClientMetadata1)
        .get('/presentation/jwks.json')
        .reply(200, clientMetadataValueJwks1);

      const presentationExchange = await pex.processRequestObject(
        encodedRequestObjectUri
      );
      expect(presentationExchange).toEqual(presentationExchangeObject);
    },
    UNIT_TEST_TIMEOUT
  );
});
