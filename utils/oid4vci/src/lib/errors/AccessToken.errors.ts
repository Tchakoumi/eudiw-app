export enum InvalidCredentialOffer {
  Generic = 'Invalid token request',
  invalid_request = 'Invalid request',
  invalid_grant = `${Generic}: invalid_grant`,
  invalid_client = 'invalid_client',
  invalid_scope = 'invalid_scope',
}
