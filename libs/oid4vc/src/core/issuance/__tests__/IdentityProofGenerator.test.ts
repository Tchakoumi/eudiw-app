import * as jose from 'jose';

import { DBConnection } from '../../../database/DBConnection';
import { identityStoreName } from '../../../database/schema';
import { CredentialSupported } from '../../../lib/types/issuance';
import { currentTimestampInSecs } from '../../../utils';
import { StoreIdentityManager } from '../IdentityManager';
import { IdentityProofGenerator } from '../IdentityProofGenerator';

import { configClient } from '../../__tests__/fixtures';
import {
  credentialIssuerMetadataRef1,
  credentialSupportedRef1,
  keyRef1,
} from './fixtures';

describe('IdentityProofGenerator', () => {
  const storage = DBConnection.getStorage();
  const identityProofGenerator = new IdentityProofGenerator(
    configClient,
    new StoreIdentityManager(storage)
  );

  beforeAll(async () => {
    const jwkRef = {
      kty: 'EC',
      d: 'lPHtS-GHGLHoUUaRlJoIm920f0smWf1xN6fLgz7y3eA',
      crv: 'P-256',
      x: '6FHJYsI0by91XSllDSHMNS20Rlw6LrPNmPAR7jadeFs',
      y: 'gJiHCDP1jbAK_s5iItC7RtKV8Hx5RlLDoP_mEaWfe9w',
      alg: 'ES256',
    };

    await storage.insert(identityStoreName, {
      key: 'current',
      value: jwkRef,
    });
  });

  const decodeJws = (jws: string) => ({
    header: jose.decodeProtectedHeader(jws),
    payload: jose.decodeJwt(jws),
  });

  it('should generate a valid JWS key proof', async () => {
    const key = keyRef1;
    const now = currentTimestampInSecs();
    const aud = 'https://trial.authlete.net';
    const nonce = '8ef0d890-c1e2-4339-a245-9b53f6c16632';

    const { proof_type: proofType, jwt: jws } =
      await identityProofGenerator.generateJwtKeyProof(key, aud, nonce);

    expect(proofType).toEqual('jwt');

    const { header, payload } = decodeJws(jws);
    expect(header.alg).toEqual(key.alg);

    // Assert private fields are not disclosed
    const jwk = header.jwk as jose.JWK;
    const keys = Object.keys(jwk).filter((key) => jwk[key] !== undefined);
    expect(keys.every((e) => ['kty', 'crv', 'x', 'y'].includes(e))).toBe(true);

    // Assert that the proof is valid
    const pubKey = await jose.importJWK(jwk);
    expect(
      jose.jwtVerify(jws, pubKey, {
        issuer: configClient.getClientId(aud) ?? '',
        audience: aud,
      })
    ).resolves.not.toThrow();

    // Assert other claims
    expect(payload['nonce']).toEqual(nonce);
    expect(payload['iat']).toBeGreaterThanOrEqual(now);
  });

  it('should throw on signing algorithm unspecified', async () => {
    const key = { ...keyRef1, alg: undefined };
    const aud = 'https://trial.authlete.net';

    const promise = identityProofGenerator.generateJwtKeyProof(key, aud);
    await expect(promise).rejects.toThrow(
      'The key must specify an algorithm for signature.'
    );
  });

  it('should throw when a non-JWT key proof is required', async () => {
    const credentialSupported: CredentialSupported = {
      ...credentialSupportedRef1,
      proof_types: ['x5c'],
    };

    const promise = identityProofGenerator.generateCompatibleKeyProof(
      credentialSupported,
      credentialIssuerMetadataRef1.credential_issuer
    );

    await expect(promise).rejects.toThrow(
      'The issuer does not support JWT key proofs.'
    );
  });

  it('should throw when no issuer signing algorithm is supported', async () => {
    const credentialSupported: CredentialSupported = {
      ...credentialSupportedRef1,
      credential_signing_alg_values_supported: [],
    };

    const promise = identityProofGenerator.generateCompatibleKeyProof(
      credentialSupported,
      credentialIssuerMetadataRef1.credential_issuer
    );

    await expect(promise).rejects.toThrow(
      'The wallet identity does not match any algorithm supported by the issuer.'
    );
  });
});
