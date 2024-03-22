import { StorageFactory } from '@datev/storage';
import {
  DisplayCredential,
  ResolvedRequestObject,
  SdJwtProcessedCredential,
} from '../../lib/types';
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
  public constructor(private storage: StorageFactory<OID4VCIServiceDBSchema>) {}

  public async processRequestObject(
    resolvedRequestObject: ResolvedRequestObject
  ): Promise<DisplayCredential[]> {
    const records = await this.storage.findAll(credentialStoreName);

    const { input_descriptors } = resolvedRequestObject.presentation_definition;

    let matchedCredentials: DisplayCredential[] = [];

    input_descriptors.forEach((descriptor) => {
      const matchesForInputDescriptor = records.flatMap((record) => {
        if ('display' in record.value) {
          const credential = record.value as SdJwtProcessedCredential;
          const credentialClaims = credential.display.claims;

          console.log(
            'match: ',
            credentialClaims?.['id'],
            'with: ',
            descriptor.id
          );
          console.log(
            'match: ',
            credentialClaims?.['name'],
            'with: ',
            descriptor.name
          );

          // Check that at least one of the compared values is not undefined before comparing
          const idMatch =
            credentialClaims?.['id'] !== undefined &&
            descriptor.id !== undefined &&
            credentialClaims['id'] === descriptor.id;
          const nameMatch =
            credentialClaims?.['name'] !== undefined &&
            descriptor.name !== undefined &&
            credentialClaims['name'] === descriptor.name;

          if (idMatch || nameMatch) {
            console.log('actual match: ', credential.display);
            return [credential.display];
          }
        }
        return [];
      });

      matchedCredentials.push(...matchesForInputDescriptor);
    });

    console.log('matchedCredentials', matchedCredentials);
    return matchedCredentials;
  }
}
