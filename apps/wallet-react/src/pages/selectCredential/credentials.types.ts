export interface ClaimDisplay {
  name: string;
  locale: string;
}

export interface Claims {
  [key: string]: {
    display: ClaimDisplay[];
  };
}

export interface CredentialConfiguration {
  format: string;
  vct: string;
  claims: Claims;
  scope: string;
  cryptographic_binding_methods_supported: string[];
  credential_signing_alg_values_supported: string[];
  display: {
    name: string;
  }[];
}

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

