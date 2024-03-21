import * as jose from 'jose';

export const TEST_JWK_KID = '2483b80b-d9fc-46f0-8e10-358401c274fe';
export async function signRequestPayload<T extends jose.JWTPayload>(
  payload: T
) {
  const keypair = await jose.generateKeyPair('RS256');
  const jwt = new jose.SignJWT(payload);
  const publicKey = await jose.exportJWK(keypair.publicKey);
  jwt.setProtectedHeader({
    ...publicKey,
    alg: 'RS256',
    kid: TEST_JWK_KID,
  });
  const signedJwt = await jwt.sign(keypair.privateKey);
  return { signedJwt, publicKey };
}
