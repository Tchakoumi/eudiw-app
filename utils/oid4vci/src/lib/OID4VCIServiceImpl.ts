import { CredentialOfferResolver } from '../core/CredentialOfferResolver';
import { ResolvedCredentialOffer } from './types';
import { OID4VCIService } from './OID4VCIService';

/**
 * Concrete implementation of the OID4VCI service.
 */
export class OID4VCIServiceImpl implements OID4VCIService {
  private readonly credentialOfferResolver = new CredentialOfferResolver();

  public async resolveCredentialOffer(
    credentialOffer: string
  ): Promise<ResolvedCredentialOffer> {
    return await this.credentialOfferResolver.resolveCredentialOffer(
      credentialOffer
    );
  }
}
