import {
  ClientIdScheme,
  DisplayCredential,
  JWKSet,
  PresentationDefinition,
  PresentationExchange,
  ResolvedClientMetadata,
  ResolvedRequestObject,
  ResponseMode,
  SdJwtProcessedCredential,
} from '../../../../lib/types';

export const sdJwtProcessedCredentialObjRef10: SdJwtProcessedCredential = {
  encoded:
    'eyJraWQiOiJKMUZ3SlA4N0M2LVFOX1dTSU9tSkFRYzZuNUNRX2JaZGFGSjVHRG5XMVJrIiwidHlwIjoidmMrc2Qtand0IiwiYWxnIjoiRVMyNTYifQ.eyJfc2QiOlsiMWM5ZUpBTzNEVm1NOTBMOU9xWjRoaWVudHFGaVQ0U1ZueUV2SzIxTzdRQSIsIjY5N3ZyRnRSNUFkWWMwTlg4cFBwNUN2WkN3V196d3VPTGxBV1dDM2c0c00iLCI2dENSazJjWUdqSDlLRmlidmlCYnNrUzdUem5qcW5Lb0Vab1MycFMtWENVIiwiRGFadVhKM3FtR2p1OFlvdkkyNFZGUnBhUzMyREFMV1RQd2RzVXQwcUtvWSIsIkhVRnRMaTFRR2p0XzUxVjlkcmlNYzJISjdaSTQ1WkNGRXFSTUloNUdjUEUiLCJJWjliSWNDSUtuaEYyOFZGQnM4TlNQUk5rWlU5cTBFT01hRW1ySE9FRVp3IiwiUzNqYk9VWS1RWUllVVlwZEsyXzVUZnZURUdJZ3B0VU9vTDJhRE5HdU5WcyIsIlc5SDUtU2FWRV91RnBNYWdXNi1ULThCWGRaS1gzUUpzeUVBd3VtOE9PUEEiXSwidmN0IjoiaHR0cHM6Ly9jcmVkZW50aWFscy5leGFtcGxlLmNvbS9pZGVudGl0eV9jcmVkZW50aWFsIiwiX3NkX2FsZyI6InNoYS0yNTYiLCJpc3MiOiJodHRwczovL3RyaWFsLmF1dGhsZXRlLm5ldCIsImNuZiI6eyJqd2siOnsia3R5IjoiRUMiLCJjcnYiOiJQLTI1NiIsImtpZCI6Ik5QSG44V0RWbUtHeGdiY25QSzdHMjRWa0V2UDQ3LS1lS2h3R1hiU3A0bWMiLCJ4IjoiNkZISllzSTBieTkxWFNsbERTSE1OUzIwUmx3NkxyUE5tUEFSN2phZGVGcyIsInkiOiJnSmlIQ0RQMWpiQUtfczVpSXRDN1J0S1Y4SHg1UmxMRG9QX21FYVdmZTl3In19LCJpYXQiOjE3MDg2MTMwOTh9.IXG7_24Rf8YVu1lM_altOUb5cLKkkMPNuRH0ya8ZFcZfIIhEcujSORNht5Zs82ROiF87yY0voud1q-oMruxzkg~WyJRQU1SMnY5ZmtXQ1VyV2pTOTBqMnZ3Iiwic3ViIiwiMTAwNCJd~WyIxT1BqMzlVZFloSmU0SlV0NHFUREpBIiwiZ2l2ZW5fbmFtZSIsIkluZ2EiXQ~WyJXYUpNUExEVFJQWU5WZVZhMzRzREdRIiwiZmFtaWx5X25hbWUiLCJTaWx2ZXJzdG9uZSJd~WyJPWkdsYWJMSXRwZGNwZFBTdlNRWmxnIiwiYmlydGhkYXRlIiwiMTk5MS0xMS0wNiJd~',
  display: {
    title: 'Identity Credential',
    issuer: 'trial.authlete.net',
    issued_at: 1708613098,
    claims: {
      id: 'Identity Credential',
      given_name: 'Inga',
      family_name: 'Silverstone',
      birthdate: '1991-11-06',
    },
  },
};

export const presentationDefinitionValue1: PresentationDefinition = {
  id: 'KVc4W0wsANjL',
  input_descriptors: [
    {
      id: 'credential-data-id',
      format: {
        'vc+sd-jwt': {},
      },
      constraints: {
        fields: [
          {
            path: ['$.given_name'],
            filter: {
              type: 'string',
            },
          },
          {
            path: ['$.family_name'],
            filter: {
              type: 'string',
            },
          },
          {
            path: ['$.birthdate'],
            filter: {
              type: 'string',
              format: 'date',
            },
          },
        ],
      },
    },
    {
      id: 'credential-metadata-id',
      format: {
        'vc+sd-jwt': {},
      },
      constraints: {
        fields: [
          {
            path: ['$.vct'],
            filter: {
              type: 'string',
              const: 'https://credentials.example.com/identity_credential',
            },
          },
          {
            path: ['$.iat'],
            filter: {
              type: 'number',
            },
          },
        ],
      },
    },
  ],
};

export const credentialContentMatch: DisplayCredential = {
  title: 'Identity credential',
  issuer: 'trial.authlete.net',
  issued_at: 1708613098,
  id: 1,
  claims: {
    id: 'Identity credential',
    given_name: 'Inga',
    family_name: 'Silverstone',
    birthdate: '1991-11-06',
  },
};

export const clientMetadataValueJwks1: JWKSet = {
  keys: [
    {
      kty: 'EC',
      use: 'enc',
      crv: 'P-256',
      kid: '2483b80b-d9fc-46f0-8e10-358401c274fe',
      x: 'koPQM9kfAg8jOk5dyQQy7pF2Pq_NFp2SFklouaXaLL0',
      y: 'qapFx_2e-HGpJ7LnEqx2CX3dQqRFJWw-eDqbsYEZeYw',
      alg: 'ECDH-ES',
    },
  ],
};

export const resolvedClientMetadata1: ResolvedClientMetadata = {
  jwks: clientMetadataValueJwks1,
  authorization_encrypted_response_alg: 'ECDH-ES',
  authorization_encrypted_response_enc: 'A128CBC-HS256',
  id_token_encrypted_response_alg: 'RSA-OAEP-256',
  id_token_encrypted_response_enc: 'A128CBC-HS256',
  subject_syntax_types_supported: ['urn:ietf:params:oauth:jwk-thumbprint'],
  id_token_signed_response_alg: 'RS256',
};

export const resolvedRequestObject1: ResolvedRequestObject = {
  client_id:
    'https://verifier.ssi.tir.budru.de/presentation/277d0fb5-ef4b-4cff-93f0-086af36f9190',
  client_id_scheme: ClientIdScheme.REDIRECT_URI,
  client_metadata: resolvedClientMetadata1,
  presentation_definition: presentationDefinitionValue1,
  response_type: 'vp_token',
  state: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
  nonce: 'lLD1o3L6qJdazVcfCw3shh',
  response_mode: ResponseMode.QUERY,
};

export const presentationExchangeObject: PresentationExchange = {
  resolvedRequestObject: resolvedRequestObject1,
  matchingCredentials: [
    {
      credential: {
        ...sdJwtProcessedCredentialObjRef10.display,
        id: 1,
      },
      disclosures: {
        birthdate: '1991-11-06',
        family_name: 'Silverstone',
        given_name: 'Inga',
        iat: 1708613098,
        vct: 'https://credentials.example.com/identity_credential',
      },
    },
  ],
};