import { DBConnection } from 'libs/oid4vc/src/database/DBConnection';
import { DIFPresentationExchangeService } from '../DifPresentationExchangeService';
import { resolvedRequestObject } from './fixtures/RequestObjectResolver.fixtures';
const UNIT_TEST_TIMEOUT = 30000;

describe('DIFPresentationExchangeService', () => {
  const storage = DBConnection.getStorage();
  beforeAll(async () => {});

  beforeEach(async () => {});

  afterAll(async () => {});

  it(
    'should successfully acquire an access token using a pre-authorized code',
    async () => {
      const difPresentationExchangeService: DIFPresentationExchangeService =
        new DIFPresentationExchangeService(storage);

      await difPresentationExchangeService.processRequestObject(
        resolvedRequestObject
      );
    },
    UNIT_TEST_TIMEOUT
  );
});
