import { IdentityProofGenerator } from '../IdentityProofGenerator';

describe('IdentityProofGenerator', () => {
  const identityProofGenerator = new IdentityProofGenerator();

  jest
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .spyOn(identityProofGenerator as any, 'getJwkIdentity')
    .mockImplementation(() => ({
      kty: 'EC',
      d: 'lPHtS-GHGLHoUUaRlJoIm920f0smWf1xN6fLgz7y3eA',
      use: 'sig',
      crv: 'P-256',
      kid: 'umcsmPiYZT-IkOJddkEktykzYNNsXdiNj7LTSfStz7w',
      x: '6FHJYsI0by91XSllDSHMNS20Rlw6LrPNmPAR7jadeFs',
      y: 'gJiHCDP1jbAK_s5iItC7RtKV8Hx5RlLDoP_mEaWfe9w',
      alg: 'ES256',
    }));

  it('should generate a valid JWS key proof', async () => {
    const jws = await identityProofGenerator.generateKeyProof(
      'https://trial.authlete.net',
      '8ef0d890-c1e2-4339-a245-9b53f6c16632'
    );

    console.log(jws)
  });
});
