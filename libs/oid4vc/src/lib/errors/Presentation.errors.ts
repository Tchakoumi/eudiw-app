export enum PresentationError {
  PresentationError = 'Presentation error',
  UnResolvedRequestObject = `${PresentationError}: Could not resolve request  object`,
  UnResolvedClientMetadata = `${PresentationError}: Could not resolve client metadata`,
  UnResolvedClientMetadataJwk = `${PresentationError}: Could not resolve client metadata jwks`,
  InvalidClientMetadataJwks = `${PresentationError}: Could not import public key from client metadata jwks`,
  UnResolvedPresentationDefinition = `${PresentationError}: Could not resolve presentation definition`,
  MissingQueryString = `${PresentationError}: Missing query string`,
  MissingRequiredParams = `${PresentationError}: Missing required params`,
  MissingResponseParams = `${PresentationError}: Request object is missing response params`,
  InvalidRequestObjectJwt = `${PresentationError}: Could not decode request object JWT`,
  MismatchedClientId = `${PresentationError}: Client identifier does not match the specified client identifier scheme`,
  MisusedClientIdScheme = `${PresentationError}: Misused client identifier scheme`,
  MissingJwtRequiredHeaderParams = `${PresentationError}:  Missing jwt required header params`,
  InvalidJwkHeaderParams = `${PresentationError}: Could not import from jwk header params`,
  InvalidRequestObjectJwtSignature = `${PresentationError}: Could not verify request object jwt signature`,
  UnSupportedClientScheme = `${PresentationError}: Specified client identifier scheme is not supported`,
  MissingConstraintField = `${PresentationError}: input descriptor constraint is missing the fields property`
}
