import { StorageFactory, StoreRecord } from '@datev/storage';
import sdjwt from '@hopae/sd-jwt';
import * as jose from 'jose';

import { OID4VCIServiceError } from '../../lib/errors';

import {
  OID4VCIServiceDBSchema,
  credentialStoreName,
} from '../../database/schema';

import {
  CredentialSupportedSdJwtVc,
  DisplayCredential,
  SdJwtProcessedCredential,
} from '../../lib/types/issuance';

/**
 * This class is responsible for processing, ie validating, decoding, and
 * storing SD-JWT credentials. It handles all further actions to apply to
 * an issued SD-JWT encoded credential.
 */
export class SdJwtCredentialProcessor {
  /**
   * Constructor.
   * @param storage a storage to persist requested issued credentials
   */
  public constructor(private storage: StorageFactory<OID4VCIServiceDBSchema>) {}

  /**
   * Validates, decodes, and stores credential.
   * @param credential the credential to process
   * @param verifyingKeys the issuer keys to validate the credential
   * @param credentialSupported the credential configuration metadata associated
   * @param displayCredentialStarter a starter for displayable fields
   * @returns the credential under its processed format
   */
  public async processCredential(
    credential: string,
    verifyingKeys: jose.JWK[],
    credentialSupported: CredentialSupportedSdJwtVc,
    displayCredentialStarter?: DisplayCredential
  ): Promise<SdJwtProcessedCredential> {
    await this.validateCredential(credential, verifyingKeys);

    const decoded = await this.decodeCredential(
      credential,
      credentialSupported,
      displayCredentialStarter
    );

    const stored = await this.storeCredential(decoded);

    return stored;
  }

  /**
   * Validates SD-JWT credential.
   * @param credential the credential to validate
   * @param verifyingKeys the issuer keys to validate the credential
   * @returns the verifying key that successfully validated the credential
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
        await sdjwt.validate(credential, {
          publicKey: await jose.importJWK(verifyingKey),
        });

        return verifyingKey;
      } catch (e) {
        continue;
      }
    }

    throw new OID4VCIServiceError('Could not validate credential.');
  }

  /**
   * Decodes SD-JWT credential.
   * @param credential the credential to decode
   * @param credentialSupported the credential configuration metadata associated
   * @param displayCredentialStarter a starter for displayable fields
   * @returns a persistable representation of the credential
   */
  private async decodeCredential(
    credential: string,
    credentialSupported: CredentialSupportedSdJwtVc,
    displayCredentialStarter?: DisplayCredential
  ): Promise<SdJwtProcessedCredential> {
    // TODO: Handle nested claims
    const expectedClaims = Object.keys(credentialSupported.claims ?? {});

    const decoded = sdjwt.decode(credential);
    const claims: Record<string, unknown> = await decoded.getClaims();

    const disclosed: Record<string, unknown> = {};
    for (const disclosure of decoded.disclosures ?? []) {
      if (disclosure.key) {
        if (expectedClaims.includes(disclosure.key)) {
          disclosed[disclosure.key] = disclosure.value;
        }
      } else {
        // TODO! Handle array elements (?)
      }
    }

    return {
      encoded: credential,
      display: {
        ...displayCredentialStarter,
        issued_at: (claims['iat'] as number) * 1000,
        claims: disclosed,
      },
    };
  }

  /**
   * Stores a processed SD-JWT credential.
   * @param credential the processed credential to store
   * @returns the stored credential with a populated identifier
   */
  public async storeCredential(
    credential: SdJwtProcessedCredential
  ): Promise<SdJwtProcessedCredential> {
    const payload: StoreRecord<OID4VCIServiceDBSchema> = {
      value: credential,
    };

    // Persist the payload, expecting an autoincremented ID to be returned
    const key = await this.storage.insert(credentialStoreName, payload);
    credential.display.id = key as number;

    return credential;
  }
}
