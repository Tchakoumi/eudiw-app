import { CLIENT_ID } from '../config';
import { CredentialOfferResolver } from '../core/CredentialOfferResolver';
import { CredentialRequester } from '../core/CredentialRequester';
import { IdentityProofGenerator } from '../core/IdentityProofGenerator';
import { OID4VCIServiceError } from '../errors';
import { Grant, ResolvedCredentialOffer } from '../types';
import { TokenResponse } from '../types/tmp';
import { OID4VCIService } from './OID4VCIService';

/**
 * Concrete implementation of the OID4VCI service.
 */
export class OID4VCIServiceImpl implements OID4VCIService {
  private readonly credentialOfferResolver: CredentialOfferResolver;
  private readonly credentialRequester: CredentialRequester;

  public constructor() {
    const identityProofGenerator = new IdentityProofGenerator();
    this.credentialOfferResolver = new CredentialOfferResolver();
    this.credentialRequester = new CredentialRequester(identityProofGenerator);
  }

  public async resolveCredentialOffer(
    credentialOffer: string
  ): Promise<ResolvedCredentialOffer> {
    return await this.credentialOfferResolver.resolveCredentialOffer(
      credentialOffer
    );
  }

  public async requestCredentialIssuance(
    resolvedCredentialOffer: ResolvedCredentialOffer,
    credentialTypeKey: string,
    grantType: keyof Grant = 'urn:ietf:params:oauth:grant-type:pre-authorized_code'
  ): Promise<string> {
    // Enforce grant type for the pre-authorized flow
    if (grantType != 'urn:ietf:params:oauth:grant-type:pre-authorized_code') {
      throw new OID4VCIServiceError(
        'There is only support for the Pre-Authorized Code flow.'
      );
    }

    const { credentialOffer, discoveryMetadata } = resolvedCredentialOffer;

    // Enforce the availability of discovery metadata.
    if (!discoveryMetadata) {
      throw new OID4VCIServiceError(
        'Cannot proceed without discovery metadata.'
      );
    }

    //----------------------------------------------------------------
    // Request an access token in exchange of the pre-authorized code.
    //----------------------------------------------------------------

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const params = {
      client_id: CLIENT_ID,
      grant_type: grantType,
      credentialOffer: credentialOffer,
      authorizationServerMetadata:
        discoveryMetadata?.authorizationServerMetadata,
      // pre_authorized_code: credentialOffer.grants?.['urn:ietf:params:oauth:grant-type:pre-authorized_code']?.['pre-authorized_code'],
      // token_endpoint: discoveryMetadata?.authorizationServerMetadata?.token_endpoint,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const tokenResponse: TokenResponse = {
      access_token: 'xj2YRmSV-_e15n7mTXSvkCH-Yw-XklRagEHF5WXE7R4',
      token_type: 'Bearer',
      expires_in: 86400,
      scope: null,
      refresh_token: 'Oq7H2GsuES4Z6d_63Dn7rWhJ9rCpgzmzwQ-BYtGR1yE',
      c_nonce: 'EhTC8LA6kVrrO6_XiC7N6N_wXdma2Zs1LHAQBZ5E0T0',
      c_nonce_expires_in: 86400,
    };

    //----------------------------------------------------------------
    // Delegate issuance request
    //----------------------------------------------------------------

    return await this.credentialRequester.requestCredentialIssuance(
      credentialTypeKey,
      discoveryMetadata,
      tokenResponse
    );
  }
}
