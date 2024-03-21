import {
  ClientIdScheme,
  ClientMetadata,
  JWKSet,
  Optionality,
  PresentationDefinition,
  RequestObject,
  ResolvedClientMetadata,
  ResolvedRequestObject,
  ResponseMode,
} from '../../../../lib/types';

export const encodedRequestUri = `haip://?client_id=verifier.ssi.tir.budru.de&request_uri=https://verifier.ssi.tir.budru.de/presentation/authorization-request?id%3D277d0fb5-ef4b-4cff-93f0-086af36f9190%26crossDevice%3Dtrue`;

export const requestObjectJwt = `eyJ4NWMiOlsiTUlJQ0x6Q0NBZFdnQXdJQkFnSUJCREFLQmdncWhrak9QUVFEQWpCak1Rc3dDUVlEVlFRR0V3SkVSVEVQTUEwR0ExVUVCd3dHUW1WeWJHbHVNUjB3R3dZRFZRUUtEQlJDZFc1a1pYTmtjblZqYTJWeVpXa2dSMjFpU0RFS01BZ0dBMVVFQ3d3QlNURVlNQllHQTFVRUF3d1BTVVIxYm1sdmJpQlVaWE4wSUVOQk1CNFhEVEl6TURnd016QTROREkwTkZvWERUSTRNRGd3TVRBNE5ESTBORm93VlRFTE1Ba0dBMVVFQmhNQ1JFVXhIVEFiQmdOVkJBb01GRUoxYm1SbGMyUnlkV05yWlhKbGFTQkhiV0pJTVFvd0NBWURWUVFMREFGSk1Sc3dHUVlEVlFRRERCSlBjR1Z1U1dRMFZsQWdWbVZ5YVdacFpYSXdXVEFUQmdjcWhrak9QUUlCQmdncWhrak9QUU1CQndOQ0FBUnNoUzVDaVBrSzVXRUN1RHpybmN0SXBwYm1nc1lkOURzT1lEcElFeFpFczFmUWNOeXZrQjVFZU5Xc2MwU0ExUU5xd3dHVzRndUZLZzBJZjFKR0R4VWZvNEdITUlHRU1CMEdBMVVkRGdRV0JCUmZMQVBzeG1Mc3AxblEvRk12RkkzN0MzQmxZREFNQmdOVkhSTUJBZjhFQWpBQU1BNEdBMVVkRHdFQi93UUVBd0lIZ0RBa0JnTlZIUkVFSFRBYmdobDJaWEpwWm1sbGNpNXpjMmt1ZEdseUxtSjFaSEoxTG1SbE1COEdBMVVkSXdRWU1CYUFGRStXNno3YWpUdW1leCtZY0Zib05yVmVDMnRSTUFvR0NDcUdTTTQ5QkFNQ0EwZ0FNRVVDSUNWZURUMnNkZHhySEMrZ0ZJTUVmc3huc0lXRmdIdnZlZnBuWXZrb0RjbHdBaUVBMlFnRVRHV3hIWUVObWxsNDA2VUNwYnFRb1kzMzJPbE9qdDUwWjc2WHBtQT0iLCJNSUlDTFRDQ0FkU2dBd0lCQWdJVU1ZVUhoR0Q5aFUvYzBFbzZtVzhyamplSit0MHdDZ1lJS29aSXpqMEVBd0l3WXpFTE1Ba0dBMVVFQmhNQ1JFVXhEekFOQmdOVkJBY01Ca0psY214cGJqRWRNQnNHQTFVRUNnd1VRblZ1WkdWelpISjFZMnRsY21WcElFZHRZa2d4Q2pBSUJnTlZCQXNNQVVreEdEQVdCZ05WQkFNTUQwbEVkVzVwYjI0Z1ZHVnpkQ0JEUVRBZUZ3MHlNekEzTVRNd09USTFNamhhRncwek16QTNNVEF3T1RJMU1qaGFNR014Q3pBSkJnTlZCQVlUQWtSRk1ROHdEUVlEVlFRSERBWkNaWEpzYVc0eEhUQWJCZ05WQkFvTUZFSjFibVJsYzJSeWRXTnJaWEpsYVNCSGJXSklNUW93Q0FZRFZRUUxEQUZKTVJnd0ZnWURWUVFEREE5SlJIVnVhVzl1SUZSbGMzUWdRMEV3V1RBVEJnY3Foa2pPUFFJQkJnZ3Foa2pPUFFNQkJ3TkNBQVNFSHo4WWpyRnlUTkhHTHZPMTRFQXhtOXloOGJLT2drVXpZV2NDMWN2ckpuNUpnSFlITXhaYk5NTzEzRWgwRXIyNzM4UVFPZ2VSb1pNSVRhb2RrZk5TbzJZd1pEQWRCZ05WSFE0RUZnUVVUNWJyUHRxTk82WjdINWh3VnVnMnRWNExhMUV3SHdZRFZSMGpCQmd3Rm9BVVQ1YnJQdHFOTzZaN0g1aHdWdWcydFY0TGExRXdFZ1lEVlIwVEFRSC9CQWd3QmdFQi93SUJBREFPQmdOVkhROEJBZjhFQkFNQ0FZWXdDZ1lJS29aSXpqMEVBd0lEUndBd1JBSWdZMERlcmRDeHQ0ekdQWW44eU5yRHhJV0NKSHB6cTRCZGpkc1ZOMm8xR1JVQ0lCMEtBN2JHMUZWQjFJaUs4ZDU3UUFMK1BHOVg1bGRLRzdFa29BbWhXVktlIl0sImtpZCI6Ik1Hd3daNlJsTUdNeEN6QUpCZ05WQkFZVEFrUkZNUTh3RFFZRFZRUUhEQVpDWlhKc2FXNHhIVEFiQmdOVkJBb01GRUoxYm1SbGMyUnlkV05yWlhKbGFTQkhiV0pJTVFvd0NBWURWUVFMREFGSk1SZ3dGZ1lEVlFRRERBOUpSSFZ1YVc5dUlGUmxjM1FnUTBFQ0FRUT0iLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJyZXNwb25zZV91cmkiOiJodHRwczovL3ZlcmlmaWVyLnNzaS50aXIuYnVkcnUuZGUvcHJlc2VudGF0aW9uL2F1dGhvcml6YXRpb24tcmVzcG9uc2U_aWQ9Mjc3ZDBmYjUtZWY0Yi00Y2ZmLTkzZjAtMDg2YWYzNmY5MTkwIiwiY2xpZW50X2lkX3NjaGVtZSI6Ing1MDlfc2FuX2RucyIsInJlc3BvbnNlX3R5cGUiOiJ2cF90b2tlbiIsInByZXNlbnRhdGlvbl9kZWZpbml0aW9uIjp7ImlkIjoiMjc3ZDBmYjUtZWY0Yi00Y2ZmLTkzZjAtMDg2YWYzNmY5MTkwIiwiaW5wdXRfZGVzY3JpcHRvcnMiOlt7ImlkIjoiNmQ5NmYyYmYtZjI1ZS00MGU2LTk3MmQtZDlkMGE1NDJmMjUyIiwiZm9ybWF0Ijp7InZjK3NkLWp3dCI6e319LCJjb25zdHJhaW50cyI6eyJmaWVsZHMiOlt7InBhdGgiOlsiJC52Y3QiXSwiZmlsdGVyIjp7InR5cGUiOiJzdHJpbmciLCJjb25zdCI6Imh0dHBzOi8vY3JlZGVudGlhbHMuaWR1bmlvbi5vcmcvVmVyaWZpZWRFTWFpbCJ9fSx7InBhdGgiOlsiJC5lbWFpbCJdfV0sImxpbWl0X2Rpc2Nsb3N1cmUiOiJyZXF1aXJlZCJ9fV19LCJzdGF0ZSI6IjI3N2QwZmI1LWVmNGItNGNmZi05M2YwLTA4NmFmMzZmOTE5MCIsIm5vbmNlIjoibExEMW8zTDZxSmRhelZjZkN3M3NoaCIsImNsaWVudF9pZCI6InZlcmlmaWVyLnNzaS50aXIuYnVkcnUuZGUiLCJyZXNwb25zZV9tb2RlIjoiZGlyZWN0X3Bvc3QifQ.v6-fVYQK6v6AxL3yYmEGknkPV7ojU-I26fsLT3GMsEc63PeDv7lNfHtfeMVi065fq2Vg6RWM0Oo7v0agNuYjLQ`;

