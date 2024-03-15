export const requestObjectEncodedUri1 = `haip://?client_id=verifier.ssi.tir.budru.de&request_uri=https://verifier.ssi.tir.budru.de/presentation/authorization-request?id%3D506707d6-3d50-4652-ba3e-f5f669c3a635%26crossDevice%3Dtrue`;
export const resolvedRequestObject1 = {
  response_uri:
    'https://verifier.ssi.tir.budru.de/presentation/authorization-response?id=506707d6-3d50-4652-ba3e-f5f669c3a635',
  client_id_scheme: 'x509_san_dns',
  response_type: 'vp_token',
  presentation_definition: {
    id: '506707d6-3d50-4652-ba3e-f5f669c3a635',
    input_descriptors: [
      {
        id: '5f99e88f-3098-445e-a50d-6fb9ed457342',
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
          limit_disclosure: 'required',
        },
      },
    ],
  },
  state: '506707d6-3d50-4652-ba3e-f5f669c3a635',
  nonce: 'kDwWmgkQYXDAKHKHOgxqpW',
  client_id: 'verifier.ssi.tir.budru.de',
  response_mode: 'direct_post',
};

export const requestObjectEncodedUri2 = `openid4vp://authorize?response_type=vp_token&client_id=&response_mode=direct_post&state=KVc4W0wsANjL&presentation_definition_uri=https%3A%2F%2Fverifier.portal.walt.id%2Fopenid4vc%2Fpd%2FKVc4W0wsANjL&client_id_scheme=redirect_uri&response_uri=https%3A%2F%2Fverifier.portal.walt.id%2Fopenid4vc%2Fverify%2FKVc4W0wsANjL`;
export const resolvedRequestObject2 = {
  response_type: 'vp_token',
  client_id: '',
  response_mode: 'direct_post',
  state: 'KVc4W0wsANjL',
  presentation_definition_uri:
    'https://verifier.portal.walt.id/openid4vc/pd/KVc4W0wsANjL',
  client_id_scheme: 'redirect_uri',
  response_uri: 'https://verifier.portal.walt.id/openid4vc/verify/KVc4W0wsANjL',
  presentation_definition: {
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
  },
};
