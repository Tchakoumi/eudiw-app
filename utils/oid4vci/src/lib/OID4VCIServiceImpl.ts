import { CredentialOfferResolver } from '../core/CredentialOfferResolver';
import { CredentialRequester } from '../core/CredentialRequester';
import { OID4VCIServiceError } from '../errors';
import { Grant, ResolvedCredentialOffer } from '../types';
import { OID4VCIService } from './OID4VCIService';

/**
 * Concrete implementation of the OID4VCI service.
 */
export class OID4VCIServiceImpl implements OID4VCIService {
  readonly credentialRequester = new CredentialRequester();

  public constructor() {}

  public async resolveCredentialOffer(
    credentialOffer: string
  ): Promise<ResolvedCredentialOffer> {
    const resolver = new CredentialOfferResolver();
    return await resolver.resolveCredentialOffer(credentialOffer);
  }

  public async requestCredentialIssuance(
    resolvedCredentialOffer: ResolvedCredentialOffer,
    credentialTypeKey: string,
    grantType: keyof Grant = 'urn:ietf:params:oauth:grant-type:pre-authorized_code'
  ): Promise<string> {
    if (grantType != 'urn:ietf:params:oauth:grant-type:pre-authorized_code') {
      throw new OID4VCIServiceError(
        'There is only support for the Pre-Authorized Code flow.'
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { credentialOffer, discoveryMetadata } = resolvedCredentialOffer;

    // Request an access token in exchange of the pre-authorized code.

    // Delegate issuance request
    return await this.credentialRequester.requestCredentialIssuance();
  }
}