export const presentationDefinition: PresentationDefinition = {
  id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
  input_descriptors: [
    {
      id: '6d96f2bf-f25e-40e6-972d-d9d0a542f252',
      format: {
        'vc+sd-jwt': {},
      },
      constraints: {
        fields: [
          {
            path: ['$.vct'],
            filter: {
              type: 'string',
              const: 'https://credentials.idunion.org/VerifiedEMail',
            },
          },
          {
            path: ['$.email'],
          },
        ],
        limit_disclosure: Optionality.REQUIRED,
      },
    },
  ],
};

export const noClientMetadataRequestObject: RequestObject = {
  response_uri:
    'https://verifier.ssi.tir.budru.de/presentation/authorization-response?id=277d0fb5-ef4b-4cff-93f0-086af36f9190',
  client_id_scheme: ClientIdScheme.X509_SAN_DNS,
  response_type: 'vp_token',
  state: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
  nonce: 'lLD1o3L6qJdazVcfCw3shh',
  client_id: 'verifier.ssi.tir.budru.de',
  response_mode: ResponseMode.DIRECT_POST,
};

export const noClientMetadataResolvedRequestObject: ResolvedRequestObject = {
  response_uri:
    'https://verifier.ssi.tir.budru.de/presentation/authorization-response?id=277d0fb5-ef4b-4cff-93f0-086af36f9190',
  client_id_scheme: ClientIdScheme.X509_SAN_DNS,
  response_type: 'vp_token',
  presentation_definition: presentationDefinition,
  state: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
  nonce: 'lLD1o3L6qJdazVcfCw3shh',
  client_id: 'verifier.ssi.tir.budru.de',
  response_mode: ResponseMode.DIRECT_POST,
};

