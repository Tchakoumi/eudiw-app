import { StorageFactory, StoreRecord } from '@datev/storage';
import {
  OID4VCIServiceDBSchema,
  credentialStoreName,
} from '../database/schema';
import { DisplayCredential } from '../lib/types';

/**
 * This class is responsible for retrieving credentials for the landing page
 */
export class CredentialEventClient {
  /**
   * Constructor.
   * @param storage a storage to retrieve requested issued credentials
   */
  public constructor(private storage: StorageFactory<OID4VCIServiceDBSchema>) {}

  /**
   * Retrieves the content of credentials needed to populate the UI card.
   * @returns A Promise that resolves with an array of stored credentials without the claims details.
   */
  public async retrieveCredentialHeaders(): Promise<
    Array<Omit<DisplayCredential, 'claims'>>
  > {
    const records = await this.storage.findAll(credentialStoreName);

    const modifiedRecords = records.map(
      (record: StoreRecord<OID4VCIServiceDBSchema>) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { claims, ...rest } = record.value.display as DisplayCredential;
        return rest;
      }
    );

    return modifiedRecords;
  }

  /**
   * Retrieves the content of a single credential needed to populate the details view.
   * @param id The unique identifier of the credential to retrieve.
   * @returns A Promise that resolves with the details of the specified credential, or null if not found.
   */
  public async retrieveCredentialDetails(
    key: IDBValidKey
  ): Promise<DisplayCredential | null> {
    const record: StoreRecord<OID4VCIServiceDBSchema> | null =
      await this.storage.findOne(credentialStoreName, key);

    if (!record) {
      return null;
    }

    // Return the `DisplayCredential` format including all properties.
    return record.value.display;
  }

  /**
   * Deletes a credential by key.
   * @param key The key of the credential to delete.
   * @returns A Promise that resolves when the deletion is complete.
   */
  public async deleteCredentialByKey(key: IDBValidKey): Promise<void> {
    try {
      await this.storage.delete(credentialStoreName, key);
    } catch (error) {
      throw new Error(`Failed to delete credential: ${error}`);
    }
  }
}
