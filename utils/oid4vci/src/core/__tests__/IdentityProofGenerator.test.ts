import * as jose from 'jose';

import { CLIENT_ID } from '../../config';
import { currentTimestampInSecs } from '../../utils';
import { IdentityProofGenerator } from '../IdentityProofGenerator';
import { keyRef1 } from './fixtures';

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

    const keys = [keyRef1, { ...keyRef1, alg: undefined }];

    for (const key of keys) {
      const { proof_type: proofType, jwt: jws } =
        await identityProofGenerator.generateJwtKeyProof(key, aud, nonce);

      expect(proofType).toEqual('jwt');

      const { header, payload } = decodeJws(jws);
      expect(header.alg).toEqual('ES256');

      // Assert private fields are not disclosed
      const jwk = header.jwk as jose.JWK;
      const keys = Object.keys(jwk).filter((key) => jwk[key] !== undefined);
      expect(keys.every((e) => ['kty', 'crv', 'x', 'y'].includes(e))).toBe(
        true
      );

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
    }
  });
});
