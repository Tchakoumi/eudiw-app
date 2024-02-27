import * as jose from 'jose';

import { OID4VCIServiceError } from '../lib/errors';
import { CLIENT_ID } from '../config';
import { OID4VCI_PROOF_TYP } from '../constants';
import { currentTimestampInSecs } from '../utils';
import { CredentialSupported, JwtKeyProof, KeyProof } from '../lib/types';
import { IdentityManager } from './IdentityManager';

/**
 * This class is responsible for generating suitable key proofs of the
 * wallet identity. This most often includes asserting a target-provided
 * nonce to protect against replay attacks.
 */
export class IdentityProofGenerator {
  /**
   * Constructor.
   * @param identityManager a source to retrieve the wallet identity from
   */
  public constructor(private identityManager: IdentityManager) {}

  /**
   * Computes key proof of wallet's identity.
   * @param credentialSupported the target credential type's configuration metadata
   * @param credentialIssuer the credential issuer's URI
   * @param nonce an issuer-provided information to be embedded in claims
   */
  public async generateCompatibleKeyProof(
    credentialSupported: CredentialSupported,
    credentialIssuer: string,
    nonce?: string
  ): Promise<KeyProof> {
    const proofTypes = credentialSupported.proof_types;
    if (proofTypes && !proofTypes.includes('jwt')) {
      throw new OID4VCIServiceError(
        'The issuer does not support JWT key proofs.'
      );
    }

    const jwk = await this.getJwkIdentity();
    if (!jwk.alg) {
      throw new OID4VCIServiceError(
        'The wallet identity must embed an algorithm for signature.'
      );
    }

    const algs =
      credentialSupported.cryptographic_suites_supported ??
      credentialSupported.credential_signing_alg_values_supported;
    if (algs && !algs.includes(jwk.alg)) {
      throw new OID4VCIServiceError(
        'The wallet identity does not match any algorithm supported by the issuer.'
      );
    }

    return await this.generateJwtKeyProof(jwk, credentialIssuer, nonce);
  }

  /**
   * Computes JWT key proof of wallet's identity.
   * @param key the key to prove control over
   * @param aud the intended recipient of the proof
   * @param nonce a string to defend against replay attacks
   * @returns a JWS key proof
   */
  public async generateJwtKeyProof(
    key: jose.JWK,
    aud: string,
    nonce?: string
  ): Promise<JwtKeyProof> {
    const priv = await jose.importJWK(key);

    const jws = await new jose.SignJWT({ nonce })
      .setProtectedHeader({
        alg: key.alg ?? 'ES256',
        typ: OID4VCI_PROOF_TYP,
        jwk: this.toPublicJwk(key),
      })
      .setIssuedAt(currentTimestampInSecs())
      .setIssuer(CLIENT_ID)
      .setAudience(aud)
      .sign(priv);

    return {
      proof_type: 'jwt',
      jwt: jws,
    };
  }

  /**
   * Reads current wallet's identity.
   * @returns a JWK cryptographic identity
   */
  private async getJwkIdentity(): Promise<jose.JWK> {
    return await this.identityManager.initializeJwkIdentity();
  }

  /**
   * Remove sensitive secret fields.
   * @param jwk a JWK to extract only public keys from
   * @returns a public JWK
   */
  private toPublicJwk(jwk: jose.JWK): jose.JWK {
    const { kty, crv, x, y, e, n } = jwk;
    return { kty, crv, x, y, e, n };
  }
}
