import { DBConnection } from '../../database/DBConnection';
import { credentialStoreName } from '../../database/schema';
import { CredentialEventClient } from '../CredentialEventClient';
import { SdJwtCredentialProcessor } from '../SdJwtCredentialProcessor';

import {
  credentialContentObjRef2,
  credentialHeaderObjRef1,
  credentialHeaderObjRef2,
  sdJwtProcessedCredentialObjRef1,
  sdJwtProcessedCredentialObjRef3,
} from './fixtures';

describe('CredentialEventClient', () => {
  const storage = DBConnection.getStorage();
  const client = new CredentialEventClient(storage);
  const sdJwtCredentialProcessor = new SdJwtCredentialProcessor(storage);

  afterEach(async () => {
    storage.clear(credentialStoreName);
  });

  it('should retrieve successfully one credential headers', async () => {
    await sdJwtCredentialProcessor.storeCredential(
      sdJwtProcessedCredentialObjRef1
    );

    const credentialHeaders = await client.retrieveCredentialHeaders();

    expect(credentialHeaders).toEqual(credentialHeaderObjRef2);
    expect(credentialHeaders).toHaveLength(1);
    expect(credentialHeaders).not.toHaveProperty('claims');
  });

  it('should retrieve successfully two credential headers', async () => {
    await sdJwtCredentialProcessor.storeCredential(
      sdJwtProcessedCredentialObjRef1
    );

    await sdJwtCredentialProcessor.storeCredential(
      sdJwtProcessedCredentialObjRef3
    );

    const credentialHeaders = await client.retrieveCredentialHeaders();

    expect(credentialHeaders).toEqual(credentialHeaderObjRef1);
    expect(credentialHeaders).toHaveLength(2);
  });

  it('should retrieve successfully an empty credential header object', async () => {
    const credentialHeaders = await client.retrieveCredentialHeaders();

    expect(credentialHeaders).toEqual([]);
    expect(credentialHeaders).toHaveLength(0);
  });

  it('should retrieve successfully one credential content', async () => {
    const storedCredential = await sdJwtCredentialProcessor.storeCredential(
      sdJwtProcessedCredentialObjRef1
    );

    const credentialContent = await client.retrieveCredentialDetails(
      storedCredential.display.id as number
    );

    // Dynamically adjust the expected payload with the correct id
    const expectedPayload = {
      ...credentialContentObjRef2, // Assuming credentialContentObjRef3 is an array with the expected object
      id: storedCredential.display.id, // Set the dynamic id correctly
    };

    expect(credentialContent).toEqual(expectedPayload);
  });

  it('should insert one credential and delete it.', async () => {
    // Insert a credential and validate it is there.
    const storedCredential = await sdJwtCredentialProcessor.storeCredential(
      sdJwtProcessedCredentialObjRef1
    );

    const storedCredentialId = storedCredential.display.id as number;

    const credentialContent = await client.retrieveCredentialDetails(
      storedCredentialId
    );

    expect(credentialContent).toEqual(credentialContentObjRef2);

    // Attempt to delete the credential and validate it is gone.
    let deleteError;
    try {
      await client.deleteCredentialByKey(storedCredentialId);
    } catch (error) {
      deleteError = error;
    }

    // Ensure no error was thrown during deletion
    expect(deleteError).toBeUndefined();

    // Check that credential was deleted

    const credentialContentGone = await client.retrieveCredentialDetails(
      storedCredentialId
    );

    expect(credentialContentGone).toEqual(null);
  });

  it('should insert two credential and delete them.', async () => {
    // Insert a credential and validate it is there.
    const storedCredential1 = await sdJwtCredentialProcessor.storeCredential(
      sdJwtProcessedCredentialObjRef1
    );

    const storedCredentialId1 = storedCredential1.display.id as number;

    const storedCredential2 = await sdJwtCredentialProcessor.storeCredential(
      sdJwtProcessedCredentialObjRef3
    );

    const storedCredentialId2 = storedCredential2.display.id as number;

    // Attempt to delete the credential and validate it is gone.
    let deleteError;
    try {
      await client.deleteCredentialByKey(storedCredentialId1);
      await client.deleteCredentialByKey(storedCredentialId2);
    } catch (error) {
      deleteError = error;
    }

    // Ensure no error was thrown during deletion
    expect(deleteError).toBeUndefined();

    // Check that credential was deleted

    const credentialContentGone1 = await client.retrieveCredentialDetails(
      storedCredentialId1
    );
    const credentialContentGone2 = await client.retrieveCredentialDetails(
      storedCredentialId2
    );
    expect(credentialContentGone1).toEqual(null);
    expect(credentialContentGone2).toEqual(null);

    // Check if db is empty
    const credentialHeaders = await client.retrieveCredentialHeaders();

    expect(credentialHeaders).toEqual([]);
    expect(credentialHeaders).toHaveLength(0);
  });
});
