import { StorageFactory } from '@datev/storage';

import {
  AccessTokenResponse,
  CredentialResponse,
  JWKSet,
} from '../../../lib/types';

import {
  CredentialDBSchema,
  IdentityDBSchema,
  credentialStoreName,
  identityStoreName,
} from '../../../lib/schemas';

// Mocking indexdedDB functionality
import 'core-js/stable/structured-clone';
import 'fake-indexeddb/auto';

export const storage: StorageFactory<CredentialDBSchema & IdentityDBSchema> =
  new StorageFactory<CredentialDBSchema & IdentityDBSchema>('testDB', 1, {
    upgrade(db) {
      db.createObjectStore(credentialStoreName, {
        keyPath: 'display.id',
        autoIncrement: true,
      });

      db.createObjectStore(identityStoreName);
    },
  });

export const credentialStorage =
  storage as unknown as StorageFactory<CredentialDBSchema>;

export const identityStorage =
  storage as unknown as StorageFactory<IdentityDBSchema>;

export const tokenResponseRef1: AccessTokenResponse = {
  access_token: 'ZoR1S8Its2dfbhdCMf5uGkUbB0TBWpctOUv-chU1-6M',
  token_type: 'Bearer',
  expires_in: 86400,
  refresh_token: 'DBOY_G9H9qcshxorjptrr442MUePjzyjkL4352qEeM8',
  c_nonce: 'Wy8WzWM87HmVTDuD7-3c_V6AlVYFfxY2imjwbP5CNAs',
  c_nonce_expires_in: 86400,
  authorization_details: [],
};

export const credentialResponseRef1: CredentialResponse = {
  credential:
    'eyJraWQiOiJKMUZ3SlA4N0M2LVFOX1dTSU9tSkFRYzZuNUNRX2JaZGFGSjVHRG5XMVJrIiwidHlwIjoidmMrc2Qtand0IiwiYWxnIjoiRVMyNTYifQ.eyJfc2QiOlsiMWM5ZUpBTzNEVm1NOTBMOU9xWjRoaWVudHFGaVQ0U1ZueUV2SzIxTzdRQSIsIjY5N3ZyRnRSNUFkWWMwTlg4cFBwNUN2WkN3V196d3VPTGxBV1dDM2c0c00iLCI2dENSazJjWUdqSDlLRmlidmlCYnNrUzdUem5qcW5Lb0Vab1MycFMtWENVIiwiRGFadVhKM3FtR2p1OFlvdkkyNFZGUnBhUzMyREFMV1RQd2RzVXQwcUtvWSIsIkhVRnRMaTFRR2p0XzUxVjlkcmlNYzJISjdaSTQ1WkNGRXFSTUloNUdjUEUiLCJJWjliSWNDSUtuaEYyOFZGQnM4TlNQUk5rWlU5cTBFT01hRW1ySE9FRVp3IiwiUzNqYk9VWS1RWUllVVlwZEsyXzVUZnZURUdJZ3B0VU9vTDJhRE5HdU5WcyIsIlc5SDUtU2FWRV91RnBNYWdXNi1ULThCWGRaS1gzUUpzeUVBd3VtOE9PUEEiXSwidmN0IjoiaHR0cHM6Ly9jcmVkZW50aWFscy5leGFtcGxlLmNvbS9pZGVudGl0eV9jcmVkZW50aWFsIiwiX3NkX2FsZyI6InNoYS0yNTYiLCJpc3MiOiJodHRwczovL3RyaWFsLmF1dGhsZXRlLm5ldCIsImNuZiI6eyJqd2siOnsia3R5IjoiRUMiLCJjcnYiOiJQLTI1NiIsImtpZCI6Ik5QSG44V0RWbUtHeGdiY25QSzdHMjRWa0V2UDQ3LS1lS2h3R1hiU3A0bWMiLCJ4IjoiNkZISllzSTBieTkxWFNsbERTSE1OUzIwUmx3NkxyUE5tUEFSN2phZGVGcyIsInkiOiJnSmlIQ0RQMWpiQUtfczVpSXRDN1J0S1Y4SHg1UmxMRG9QX21FYVdmZTl3In19LCJpYXQiOjE3MDg2MTMwOTh9.IXG7_24Rf8YVu1lM_altOUb5cLKkkMPNuRH0ya8ZFcZfIIhEcujSORNht5Zs82ROiF87yY0voud1q-oMruxzkg~WyJRQU1SMnY5ZmtXQ1VyV2pTOTBqMnZ3Iiwic3ViIiwiMTAwNCJd~WyIxT1BqMzlVZFloSmU0SlV0NHFUREpBIiwiZ2l2ZW5fbmFtZSIsIkluZ2EiXQ~WyJXYUpNUExEVFJQWU5WZVZhMzRzREdRIiwiZmFtaWx5X25hbWUiLCJTaWx2ZXJzdG9uZSJd~WyJPWkdsYWJMSXRwZGNwZFBTdlNRWmxnIiwiYmlydGhkYXRlIiwiMTk5MS0xMS0wNiJd~',
  c_nonce: 'QhVfho_Ar4oNAnPF8rrmSr5qjL8i-99ehaV5VIG7hSI',
  c_nonce_expires_in: 83855,
};

