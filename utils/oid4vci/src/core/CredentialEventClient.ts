import { StorageFactory, StoreRecord } from '@datev/storage';
import { OID4VCIServiceDBSchema, credentialStoreName } from '../database/schema';
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
}
