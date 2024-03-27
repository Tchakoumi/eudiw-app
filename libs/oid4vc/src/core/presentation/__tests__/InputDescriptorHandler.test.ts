import { SdJwtProcessedCredential } from '../../../lib/types';
import { DBConnection } from '../../../database/DBConnection';
import { credentialStoreName } from '../../../database/schema';
import { SdJwtCredentialProcessor } from '../../issuance/SdJwtCredentialProcessor';
import { sdJwtProcessedCredentialObjRef3 } from '../../issuance/__tests__/fixtures';
import { InputDescriptorHandler } from '../InputDescriptorHandler';
import {
  pdFilteredCredentials,
  presentationDef1,
  presentationDef2,
  presentationDef3,
  presentationDefWithOptionalField1,
} from './fixtures';

describe('InputDescriptionHandler', () => {
  const storage = DBConnection.getStorage();
  const processor = new SdJwtCredentialProcessor(storage);
  const inputDescriptionEvaluator = new InputDescriptorHandler();

  const credentials: SdJwtProcessedCredential[] = [];

  beforeAll(async () => {
    const credential = await processor.storeCredential(
      sdJwtProcessedCredentialObjRef3
    );
    credentials.push(credential);
  });

  afterAll(() => {
    storage.clear(credentialStoreName);
  });

  it('should successfully retrieve matching credetial for presentation definition', async () => {
    let filteredCredentials = await inputDescriptionEvaluator.handle(
      presentationDef1.input_descriptors,
      credentials
    );

    expect(filteredCredentials).toStrictEqual(pdFilteredCredentials);

    filteredCredentials = await inputDescriptionEvaluator.handle(
      presentationDef2.input_descriptors,
      credentials
    );

    expect(filteredCredentials).toStrictEqual([]);
  });

  it('should not successfully retrieve matching credential with optional field', async () => {
    const filteredCredentials = await inputDescriptionEvaluator.handle(
      presentationDefWithOptionalField1.input_descriptors,
      credentials
    );

    expect(filteredCredentials).toStrictEqual(
      pdFilteredCredentials.map((credentiial) => ({
        ...credentiial,
        disclosures: {
          ...credentiial.disclosures,
          birthdate: '1991-11-06',
          vct: undefined,
        },
      }))
    );
  });

  it('should not retrieve matching credential without fields property', async () => {
    await expect(
      inputDescriptionEvaluator.handle(
        presentationDef3.input_descriptors,
        credentials
      )
    ).rejects.toThrow();
  });
});
