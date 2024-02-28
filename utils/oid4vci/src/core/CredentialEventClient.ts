import { StorageFactory, StoreRecord } from '@datev/storage';
import { CredentialDBSchema, credentialStoreName } from '../lib/schemas';
import { SdJwtProcessedCredential } from '../lib/types';

/**
 * This class is responsible for retrieving credentials for the landing page
 */
export class CredentialEventClient {
  /**
   * Constructor.
   * @param storage a storage to retrieve requested issued credentials
   */
  public constructor(private storage: StorageFactory<CredentialDBSchema>) {}

  /**
   * Retreives a processed SD-JWT credential.
   * @param
   * @returns the stored credential with a populated identifier
   */
  public async retrieveCredentialHeaders(
    credential: SdJwtProcessedCredential,
  ): Promise<SdJwtProcessedCredential> {
    const records = await this.storage.findAll(credentialStoreName);

    console.log('records', records);
    return credential;
  }
}
