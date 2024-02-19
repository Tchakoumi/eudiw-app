export enum InvalidCredentialOffer {
  Generic = 'invalid credential offer',
  MissingQueryString = `${Generic}: missing query string`,
  WrongParamCount = `${Generic}: exactly one parameter is required`,
  MissingRequiredParams = `${Generic}: missing required params`,
  DeserializationError = `${Generic}: deserialization error`,
  MissingCredentialIssuer = `${Generic}: missing credential issuer`,
  UnresolvableAuthorizationServer = `${Generic}: unresolvable authorization server`,
}
