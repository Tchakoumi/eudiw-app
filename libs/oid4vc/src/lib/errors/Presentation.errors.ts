export enum PresentationError {
  PresentationError = 'Presentation error',
  UnResolvedRequestObject = `${PresentationError}: Could not resolved request  object`,
  UnResolvedClientMetadata = `${PresentationError}: Could not resolved client metadata`,
  UnResolvedClientMetadataJwk = `${PresentationError}: Could not resolved client metadata jwks`,
  UnResolvedPresentationDefinition = `${PresentationError}: Could not resolved presentation definition`,
  MissingQueryString = `${PresentationError}: Missing query string`,
  MissingRequiredParams = `${PresentationError}: Missing required params`,
  InvalidRequestObjectJwt = `${PresentationError}: Could not decode request object JWT`
}
