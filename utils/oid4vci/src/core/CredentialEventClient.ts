import { StorageFactory } from '@datev/storage';
import { OID4VCIServiceDBSchema, credentialStoreName } from '../../src/schema';
import { DisplayCredential, Record } from '../lib/types';

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
   * Retreives a processed SD-JWT credential.
   * @param
   * @returns the stored credential with a populated identifier
   */
  public async retrieveCredentialHeaders(): Promise<DisplayCredential> {
    const records = await this.storage.findAll(credentialStoreName);

    const modifiedRecords = records.map((record: Record) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { claims, ...rest } = record.value.display as DisplayCredential;
      return rest;
    });

    return modifiedRecords as DisplayCredential;
  }
}