export const encodedRequestObjectUri = `haip://?client_id=https://verifier.ssi.tir.budru.de/presentation/277d0fb5-ef4b-4cff-93f0-086af36f9190&client_id_scheme=redirect_uri&presentation_definition_uri=https://verifier.ssi.tir.budru.de/presentation/definition?id%3D277d0fb5-ef4b-4cff-93f0-086af36f9190&response_type=vp_token&state=277d0fb5-ef4b-4cff-93f0-086af36f9190&nonce=lLD1o3L6qJdazVcfCw3shh&response_mode=query&client_metadata_uri=https://verifier.ssi.tir.budru.de/presentation/client-metadata.json`;

export const decodedRequestObject: RequestObject = {
  client_id_scheme: ClientIdScheme.REDIRECT_URI,
  client_metadata_uri:
    'https://verifier.ssi.tir.budru.de/presentation/client-metadata.json',
  presentation_definition_uri:
    'https://verifier.ssi.tir.budru.de/presentation/definition?id=277d0fb5-ef4b-4cff-93f0-086af36f9190',
  response_type: 'vp_token',
  state: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
  nonce: 'lLD1o3L6qJdazVcfCw3shh',
  client_id:
    'https://verifier.ssi.tir.budru.de/presentation/277d0fb5-ef4b-4cff-93f0-086af36f9190',
  response_mode: ResponseMode.QUERY,
};

export const clientMetadataValueJwks: JWKSet = {
  keys: [
    {
      kty: 'RSA',
      n: 'tB0R8RdOhaRjVxT4Xh1cjhcyP1i-11KH2VuDtgMzCbhK5pdpNXtky8fTrc-k1-i2gDSG6eALlFmEmNSYJDRgYABHBosCFMomp4kP4X-AHPmpUHAMeFFsKdViGJvJBuJfoqyTbxmlpMxTC_2-CX3Yox18ZE_j_vc1ns91CVm7ZpLhjMJINlW1tQaQ1JCPNNic62cDTkKksUjeouRGf8Crni3CFr1qJ7ZTlhbI64itcdpOCOiCJS69Ud4B4O1jpuOUmAkaA0vj8QBMDU92ZLq3MOltLe60R_p1ns5XJqydVR_pSfDVajZmfrG_7nLslu4wh9nPS_mne_pkPb5erXAHzw',
      e: 'AQAB',
      alg: 'RS256',
      kid: '2483b80b-d9fc-46f0-8e10-358401c274fe',
    },
  ],
};

