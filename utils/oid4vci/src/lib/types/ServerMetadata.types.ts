export interface EndpointMetadata {
  issuer: string;
  token_endpoint: string;
  credential_endpoint: string;
  deferred_credential_endpoint?: string;
  authorization_server?: string;
  authorization_endpoint?: string; // Can be undefined in pre-auth flow
}
