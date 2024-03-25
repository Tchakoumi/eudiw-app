import { StorageFactory } from '@datev/storage';
import {
  OID4VCIServiceDBSchema,
  credentialStoreName,
} from '../../database/schema';
import {
  PresentationDefinition,
  SdJwtProcessedCredential,
} from '../../lib/types';

import sdJwt from '@hopae/sd-jwt';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { JSONPath } from 'jsonpath-plus';

/**
 * This class is responsible for implementing the DIF Presentation Exchange
 * https://identity.foundation/presentation-exchange/spec/v2.0.0/
 * Handles the flow of demand and submission of proofs from a Holder to a Verifier.
 */
export class InputDescriptorEvaluator {
  public constructor(private storage: StorageFactory<OID4VCIServiceDBSchema>) {}

  async evaluate(presentationDefinition: PresentationDefinition) {
    const credentials = await this.storage.findAll(credentialStoreName);
    // Initialize AJV instance
    const ajv = new Ajv();
    addFormats(ajv);

    // Filter credentials
    const filteredCredentials: SdJwtProcessedCredential[] = [];

    for (const { value: credential } of credentials) {
      // Decode SD-JWT encoded credential using @hopae/sd-jwt
      const decodeSDJwtCredential = sdJwt.decode(credential.encoded as string);
      const claims: Record<string, unknown> =
        await decodeSDJwtCredential.getClaims();

      const sdJwtPayload: Record<string, unknown> = { ...claims };
      for (const disclosure of decodeSDJwtCredential.disclosures ?? []) {
        if (disclosure.key) {
          sdJwtPayload[disclosure.key] = disclosure.value;
        } else {
          // TODO! Handle array elements (?)
        }
      }
      console.log({ sdJwtPayload });

      for (const inputDescriptor of presentationDefinition.input_descriptors) {
        const fields = inputDescriptor.constraints.fields ?? [];
        for (const field of fields) {
          const { path, filter } = field;
          const matchValues = JSONPath({
            path: path.join('.'),
            json: sdJwtPayload,
          });
          console.log({ path, matchValues });
          if (matchValues.length > 0) {
            if (filter) {
              const validate = ajv.compile(filter);
              // Validate against constraints
              for (const value of matchValues) {
                const isValid = validate(value);
                if (isValid) {
                  filteredCredentials.push(credential as SdJwtProcessedCredential);
                }
              }
            } else filteredCredentials.push(credential as SdJwtProcessedCredential);
          }
        }
      }
    }

    return filteredCredentials;
  }
}