export const clientMetadataValue: ClientMetadata = {
  jwks_uri: `https://verifier.ssi.tir.budru.de/presentation/jwks.json`,
  authorization_encrypted_response_alg: 'ECDH-ES',
  authorization_encrypted_response_enc: 'A128CBC-HS256',
  id_token_encrypted_response_alg: 'RSA-OAEP-256',
  id_token_encrypted_response_enc: 'A128CBC-HS256',
  subject_syntax_types_supported: ['urn:ietf:params:oauth:jwk-thumbprint'],
  id_token_signed_response_alg: 'RS256',
};

export const resolvedClientMetadata: ResolvedClientMetadata = {
  jwks: clientMetadataValueJwks,
  authorization_encrypted_response_alg: 'ECDH-ES',
  authorization_encrypted_response_enc: 'A128CBC-HS256',
  id_token_encrypted_response_alg: 'RSA-OAEP-256',
  id_token_encrypted_response_enc: 'A128CBC-HS256',
  subject_syntax_types_supported: ['urn:ietf:params:oauth:jwk-thumbprint'],
  id_token_signed_response_alg: 'RS256',
};

export const presentationDefinitionValue: PresentationDefinition = {
  id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
  input_descriptors: [
    {
      id: 'ProofOfResidence',
      format: {
        jwt_vc_json: {
          alg: ['EdDSA'],
        },
      },
      constraints: {
        fields: [
          {
            path: ['$.type'],
            filter: {
              type: 'string',
              pattern: 'ProofOfResidence',
            },
          },
        ],
      },
    },
    {
      id: 'OpenBadgeCredential',
      format: {
        jwt_vc_json: {
          alg: ['EdDSA'],
        },
      },
      constraints: {
        fields: [
          {
            path: ['$.type'],
            filter: {
              type: 'string',
              pattern: 'OpenBadgeCredential',
            },
          },
        ],
      },
    },
  ],
};

export const resolvedRequestObject: ResolvedRequestObject = {
  redirect_uri:
    'https://verifier.ssi.tir.budru.de/presentation/authorization-response?id=277d0fb5-ef4b-4cff-93f0-086af36f9190',
  client_id_scheme: ClientIdScheme.PRE_REGISTERED,
  client_metadata: resolvedClientMetadata,
  presentation_definition: presentationDefinitionValue,
  response_type: 'vp_token',
  state: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
  nonce: 'lLD1o3L6qJdazVcfCw3shh',
  client_id:
    'https://verifier.ssi.tir.budru.de/presentation/277d0fb5-ef4b-4cff-93f0-086af36f9190',
  response_mode: ResponseMode.QUERY,
};

