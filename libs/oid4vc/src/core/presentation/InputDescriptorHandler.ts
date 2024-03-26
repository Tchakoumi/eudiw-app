import { StorageFactory } from '@datev/storage';
import {
  OID4VCIServiceDBSchema,
  credentialStoreName,
} from '../../database/schema';
import {
  DisplayCredential,
  PresentationDefinition,
  SdJwtMatchingCredential,
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
export class InputDescriptorHandler {
  public constructor(private storage: StorageFactory<OID4VCIServiceDBSchema>) {}

  async handle(presentationDefinition: PresentationDefinition) {
    const credentials = await this.storage.findAll(credentialStoreName);
    // Initialize AJV instance
    const ajv = new Ajv();
    addFormats(ajv);

    // Filter credentials
    const filteredCredentials: SdJwtMatchingCredential[] = [];

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

      for (const inputDescriptor of presentationDefinition.input_descriptors) {
        let selectedClaims = {};
        const fields = inputDescriptor.constraints.fields ?? [];

        for (const field of fields) {
          const { path: paths, filter } = field;
          const matchingValues = paths.reduce<Array<unknown>>(
            (values, path) => [
              ...values,
              ...JSONPath({
                path: path,
                json: sdJwtPayload,
              }),
            ],
            []
          );
          if (matchingValues.length) {
            let validatedValue = matchingValues[0];
            if (filter) {
              const validate = ajv.compile(filter);
              for (const value of matchingValues) {
                // Validate against constraints
                const isValid = validate(value);
                if (isValid) validatedValue = value;
              }
              // Stop validation if the field is required but no matching
              // value could be validated
              if (!field.optional && !validatedValue) {
                break;
              }
            }

            const [claim, claimValue] = Object.entries(sdJwtPayload).find(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ([_, value]) => validatedValue === value
            ) as [string, unknown];
            selectedClaims = { ...selectedClaims, [claim]: claimValue };
          }
        }

        if (Object.keys(selectedClaims).length === fields.length)
          filteredCredentials.push({
            credential: credential.display as DisplayCredential,
            disclosures: selectedClaims,
          });
      }
    }

    return filteredCredentials;
  }
}
