import {
  DisplayCredential,
  InputDescriptor,
  SdJwtMatchingCredential,
  SdJwtProcessedCredential,
} from '../../lib/types';

import sdJwt from '@hopae/sd-jwt';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { JSONPath } from 'jsonpath-plus';
import { OID4VCIServiceError } from '../../lib/errors';
import { PresentationError } from '../../lib/errors/Presentation.errors';

/**
 * Input descriptor validation class
 *
 * https://identity.foundation/presentation-exchange/spec/v2.0.0/#presentation-definition
 */
export class InputDescriptorHandler {
  public constructor() {}

  async handle(
    inputDescriptors: InputDescriptor[],
    credentials: SdJwtProcessedCredential[]
  ) {
    // Initialize AJV instance
    const ajv = new Ajv();
    addFormats(ajv);

    // Filter credentials
    const filteredCredentials: SdJwtMatchingCredential[] = [];

    for (const credential of credentials) {
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

      for (const inputDescriptor of inputDescriptors) {
        let selectedClaims = {};
        if (!inputDescriptor.constraints.fields?.length) {
          throw new OID4VCIServiceError(
            PresentationError.MissingConstraintField
          );
        }

        const fields = inputDescriptor.constraints.fields;
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
            let validatedValue: unknown;
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
            } else validatedValue = matchingValues[0];

            const claim = paths[0].split('.').pop();
            if (claim) {
              selectedClaims = { ...selectedClaims, [claim]: validatedValue };
            }
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
