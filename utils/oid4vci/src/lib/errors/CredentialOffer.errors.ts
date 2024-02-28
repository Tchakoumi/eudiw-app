export enum InvalidCredentialOffer {
  Generic = 'invalid credential offer',
  MissingQueryString = `${Generic}: missing query string`,
  WrongParamCount = `${Generic}: exactly one parameter is required`,
  MissingRequiredParams = `${Generic}: missing required params`,
  DereferencingError = `${Generic}: could not dereference credential offer`,
  DeserializationError = `${Generic}: deserialization error`,
  UnresolvableMetadata = `${Generic}: could not resolve metadata`,
  MissingCredentialIssuer = `${Generic}: missing credential issuer`,
  UnresolvableAuthorizationServer = `${Generic}: unresolvable authorization server`,
  invalid_client = 'invalid_client',
}
