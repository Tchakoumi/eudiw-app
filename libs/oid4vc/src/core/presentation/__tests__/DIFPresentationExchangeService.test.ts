import { DBConnection } from '../../../database/DBConnection';
import { credentialStoreName } from '../../../database/schema';
import { SdJwtCredentialProcessor } from '../../issuance/SdJwtCredentialProcessor';
import {
  credentialContentMatch,
  credentialContentMatch2,
  resolvedRequestObject1,
  resolvedRequestObject2,
  sdJwtProcessedCredentialObjRef10,
  sdJwtProcessedCredentialObjRef20,
  sdJwtProcessedCredentialObjRef30,
} from '../../presentation/__tests__/fixtures/DIFPresentationExchangeService.fixtures';
import { DIFPresentationExchangeService } from '../DifPresentationExchangeService';
const UNIT_TEST_TIMEOUT = 30000;

describe('DIFPresentationExchangeService', () => {
  const storage = DBConnection.getStorage();
  const difPresentationExchangeService: DIFPresentationExchangeService =
    new DIFPresentationExchangeService(storage);
  const sdJwtCredentialProcessor = new SdJwtCredentialProcessor(storage);

  afterEach(async () => {
    await storage.clear(credentialStoreName);
  });

  it(
    'should successfully insert two credentials and retrieve one.',
    async () => {
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

  it(
    'should successfully insert two credentials and retrieve two.',
    async () => {
      const difPresentationExchangeService: DIFPresentationExchangeService =
        new DIFPresentationExchangeService(storage);
      const sdJwtCredentialProcessor = new SdJwtCredentialProcessor(storage);

      const storedCredential1 = await sdJwtCredentialProcessor.storeCredential(
        sdJwtProcessedCredentialObjRef30
      );

      const storedCredential2 = await sdJwtCredentialProcessor.storeCredential(
        sdJwtProcessedCredentialObjRef20
      );

      // Dynamically adjust the expected payload with the correct id
      const expectedPayload = [
        { ...credentialContentMatch2[0], id: storedCredential2.display.id },
        { ...credentialContentMatch2[1], id: storedCredential1.display.id },
      ];

      const credentialContentMatchResponse =
        await difPresentationExchangeService.processRequestObject(
          resolvedRequestObject1
        );

      expect(expectedPayload).toEqual(credentialContentMatchResponse);
    },
    UNIT_TEST_TIMEOUT
  );

  it(
    'should successfully insert two credentials and retrieve none.',
    async () => {
      const difPresentationExchangeService: DIFPresentationExchangeService =
        new DIFPresentationExchangeService(storage);
      const sdJwtCredentialProcessor = new SdJwtCredentialProcessor(storage);

      await sdJwtCredentialProcessor.storeCredential(
        sdJwtProcessedCredentialObjRef10
      );

      await sdJwtCredentialProcessor.storeCredential(
        sdJwtProcessedCredentialObjRef20
      );

      const credentialContentMatchResponse =
        await difPresentationExchangeService.processRequestObject(
          resolvedRequestObject2
        );

      expect([]).toEqual(credentialContentMatchResponse);
    },
    UNIT_TEST_TIMEOUT
  );
});
