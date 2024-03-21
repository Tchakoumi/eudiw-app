import * as jose from 'jose';

export const TEST_JWK_KID = '2483b80b-d9fc-46f0-8e10-358401c274fe';

export const X5C_CERTIFICATE =
  'MIICLzCCAdWgAwIBAgIBBDAKBggqhkjOPQQDAjBjMQswCQYDVQQGEwJERTEPMA0GA1UEBwwGQmVybGluMR0wGwYDVQQKDBRCdW5kZXNkcnVja2VyZWkgR21iSDEKMAgGA1UECwwBSTEYMBYGA1UEAwwPSUR1bmlvbiBUZXN0IENBMB4XDTIzMDgwMzA4NDI0NFoXDTI4MDgwMTA4NDI0NFowVTELMAkGA1UEBhMCREUxHTAbBgNVBAoMFEJ1bmRlc2RydWNrZXJlaSBHbWJIMQowCAYDVQQLDAFJMRswGQYDVQQDDBJPcGVuSWQ0VlAgVmVyaWZpZXIwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAARshS5CiPkK5WECuDzrnctIppbmgsYd9DsOYDpIExZEs1fQcNyvkB5EeNWsc0SA1QNqwwGW4guFKg0If1JGDxUfo4GHMIGEMB0GA1UdDgQWBBRfLAPsxmLsp1nQ/FMvFI37C3BlYDAMBgNVHRMBAf8EAjAAMA4GA1UdDwEB/wQEAwIHgDAkBgNVHREEHTAbghl2ZXJpZmllci5zc2kudGlyLmJ1ZHJ1LmRlMB8GA1UdIwQYMBaAFE+W6z7ajTumex+YcFboNrVeC2tRMAoGCCqGSM49BAMCA0gAMEUCICVeDT2sddxrHC+gFIMEfsxnsIWFgHvvefpnYvkoDclwAiEA2QgETGWxHYENmll406UCpbqQoY332OlOjt50Z76XpmA=';

export async function signRequestPayload<T extends jose.JWTPayload>(
  payload: T,
  header?: { alg: 'ES256'; x5c: string[] }
) {
  const alg = header?.alg ?? 'RS256';
  const keypair = await jose.generateKeyPair(alg);
  jose.GeneralEncrypt;
  const jwt = new jose.SignJWT(payload);
  const publicKey = await jose.exportJWK(keypair.publicKey);

  jwt.setProtectedHeader({ alg, kid: TEST_JWK_KID, ...publicKey, ...header });
  const signedJwt = await jwt.sign(keypair.privateKey);
  return { signedJwt };
}

export function pemToCertificate(pem: string) {
  const str = pem
    .slice(
      pem.indexOf('-----BEGIN PUBLIC KEY-----\n') + 1,
      pem.indexOf('-----END PUBLIC KEY-----\n')
    )
    .split('\n');
  str.shift();
  str.pop();
  return str;
}
