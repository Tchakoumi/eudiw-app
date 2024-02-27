import * as jose from 'jose';
import { IdentityDBSchema, identityStoreName } from '../lib/schemas';
import { StorageFactory } from '@datev/storage';

/**
 * This class maintains a JWK representing the wallet's identity.
 */
export interface IdentityManager {
  /**
   * Checks if an identity is available, if not generates one.
   * @returns a JWK cryptographic identity
   */
  initializeJwkIdentity(): Promise<jose.JWK>;

  /**
   * Reads current wallet's identity from store.
   * @returns a JWK cryptographic identity
   */
  getJwkIdentity(): Promise<jose.JWK | undefined>;

  /**
   * Generates and persist a new identity for the wallet.
   * @returns the generated JWK cryptographic identity
   */
  generateJwkIdentity(): Promise<jose.JWK>;
}

export class StoreIdentityManager implements IdentityManager {
  private readonly SINGLE_KEY: string = 'current';

  /**
   * Constructor.
   * @param storage a storage solution to keep cryptographic keys
   */
  public constructor(private storage: StorageFactory<IdentityDBSchema>) {}

  public async initializeJwkIdentity(): Promise<jose.JWK> {
    // Retrieve current identity
    let jwk = await this.getJwkIdentity();

    // Generate identity if necessary
    if (!jwk) {
      jwk = await this.generateJwkIdentity();
    }

    return jwk;
  }

  public async getJwkIdentity(): Promise<jose.JWK | undefined> {
    const record = await this.storage.findOne(
      identityStoreName,
      this.SINGLE_KEY as IDBValidKey
    );

    const jwk = record?.value;
    return jwk;
  }

  public async generateJwkIdentity(): Promise<jose.JWK> {
    const { privateKey } = await jose.generateKeyPair('ES256');
    const jwk = {
      alg: 'ES256',
      ...(await jose.exportJWK(privateKey)),
    };

    await this.storage.insert(identityStoreName, {
      key: this.SINGLE_KEY,
      value: jwk,
    });

    return jwk;
  }
}
