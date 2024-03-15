export enum PresentationError {
  PresentationError = 'Presentation error',
  UnResolvedRequestObject = `${PresentationError}: Could not resolved request  object`,
  UnResolvedClientMetadata = `${PresentationError}: Could not resolved client metadata`,
  UnResolvedPresentationDefinition = `${PresentationError}: Could not resolved presentation definition`,
}
