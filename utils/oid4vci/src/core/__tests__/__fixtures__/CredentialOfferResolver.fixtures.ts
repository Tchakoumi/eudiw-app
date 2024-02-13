import {
  AuthorizationServerMetadata,
  CredentialIssuerMetadata,
  CredentialOffer,
  JwtIssuerMetadata,
} from '../../../types';

export const credentialOfferObjectRef1: CredentialOffer = {
  credential_issuer: 'https://trial.authlete.net',
  credential_configuration_ids: ['IdentityCredential', 'org.iso.18013.5.1.mDL'],
  grants: {
    'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
      'pre-authorized_code': '72X9bjXuPHbX_J1X-tdaCIKWKK7AG0h6gA3v5oOpu4c',
    },
  },
};

export const credentialIssuerMetadataRef1: CredentialIssuerMetadata = {
  credential_issuer: 'https://trial.authlete.net',
  credential_endpoint: 'https://trial.authlete.net/api/credential',
  batch_credential_endpoint: 'https://trial.authlete.net/api/batch_credential',
  deferred_credential_endpoint:
    'https://trial.authlete.net/api/deferred_credential',
  credential_response_encryption: {
    alg_values_supported: [
      'RSA1_5',
      'RSA-OAEP',
      'RSA-OAEP-256',
      'ECDH-ES',
      'ECDH-ES+A128KW',
      'ECDH-ES+A192KW',
      'ECDH-ES+A256KW',
    ],
    enc_values_supported: [
      'A128CBC-HS256',
      'A192CBC-HS384',
      'A256CBC-HS512',
      'A128GCM',
      'A192GCM',
      'A256GCM',
    ],
    encryption_required: false,
  },
  credential_configurations_supported: {
    'org.iso.18013.5.1.mDL': {
      format: 'mso_mdoc',
      doctype: 'org.iso.18013.5.1.mDL',
      claims: {
        'org.iso.18013.5.1': {
          family_name: {},
          given_name: {},
          birth_date: {},
          issue_date: {},
          expiry_date: {},
          issuing_country: {},
          issuing_authority: {},
          document_number: {},
          portrait: {},
          driving_privileges: {},
          un_distinguishing_sign: {},
          administrative_number: {},
          sex: {},
          height: {},
          weight: {},
          eye_colour: {},
          hair_colour: {},
          birth_place: {},
          resident_address: {},
          portrait_capture_date: {},
          age_in_years: {},
          age_birth_year: {},
          issuing_jurisdiction: {},
          nationality: {},
          resident_city: {},
          resident_state: {},
          resident_postal_code: {},
          resident_country: {},
          family_name_national_character: {},
          given_name_national_character: {},
          signature_usual_mark: {},
        },
      },
      scope: 'org.iso.18013.5.1.mDL',
    },
    IdentityCredential: {
      format: 'vc+sd-jwt',
      vct: 'https://credentials.example.com/identity_credential',
      claims: {
        family_name: {},
        given_name: {},
        birthdate: {},
      },
      scope: 'identity_credential',
      cryptographic_binding_methods_supported: ['jwk', 'x5c'],
      credential_signing_alg_values_supported: [
        'ES256',
        'ES384',
        'ES512',
        'ES256K',
      ],
      display: [
        {
          name: 'Identity Credential',
        },
      ],
    },
  },
};