export const jwksRef1: JWKSet = {
  keys: [
    {
      kty: 'EC',
      crv: 'P-256',
      kid: 'ZbAAKwhynrqBnYlHdEkBIvNJFZZH_bRg1KIopKfZ6O8',
      x: 'eshMYyyoEsH_Eb85a7o76msXFPokfvNaeyY3u5qDm3M',
      y: 'q0lGMn_UXiWJdgJtSCNzh9zPC6s7qKqQMo4V1i-69jA',
      alg: 'ES256',
    },
    {
      kty: 'EC',
      crv: 'P-256',
      kid: 'J1FwJP87C6-QN_WSIOmJAQc6n5CQ_bZdaFJ5GDnW1Rk',
      x5c: [
        'MIIBXTCCAQSgAwIBAgIGAYyR2cIZMAoGCCqGSM49BAMCMDYxNDAyBgNVBAMMK0oxRndKUDg3QzYtUU5fV1NJT21KQVFjNm41Q1FfYlpkYUZKNUdEblcxUmswHhcNMjMxMjIyMTQwNjU2WhcNMjQxMDE3MTQwNjU2WjA2MTQwMgYDVQQDDCtKMUZ3SlA4N0M2LVFOX1dTSU9tSkFRYzZuNUNRX2JaZGFGSjVHRG5XMVJrMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEAopVeboJpYRycw1YKkkROXfCpKEKl9Y1YPFhOGj4xTg2UOunxTxSIVkT94qFVIuu1hkEoE2NxelZo3+yTFUODDAKBggqhkjOPQQDAgNHADBEAiBnFjScBcvERleLjMCu5NbxJKkNsa/gQhkXTfDmbq+T3gIgVazbsVdQvZgluc9nJYQxWlzXT9i6f+wgUKx0KCYbj3A\u003d',
      ],
      x: 'AopVeboJpYRycw1YKkkROXfCpKEKl9Y1YPFhOGj4xTg',
      y: 'NlDrp8U8UiFZE_eKhVSLrtYZBKBNjcXpWaN_skxVDgw',
      alg: 'ES256',
    },
  ],
};

export const credentialResponseRef2: CredentialResponse = {
  credential:
    'eyJ0eXAiOiJ2YytzZC1qd3QiLCJhbGciOiJFUzI1NiJ9.eyJfc2QiOlsiMWM5ZUpBTzNEVm1NOTBMOU9xWjRoaWVudHFGaVQ0U1ZueUV2SzIxTzdRQSIsIjY5N3ZyRnRSNUFkWWMwTlg4cFBwNUN2WkN3V196d3VPTGxBV1dDM2c0c00iLCI2dENSazJjWUdqSDlLRmlidmlCYnNrUzdUem5qcW5Lb0Vab1MycFMtWENVIiwiRGFadVhKM3FtR2p1OFlvdkkyNFZGUnBhUzMyREFMV1RQd2RzVXQwcUtvWSIsIkhVRnRMaTFRR2p0XzUxVjlkcmlNYzJISjdaSTQ1WkNGRXFSTUloNUdjUEUiLCJJWjliSWNDSUtuaEYyOFZGQnM4TlNQUk5rWlU5cTBFT01hRW1ySE9FRVp3IiwiUzNqYk9VWS1RWUllVVlwZEsyXzVUZnZURUdJZ3B0VU9vTDJhRE5HdU5WcyIsIlc5SDUtU2FWRV91RnBNYWdXNi1ULThCWGRaS1gzUUpzeUVBd3VtOE9PUEEiXSwidmN0IjoiaHR0cHM6Ly9jcmVkZW50aWFscy5leGFtcGxlLmNvbS9pZGVudGl0eV9jcmVkZW50aWFsIiwiX3NkX2FsZyI6InNoYS0yNTYiLCJpc3MiOiJodHRwczovL3RyaWFsLmF1dGhsZXRlLm5ldCIsImNuZiI6eyJqd2siOnsia3R5IjoiRUMiLCJjcnYiOiJQLTI1NiIsImtpZCI6Ik5QSG44V0RWbUtHeGdiY25QSzdHMjRWa0V2UDQ3LS1lS2h3R1hiU3A0bWMiLCJ4IjoiNkZISllzSTBieTkxWFNsbERTSE1OUzIwUmx3NkxyUE5tUEFSN2phZGVGcyIsInkiOiJnSmlIQ0RQMWpiQUtfczVpSXRDN1J0S1Y4SHg1UmxMRG9QX21FYVdmZTl3In19LCJpYXQiOjE3MDg2MTMwOTh9.gB-PmfPsGzEzakuNcXMGh840TVVlpn7fxCtRjFWGwjdhNaHI2Qi_3RbjsvRo6OA5VDYDdh1UyHj62d1wQZmU9w',
  c_nonce: 'QhVfho_Ar4oNAnPF8rrmSr5qjL8i-99ehaV5VIG7hSI',
  c_nonce_expires_in: 83855,
};

export const jwksRef2: JWKSet = {
  keys: [
    {
      kty: 'EC',
      d: 'gHenVdNxVOJTkigqpIchYNW4pn018RAxODopjHtCASU',
      use: 'sig',
      crv: 'P-256',
      x: 'xS19YVMuGvOijmo6P1UIf1cYT8JPFz4v1g2P_ABtOIw',
      y: 'UeP-n6xVUq_iRx4aRDf5d0uNq8fsuPWEBrY39CjA4aM',
      alg: 'ES256',
    },
    {
      // verifying key
      kty: 'EC',
      d: '_6jEZtFzebWMGSy7VJKh6nzDj877PmcbZRhb57l2eBs',
      use: 'sig',
      crv: 'P-256',
      x: 'UC7hmyT8VwIFFcQGIKmbAaN70LjE5gBNzGzrPoxAA-k',
      y: 'V0UkzeDiv3e7BsNVvamn-aeBYAouGeM0UdTs6Ye1w58',
      alg: 'ES256',
    },
  ],
};
