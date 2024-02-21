import * as jose from 'jose';
import sdjwt from '@hopae/sd-jwt';
import { OID4VCIServiceError } from '../lib/errors';
import { SdJwtProcessedCredential } from '../lib/types';

export class SdJwtCredentialProcessor {
  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Verifies, decodes, and stores credential.
   * @param credential the credential to process
   * @param verifyingKeys the issuer keys to verify the credential
   * @returns the credential under its processed format
   */
  public async processCredential(
    credential: string,
    verifyingKeys: jose.JWK[]
  ): Promise<SdJwtProcessedCredential> {
    await this.verifyCredential(credential, verifyingKeys);
    const decoded = await this.decodeCredential(credential);
    return decoded;
  }

  /**
   * Verifies SD-JWT credential.
   */
  private async verifyCredential(
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
    credential: string
  ): Promise<SdJwtProcessedCredential> {
    return { encoded: credential };
  }
}
