import * as jose from 'jose';
import sdjwt from '@hopae/sd-jwt';
import { OID4VCIServiceError } from '../lib/errors';
import { DisplayCredential, SdJwtProcessedCredential } from '../lib/types';

export class SdJwtCredentialProcessor {
  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Validates, decodes, and stores credential.
   * @param credential the credential to process
   * @param verifyingKeys the issuer keys to validate the credential
   * @param displayCredentialStarter a starter for displayable fields
   * @returns the credential under its processed format
   */
  public async processCredential(
    credential: string,
    verifyingKeys: jose.JWK[],
    displayCredentialStarter?: DisplayCredential
  ): Promise<SdJwtProcessedCredential> {
    await this.validateCredential(credential, verifyingKeys);

    const decoded = await this.decodeCredential(
      credential,
      displayCredentialStarter
    );

    return decoded;
  }

  /**
   * Validates SD-JWT credential.
   */
  private async validateCredential(
    credential: string,
    verifyingKeys: jose.JWK[]
  ): Promise<jose.JWK> {
    const { kid } = jose.decodeProtectedHeader(credential);

    if (kid) {
      const verifyingKey = verifyingKeys.find((key) => key.kid == kid);
      if (!verifyingKey) {
        throw new OID4VCIServiceError('Could find referenced verifying key.');
      }

      verifyingKeys = [verifyingKey];
    }

    for (const verifyingKey of verifyingKeys) {
      try {
        sdjwt.validate(credential, {
          publicKey: await jose.importJWK(verifyingKey),
        });

        return verifyingKey;
      } catch (e) {
        continue;
      }
    }

    throw new OID4VCIServiceError('Could not verify credential.');
  }

  /**
   * Decodes SD-JWT credential.
   */
  private async decodeCredential(
    credential: string,
    displayCredentialStarter?: DisplayCredential
  ): Promise<SdJwtProcessedCredential> {
    const decoded = sdjwt.decode(credential);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const claims: Record<string, any> = await decoded.getClaims();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const disclosed: Record<string, any> = {};
    for (const disclosure of decoded.disclosures ?? []) {
      if (disclosure.key) {
        disclosed[disclosure.key] = disclosure.value;
      } else {
        // TODO! Handle array elements (?)
      }
    }

    return {
      encoded: credential,
      display: {
        ...displayCredentialStarter,
        iat: claims['iat'],
        ...disclosed,
      },
    };
  }
}
