import * as jose from 'jose';
import { OID4VCIServiceError } from '../errors';
import { CLIENT_ID } from '../config';

export class IdentityProofGenerator {
  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Computes key proof of wallet's identity.
   */
  public async generateKeyProof(aud: string, nonce?: string) {
    const jwk = this.getJwkIdentity();
    if (!jwk.alg) {
      throw new OID4VCIServiceError(
        'The wallet identity must embed an algorithm for signature.'
      );
    }

    const priv = await jose.importJWK(jwk);

    const jws = await new jose.SignJWT({ nonce })
      .setProtectedHeader({
        alg: jwk.alg,
        jwk: this.toPublicJwk(jwk),
      })
      .setIssuedAt(Date.now())
      .setIssuer(CLIENT_ID)
      .setAudience(aud)
      .sign(priv);

    return jws;
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

  private toPublicJwk(jwk: jose.JWK): jose.JWK {
    const { kty, crv, x, y, e, n } = jwk;
    return { kty, crv, x, y, e, n };
  }
}
