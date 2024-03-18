export const requestObjectEncodedUri1 = `haip://?client_id=verifier.ssi.tir.budru.de&request_uri=https://verifier.ssi.tir.budru.de/presentation/authorization-request?id%3D277d0fb5-ef4b-4cff-93f0-086af36f9190%26crossDevice%3Dtrue`;
export const resolvedRequestObject1 = {
  response_uri:
    'https://verifier.ssi.tir.budru.de/presentation/authorization-response?id=277d0fb5-ef4b-4cff-93f0-086af36f9190',
  client_id_scheme: 'x509_san_dns',
  response_type: 'vp_token',
  presentation_definition: {
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
          limit_disclosure: 'required',
        },
      },
    ],
  },
  state: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
  nonce: 'lLD1o3L6qJdazVcfCw3shh',
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
