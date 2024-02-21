import * as jose from 'jose';

import { OID4VCIServiceError } from '../lib/errors';
import { CLIENT_ID } from '../config';
import { OID4VCI_PROOF_TYP } from '../constants';
import { currentTimestampInSecs } from '../utils';
import { CredentialSupported, KeyProof } from '../lib/types';

export class IdentityProofGenerator {
  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Computes key proof of wallet's identity.
   */
  public async generateCompatibleKeyProof(
    credentialSupported: CredentialSupported,
    credentialIssuer: string,
    nonce?: string
  ): Promise<KeyProof> {
    const bindingMethods =
      credentialSupported.cryptographic_binding_methods_supported ?? [];

    if (!bindingMethods.includes('jwt' satisfies KeyProof['proof_type'])) {
      throw new OID4VCIServiceError(
        'The issuer does not support JWT key proofs.'
      );
    }

    const jwk = this.getJwkIdentity();

    if (!jwk.alg) {
      throw new OID4VCIServiceError(
        'The wallet identity must embed an algorithm for signature.'
      );
    }

    const algs =
      credentialSupported.cryptographic_suites_supported ??
      credentialSupported.credential_signing_alg_values_supported ??
      [];

    if (!algs.includes(jwk.alg)) {
      throw new OID4VCIServiceError(
        'The wallet identity does not match any algorithm supported by the issuer.'
      );
    }

    return await this.generateJwtKeyProof(jwk, credentialIssuer, nonce);
  }

  /**
   * Computes JWT key proof of wallet's identity.
   */
  public async generateJwtKeyProof(
    key: jose.JWK,
    aud: string,
    nonce?: string
  ): Promise<KeyProof> {
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
   * Reads current wallet's identity from store.
   */
  private getJwkIdentity(): jose.JWK {
    return {
      kty: 'EC',
      d: 'lPHtS-GHGLHoUUaRlJoIm920f0smWf1xN6fLgz7y3eA',
      use: 'sig',
      crv: 'P-256',
      kid: 'umcsmPiYZT-IkOJddkEktykzYNNsXdiNj7LTSfStz7w',
      x: '6FHJYsI0by91XSllDSHMNS20Rlw6LrPNmPAR7jadeFs',
      y: 'gJiHCDP1jbAK_s5iItC7RtKV8Hx5RlLDoP_mEaWfe9w',
      alg: 'ES256',
    };
  }

  /**
   * Remove sensitive secret fields.
   */
  private toPublicJwk(jwk: jose.JWK): jose.JWK {
    const { kty, crv, x, y, e, n } = jwk;
    return { kty, crv, x, y, e, n };
  }
}
