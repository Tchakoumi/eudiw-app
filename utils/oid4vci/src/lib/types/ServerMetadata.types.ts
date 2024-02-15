import { CredentialIssuerMetadata } from './Generic.types';
import { AuthorizationServerMetadata } from './AuthorizationServerMetadata.types';

export interface EndpointMetadata {
  issuer: string;
  token_endpoint: string;
  credential_endpoint: string;
  deferred_credential_endpoint?: string;
  authorization_server?: string;
  authorization_endpoint?: string; // Can be undefined in pre-auth flow
}

export interface EndpointMetadataResult extends EndpointMetadata {
  // The EndpointMetadata are snake-case so they can easily be used in payloads/JSON.
  // The values below should not end up in requests/responses directly, so they are using our normal CamelCase convention
  authorizationServerType: AuthorizationServerType;
  authorizationServerMetadata?: AuthorizationServerMetadata;
  credentialIssuerMetadata?: Partial<AuthorizationServerMetadata> &
    CredentialIssuerMetadata;
}

export type AuthorizationServerType = 'OIDC' | 'OAuth 2.0' | 'OID4VCI'; // OID4VCI means the Issuer hosts a token endpoint itself

export enum WellKnownEndpoints {
  OPENID_CONFIGURATION = '/.well-known/openid-configuration',
  OAUTH_AS = '/.well-known/oauth-authorization-server',
  OPENID4VCI_ISSUER = '/.well-known/openid-credential-issuer',
}
