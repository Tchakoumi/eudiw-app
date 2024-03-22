import { DBConnection } from 'libs/oid4vc/src/database/DBConnection';
import { DIFPresentationExchangeService } from '../DifPresentationExchangeService';
import { SdJwtCredentialProcessor } from '../../issuance/SdJwtCredentialProcessor';
import {
  credentialContentMatch,
  resolvedRequestObject1,
  sdJwtProcessedCredentialObjRef10,
  sdJwtProcessedCredentialObjRef20,
} from '../../presentation/__tests__/fixtures/DIFPresentationExchangeService.fixtures';
const UNIT_TEST_TIMEOUT = 30000;

describe('DIFPresentationExchangeService', () => {
  const storage = DBConnection.getStorage();
  beforeAll(async () => {});

  beforeEach(async () => {});

  afterAll(async () => {});

  it.only(
    'should successfully insert two credentials and retrieve one.',
    async () => {
      const difPresentationExchangeService: DIFPresentationExchangeService =
        new DIFPresentationExchangeService(storage);
      const sdJwtCredentialProcessor = new SdJwtCredentialProcessor(storage);

      await sdJwtCredentialProcessor.storeCredential(
        sdJwtProcessedCredentialObjRef10
      );

      const storedCredential = await sdJwtCredentialProcessor.storeCredential(
        sdJwtProcessedCredentialObjRef20
      );

      // Dynamically adjust the expected payload with the correct id
      const expectedPayload = {
        ...credentialContentMatch,
        id: storedCredential.display.id,
      };

      const credentialContentMatchResponse =
        await difPresentationExchangeService.processRequestObject(
          resolvedRequestObject1
        );

      expect(expectedPayload).toEqual(credentialContentMatchResponse[0]);
    },
    UNIT_TEST_TIMEOUT
  );
});
