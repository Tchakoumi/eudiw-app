import { StorageFactory } from '@datev/storage';
import { ResolvedRequestObject } from '../../lib/types';
import {
  OID4VCIServiceDBSchema,
  credentialStoreName,
} from '../../database/schema';

/**
 * This class is responsible for implementing the DIF Presentation Exchange
 * https://identity.foundation/presentation-exchange/spec/v2.0.0/
 * Handles the flow of demand and submission of proofs from a Holder to a Verifier.
 */
export class DIFPresentationExchangeService {
  /**
   * Constructor.
   * @param storage a storage to request persisted credentials
   */
  public constructor(private storage: StorageFactory<OID4VCIServiceDBSchema>) {}

  public async processRequestObject(
    resolvedRequestObject: ResolvedRequestObject
  ): Promise<void> {
    console.log(JSON.stringify(resolvedRequestObject));

    const records = await this.storage.findAll(credentialStoreName);

    console.log(records);
  }
}