export const requestObjectJwtWithClientMetadata = `eyJrdHkiOiJSU0EiLCJuIjoidEIwUjhSZE9oYVJqVnhUNFhoMWNqaGN5UDFpLTExS0gyVnVEdGdNekNiaEs1cGRwTlh0a3k4ZlRyYy1rMS1pMmdEU0c2ZUFMbEZtRW1OU1lKRFJnWUFCSEJvc0NGTW9tcDRrUDRYLUFIUG1wVUhBTWVGRnNLZFZpR0p2SkJ1SmZvcXlUYnhtbHBNeFRDXzItQ1gzWW94MThaRV9qX3ZjMW5zOTFDVm03WnBMaGpNSklObFcxdFFhUTFKQ1BOTmljNjJjRFRrS2tzVWplb3VSR2Y4Q3JuaTNDRnIxcUo3WlRsaGJJNjRpdGNkcE9DT2lDSlM2OVVkNEI0TzFqcHVPVW1Ba2FBMHZqOFFCTURVOTJaTHEzTU9sdExlNjBSX3AxbnM1WEpxeWRWUl9wU2ZEVmFqWm1mckdfN25Mc2x1NHdoOW5QU19tbmVfcGtQYjVlclhBSHp3IiwiZSI6IkFRQUIiLCJhbGciOiJSUzI1NiIsImtpZCI6IjI0ODNiODBiLWQ5ZmMtNDZmMC04ZTEwLTM1ODQwMWMyNzRmZSJ9.eyJyZWRpcmVjdF91cmkiOiJodHRwczovL3ZlcmlmaWVyLnNzaS50aXIuYnVkcnUuZGUvcHJlc2VudGF0aW9uL2F1dGhvcml6YXRpb24tcmVzcG9uc2U_aWQ9Mjc3ZDBmYjUtZWY0Yi00Y2ZmLTkzZjAtMDg2YWYzNmY5MTkwIiwiY2xpZW50X2lkX3NjaGVtZSI6InByZS1yZWdpc3RlcmVkIiwicmVzcG9uc2VfdHlwZSI6InZwX3Rva2VuIiwicHJlc2VudGF0aW9uX2RlZmluaXRpb25fdXJpIjoiaHR0cHM6Ly92ZXJpZmllci5zc2kudGlyLmJ1ZHJ1LmRlL3ByZXNlbnRhdGlvbi9kZWZpbml0aW9uP2lkPTI3N2QwZmI1LWVmNGItNGNmZi05M2YwLTA4NmFmMzZmOTE5MCIsInN0YXRlIjoiMjc3ZDBmYjUtZWY0Yi00Y2ZmLTkzZjAtMDg2YWYzNmY5MTkwIiwibm9uY2UiOiJsTEQxbzNMNnFKZGF6VmNmQ3czc2hoIiwiY2xpZW50X2lkIjoidmVyaWZpZXIuZGF0YXRldi5kZSIsInJlc3BvbnNlX21vZGUiOiJmcmFnbWVudCIsImNsaWVudF9tZXRhZGF0YSI6eyJqd2tzX3VyaSI6Imh0dHBzOi8vdmVyaWZpZXIuc3NpLnRpci5idWRydS5kZS9wcmVzZW50YXRpb24vandrcy5qc29uIiwiYXV0aG9yaXphdGlvbl9lbmNyeXB0ZWRfcmVzcG9uc2VfYWxnIjoiRUNESC1FUyIsImF1dGhvcml6YXRpb25fZW5jcnlwdGVkX3Jlc3BvbnNlX2VuYyI6IkExMjhDQkMtSFMyNTYiLCJpZF90b2tlbl9lbmNyeXB0ZWRfcmVzcG9uc2VfYWxnIjoiUlNBLU9BRVAtMjU2IiwiaWRfdG9rZW5fZW5jcnlwdGVkX3Jlc3BvbnNlX2VuYyI6IkExMjhDQkMtSFMyNTYiLCJzdWJqZWN0X3N5bnRheF90eXBlc19zdXBwb3J0ZWQiOlsidXJuOmlldGY6cGFyYW1zOm9hdXRoOmp3ay10aHVtYnByaW50Il0sImlkX3Rva2VuX3NpZ25lZF9yZXNwb25zZV9hbGciOiJSUzI1NiJ9fQ.dYb62XTVjx1SZ0Wb29Liil0eao8JG5J90fyWn0_YcAGw8yHDcHmiOLbsLeBfH8jY2fB0ncyIx34IzX722dndruFc7zaObEcbDThZxId-h4tm5eaWW3UwFAGvegWhKi2ouNkZCJh1HimSDMgK8ft3FnExLA0Z8kfrlmLf67qIu3NiGFRTiU2Z5siJw0C8OFJJRNUw-30SJQpG_jZkEZd5UvQwNs_vq3NPjZxs5_KK7SzHE3hoBspB4F-ZVMgPH3q2y_sbgn-Uq1ymdXOguBR35jGcZeKn2qe2BqklaHEgvzXklq1Qc4U0tOf5Bx2XDg9jp2Mq0vM_t_5NdTPo9_1MPw`;

export const requestObjectJwtWithInssufientParams = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWRfc2NoZW1lIjoicHJlLXJlZ2lzdGVyZWQiLCJyZXNwb25zZV90eXBlIjoidnBfdG9rZW4iLCJwcmVzZW50YXRpb25fZGVmaW5pdGlvbl91cmkiOiJodHRwczovL3ZlcmlmaWVyLnNzaS50aXIuYnVkcnUuZGUvcHJlc2VudGF0aW9uL2RlZmluaXRpb24_aWQ9Mjc3ZDBmYjUtZWY0Yi00Y2ZmLTkzZjAtMDg2YWYzNmY5MTkwIiwic3RhdGUiOiIyNzdkMGZiNS1lZjRiLTRjZmYtOTNmMC0wODZhZjM2ZjkxOTAiLCJub25jZSI6ImxMRDFvM0w2cUpkYXpWY2ZDdzNzaGgiLCJjbGllbnRfaWQiOiJ2ZXJpZmllci5kYXRhdGV2LmRlIiwicmVzcG9uc2VfbW9kZSI6ImZyYWdtZW50In0.AHo3sVhOcpMtvyeFedCTrXlu_LBi8CufpuoFXzizrs0`;
