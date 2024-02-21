import * as jose from 'jose';

import { CLIENT_ID } from '../../config';
import { currentTimestampInSecs } from '../../utils';
import { IdentityProofGenerator } from '../IdentityProofGenerator';

describe('IdentityProofGenerator', () => {
  const identityProofGenerator = new IdentityProofGenerator();

  const decodeJws = (jws: string) => ({
    header: jose.decodeProtectedHeader(jws),
    payload: jose.decodeJwt(jws),
  });

  it('should generate a valid JWS key proof', async () => {
    const now = currentTimestampInSecs();
    const aud = 'https://trial.authlete.net';
    const nonce = '8ef0d890-c1e2-4339-a245-9b53f6c16632';

    const jws = await identityProofGenerator.generateKeyProof(aud, nonce);
    const { header, payload } = decodeJws(jws);
    const jwk = header.jwk as jose.JWK;

    // Assert private fields are not disclosed
    const keys = Object.keys(jwk).filter((key) => jwk[key] !== undefined);
    expect(keys.every((e) => ['kty', 'crv', 'x', 'y'].includes(e))).toBe(true);

    // Assert that the proof is valid
    const pubKey = await jose.importJWK(jwk);
    expect(
      jose.jwtVerify(jws, pubKey, {
        issuer: CLIENT_ID,
        audience: aud,
      })
    ).resolves.not.toThrow();

    // Assert other claims
    expect(payload['nonce']).toEqual(nonce);
    expect(payload['iat']).toBeGreaterThanOrEqual(now);
  });
});