export const authorizationServerMetadataRef1: AuthorizationServerMetadata = {
  issuer: 'https://trial.authlete.net',
  authorization_endpoint: 'https://trial.authlete.net/api/authorization',
  prompt_values_supported: [
    'none',
    'login',
    'consent',
    'select_account',
    'create',
  ],
  token_endpoint: 'https://trial.authlete.net/api/token',
  userinfo_endpoint: 'https://trial.authlete.net/api/userinfo',
  jwks_uri: 'https://trial.authlete.net/api/jwks',
  registration_endpoint: 'https://trial.authlete.net/api/register',
  scopes_supported: [
    'address',
    'email',
    'openid',
    'offline_access',
    'phone',
    'profile',
    'identity_credential',
    'org.iso.18013.5.1.mDL',
  ],
  response_types_supported: [
    'none',
    'code',
    'token',
    'id_token',
    'code token',
    'code id_token',
    'id_token token',
    'code id_token token',
  ],
  response_modes_supported: [
    'query',
    'fragment',
    'form_post',
    'query.jwt',
    'fragment.jwt',
    'form_post.jwt',
    'jwt',
  ],
  grant_types_supported: [
    'authorization_code',
    'implicit',
    'password',
    'client_credentials',
    'refresh_token',
    'urn:openid:params:grant-type:ciba',
    'urn:ietf:params:oauth:grant-type:device_code',
    'urn:ietf:params:oauth:grant-type:token-exchange',
    'urn:ietf:params:oauth:grant-type:jwt-bearer',
    'urn:ietf:params:oauth:grant-type:pre-authorized_code',
  ],
  subject_types_supported: ['public', 'pairwise'],
  id_token_signing_alg_values_supported: [
    'HS256',
    'HS384',
    'HS512',
    'RS256',
    'RS384',
    'RS512',
    'PS256',
    'PS384',
    'PS512',
    'ES256',
    'ES384',
    'ES512',
    'ES256K',
    'EdDSA',
  ],
  id_token_encryption_alg_values_supported: [
    'RSA1_5',
    'RSA-OAEP',
    'RSA-OAEP-256',
    'ECDH-ES',
    'ECDH-ES+A128KW',
    'ECDH-ES+A192KW',
    'ECDH-ES+A256KW',
    'A128KW',
    'A192KW',
    'A256KW',
    'dir',
    'A128GCMKW',
    'A192GCMKW',
    'A256GCMKW',
    'PBES2-HS256+A128KW',
    'PBES2-HS384+A192KW',
    'PBES2-HS512+A256KW',
  ],
  id_token_encryption_enc_values_supported: [
    'A128CBC-HS256',
    'A192CBC-HS384',
    'A256CBC-HS512',
    'A128GCM',
    'A192GCM',
    'A256GCM',
  ],
  userinfo_signing_alg_values_supported: [
    'HS256',
    'HS384',
    'HS512',
    'RS256',
    'RS384',
    'RS512',
    'PS256',
    'PS384',
    'PS512',
    'ES256',
    'ES384',
    'ES512',
    'ES256K',
    'EdDSA',
    'none',
  ],
  userinfo_encryption_alg_values_supported: [
    'RSA1_5',
    'RSA-OAEP',
    'RSA-OAEP-256',
    'ECDH-ES',
    'ECDH-ES+A128KW',
    'ECDH-ES+A192KW',
    'ECDH-ES+A256KW',
    'A128KW',
    'A192KW',
    'A256KW',
    'dir',
    'A128GCMKW',
    'A192GCMKW',
    'A256GCMKW',
    'PBES2-HS256+A128KW',
    'PBES2-HS384+A192KW',
    'PBES2-HS512+A256KW',
  ],
  userinfo_encryption_enc_values_supported: [
    'A128CBC-HS256',
    'A192CBC-HS384',
    'A256CBC-HS512',
    'A128GCM',
    'A192GCM',
    'A256GCM',
  ],
  request_object_signing_alg_values_supported: [
    'HS256',
    'HS384',
    'HS512',
    'RS256',
    'RS384',
    'RS512',
    'PS256',
    'PS384',
    'PS512',
    'ES256',
    'ES384',
    'ES512',
    'ES256K',
    'EdDSA',
  ],
  request_object_encryption_alg_values_supported: [
    'RSA1_5',
    'RSA-OAEP',
    'RSA-OAEP-256',
    'ECDH-ES',
    'ECDH-ES+A128KW',
    'ECDH-ES+A192KW',
    'ECDH-ES+A256KW',
    'A128KW',
    'A192KW',
    'A256KW',
    'dir',
    'A128GCMKW',
    'A192GCMKW',
    'A256GCMKW',
    'PBES2-HS256+A128KW',
    'PBES2-HS384+A192KW',
    'PBES2-HS512+A256KW',
  ],
  request_object_encryption_enc_values_supported: [
    'A128CBC-HS256',
    'A192CBC-HS384',
    'A256CBC-HS512',
    'A128GCM',
    'A192GCM',
    'A256GCM',
  ],
  authorization_signing_alg_values_supported: [
    'HS256',
    'HS384',
    'HS512',
    'RS256',
    'RS384',
    'RS512',
    'PS256',
    'PS384',
    'PS512',
    'ES256',
    'ES384',
    'ES512',
    'ES256K',
    'EdDSA',
  ],
  authorization_encryption_alg_values_supported: [
    'RSA1_5',
    'RSA-OAEP',
    'RSA-OAEP-256',
    'ECDH-ES',
    'ECDH-ES+A128KW',
    'ECDH-ES+A192KW',
    'ECDH-ES+A256KW',
    'A128KW',
    'A192KW',
    'A256KW',
    'dir',
    'A128GCMKW',
    'A192GCMKW',
    'A256GCMKW',
    'PBES2-HS256+A128KW',
    'PBES2-HS384+A192KW',
    'PBES2-HS512+A256KW',
  ],
  authorization_encryption_enc_values_supported: [
    'A128CBC-HS256',
    'A192CBC-HS384',
    'A256CBC-HS512',
    'A128GCM',
    'A192GCM',
    'A256GCM',
  ],
  token_endpoint_auth_methods_supported: [
    'none',
    'client_secret_basic',
    'client_secret_post',
    'client_secret_jwt',
    'private_key_jwt',
    'tls_client_auth',
    'self_signed_tls_client_auth',
  ],
  token_endpoint_auth_signing_alg_values_supported: [
    'HS256',
    'HS384',
    'HS512',
    'RS256',
    'RS384',
    'RS512',
    'PS256',
    'PS384',
    'PS512',
    'ES256',
    'ES384',
    'ES512',
    'ES256K',
    'EdDSA',
  ],
  display_values_supported: ['page', 'popup', 'touch', 'wap'],
  claim_types_supported: ['normal'],
  claims_supported: [
    'sub',
    'website',
    'zoneinfo',
    'email_verified',
    'birthdate',
    'address',
    'gender',
    'profile',
    'phone_number_verified',
    'preferred_username',
    'given_name',
    'middle_name',
    'locale',
    'picture',
    'updated_at',
    'name',
    'nickname',
    'phone_number',
    'family_name',
    'email',
  ],
  claims_parameter_supported: true,
  request_parameter_supported: true,
  request_uri_parameter_supported: true,
  require_request_uri_registration: true,
  revocation_endpoint: 'https://trial.authlete.net/api/revocation',
  revocation_endpoint_auth_methods_supported: [],
  revocation_endpoint_auth_signing_alg_values_supported: [
    'HS256',
    'HS384',
    'HS512',
    'RS256',
    'RS384',
    'RS512',
    'PS256',
    'PS384',
    'PS512',
    'ES256',
    'ES384',
    'ES512',
    'ES256K',
    'EdDSA',
  ],
  introspection_endpoint: 'https://trial.authlete.net/api/introspection',
  introspection_endpoint_auth_methods_supported: [],
  introspection_endpoint_auth_signing_alg_values_supported: [
    'HS256',
    'HS384',
    'HS512',
    'RS256',
    'RS384',
    'RS512',
    'PS256',
    'PS384',
    'PS512',
    'ES256',
    'ES384',
    'ES512',
    'ES256K',
    'EdDSA',
  ],
  code_challenge_methods_supported: ['plain', 'S256'],
  tls_client_certificate_bound_access_tokens: false,
  backchannel_token_delivery_modes_supported: ['poll', 'ping', 'push'],
  backchannel_authentication_endpoint:
    'https://trial.authlete.net/api/backchannel/authentication',
  backchannel_authentication_request_signing_alg_values_supported: [
    'RS256',
    'RS384',
    'RS512',
    'PS256',
    'PS384',
    'PS512',
    'ES256',
    'ES384',
    'ES512',
    'ES256K',
    'EdDSA',
  ],
  backchannel_user_code_parameter_supported: false,
  device_authorization_endpoint:
    'https://trial.authlete.net/api/device/authorization',
  pushed_authorization_request_endpoint: 'https://trial.authlete.net/api/par',
  require_pushed_authorization_requests: false,
  authorization_details_types_supported: ['openid_credential'],
  dpop_signing_alg_values_supported: [
    'RS256',
    'RS384',
    'RS512',
    'PS256',
    'PS384',
    'PS512',
    'ES256',
    'ES384',
    'ES512',
    'ES256K',
    'EdDSA',
  ],
  require_signed_request_object: false,
  authorization_response_iss_parameter_supported: true,
  grant_management_action_required: false,
  grant_management_actions_supported: ['create', 'merge', 'replace'],
  transformed_claims_functions_supported: [
    'all',
    'any',
    'contains',
    'ends_with',
    'eq',
    'get',
    'gt',
    'gte',
    'hash',
    'lt',
    'lte',
    'match',
    'none',
    'starts_with',
    'years_ago',
  ],
  introspection_signing_alg_values_supported: [
    'HS256',
    'HS384',
    'HS512',
    'RS256',
    'RS384',
    'RS512',
    'PS256',
    'PS384',
    'PS512',
    'ES256',
    'ES384',
    'ES512',
    'ES256K',
    'EdDSA',
    'none',
  ],
  introspection_encryption_alg_values_supported: [
    'RSA1_5',
    'RSA-OAEP',
    'RSA-OAEP-256',
    'ECDH-ES',
    'ECDH-ES+A128KW',
    'ECDH-ES+A192KW',
    'ECDH-ES+A256KW',
    'A128KW',
    'A192KW',
    'A256KW',
    'dir',
    'A128GCMKW',
    'A192GCMKW',
    'A256GCMKW',
    'PBES2-HS256+A128KW',
    'PBES2-HS384+A192KW',
    'PBES2-HS512+A256KW',
  ],
  introspection_encryption_enc_values_supported: [
    'A128CBC-HS256',
    'A192CBC-HS384',
    'A256CBC-HS512',
    'A128GCM',
    'A192GCM',
    'A256GCM',
  ],
  client_registration_types_supported: ['automatic', 'explicit'],
  federation_registration_endpoint:
    'https://trial.authlete.net/api/federation/register',
  request_authentication_methods_supported: {
    authorization_endpoint: ['request_object'],
    backchannel_authentication_endpoint: [
      'request_object',
      'private_key_jwt',
      'tls_client_auth',
      'self_signed_tls_client_auth',
    ],
    device_authorization_endpoint: [
      'private_key_jwt',
      'tls_client_auth',
      'self_signed_tls_client_auth',
    ],
    pushed_authorization_request_endpoint: [
      'request_object',
      'private_key_jwt',
      'tls_client_auth',
      'self_signed_tls_client_auth',
    ],
    token_endpoint: [
      'private_key_jwt',
      'tls_client_auth',
      'self_signed_tls_client_auth',
    ],
  },
  request_authentication_signing_alg_values_supported: [
    'RS256',
    'RS384',
    'RS512',
    'PS256',
    'PS384',
    'PS512',
    'ES256',
    'ES384',
    'ES512',
    'ES256K',
    'EdDSA',
  ],
  'pre-authorized_grant_anonymous_access_supported': false,
};

export const jwtIssuerMetadataRef1: JwtIssuerMetadata = {
  issuer: 'https://trial.authlete.net',
  jwks_uri: 'https://trial.authlete.net/api/vci/jwks',
};
