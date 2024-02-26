export * from './CredentialOffer.errors';

export class OID4VCIServiceError extends Error {
  public constructor(message: string) {
    super(`OID4VCIServiceError: ${message}`);
  }
}
