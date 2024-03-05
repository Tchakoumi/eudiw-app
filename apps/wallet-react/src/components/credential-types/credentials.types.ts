export interface IdentityCredentialMetadata {
  [key: string]: CredentialConfiguration;
}

export interface IdentityCredentialMetadataConfig {
  credential_issuer: string;
  credential_endpoint: string;
  batch_credential_endpoint: string;
  deferred_credential_endpoint: string;
  credential_response_encryption: {
    alg_values_supported: string[];
    enc_values_supported: string[];
    encryption_required: boolean;
  };
  credential_configurations_supported: IdentityCredentialMetadata;
}

export interface ICredentialCard {
  type: string;
  issuer: string;
  data: CredentialConfiguration;
}

export interface IVerifiableCredential {
  id: string;
  title: string;
  subtitle: string;
  issuer: string;
  logo: string;
}

export interface CredentialOfferResponse {
  status: string;
  payload: Payload;
}

interface Payload {
  credentialOffer: CredentialOffer;
  discoveryMetadata: DiscoveryMetadata;
}

interface CredentialOffer {
  credential_issuer: string;
  credential_configuration_ids: string[];
  grants: {
    [grantType: string]: {
      [key: string]: string;
    };
  };
}

interface DiscoveryMetadata {
  credentialIssuerMetadata: CredentialIssuerMetadata;
  credential_configurations_supported: {
    [configId: string]: CredentialConfiguration;
  };
  authorizationServerMetadata: AuthorizationServerMetadata;
  jwtIssuerMetadata: JwtIssuerMetadata;
}

export interface CredentialIssuerMetadata {
  credential_issuer: string;
  credential_endpoint: string;
  batch_credential_endpoint: string;
  deferred_credential_endpoint: string;
  credential_response_encryption: {
    alg_values_supported: string[];
    enc_values_supported: string[];
    encryption_required: boolean;
  };
  credential_configurations_supported: {
    [credential_type_id: string]: CredentialConfiguration;
  };
}

interface CredentialConfiguration {
  format: string;
  doctype: string;
  claims: { [claim: string]: unknown } | VCSDJWTClaim;
  scope: string;
  display?: [{ name: 'Identity Credential' }];
  vct?: string;
  cryptographic_binding_methods_supported?: string[];
  credential_signing_alg_values_supported?: string[];
}

interface VCSDJWTClaimDisplay {
  name: string;
  locale: string;
}
export type VCSDJWTClaim = {
  [claim: string]: { display: VCSDJWTClaimDisplay[] };
};

interface AuthorizationServerMetadata {
  issuer: string;
  authorization_endpoint: string;
  prompt_values_supported: string[];
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  registration_endpoint: string;
  scopes_supported: string[];
  response_types_supported: string[];
  response_modes_supported: string[];
  grant_types_supported: string[];
  subject_types_supported: string[];
  id_token_encryption_alg_values_supported: string[];
  id_token_encryption_enc_values_supported: string[];
  userinfo_signing_alg_values_supported: string[];
  userinfo_encryption_alg_values_supported: string[];
  userinfo_encryption_enc_values_supported: string[];
  request_object_signing_alg_values_supported: string[];
  request_object_encryption_alg_values_supported: string[];
  request_object_encryption_enc_values_supported: string[];
  authorization_signing_alg_values_supported: string[];
  authorization_encryption_alg_values_supported: string[];
  authorization_encryption_enc_values_supported: string[];
  token_endpoint_auth_methods_supported: string[];
  token_endpoint_auth_signing_alg_values_supported: string[];
  display_values_supported: string[];
  claim_types_supported: string[];
  claims_supported: string[];
  claims_parameter_supported: boolean;
  request_parameter_supported: boolean;
  request_uri_parameter_supported: boolean;
  require_request_uri_registration: boolean;
  revocation_endpoint: string;
  introspection_endpoint: string;
  revocation_endpoint_auth_methods_supported: string[];
  revocation_endpoint_auth_signing_alg_values_supported: string[];
  introspection_endpoint_auth_methods_supported: string[];
  introspection_endpoint_auth_signing_alg_values_supported: string[];
  code_challenge_methods_supported: string[];
  tls_client_certificate_bound_access_tokens: string[];
  backchannel_token_delivery_modes_supported: string[];
  backchannel_authentication_request_signing_alg_values_supported: string[];
  authorization_details_types_supported: string[];
  dpop_signing_alg_values_supported: string[];
  backchannel_authentication_endpoint: string;
  device_authorization_endpoint: string;
  pushed_authorization_request_endpoint: string;
  backchannel_user_code_parameter_supported: boolean;
  require_pushed_authorization_requests: boolean;
  require_signed_request_object: boolean;
  authorization_response_iss_parameter_supported: boolean;
  grant_management_action_required: boolean;
  grant_management_actions_supported: string[];
  transformed_claims_functions_supported: string[];
  introspection_signing_alg_values_supported: string[];
  introspection_encryption_alg_values_supported: string[];
  introspection_encryption_enc_values_supported: string[];
  client_registration_types_supported: string[];
  federation_registration_endpoint: string;
  request_authentication_methods_supported: {
    authorization_endpoint: string[];
    backchannel_authentication_endpoint: string[];
    device_authorization_endpoint: string[];
    pushed_authorization_request_endpoint: string[];
    token_endpoint: string[];
  };
  request_authentication_signing_alg_values_supported: string[];
  'pre-authorized_grant_anonymous_access_supported': boolean;
}

interface JwtIssuerMetadata {
  issuer: string;
  jwks_uri: string;
}
