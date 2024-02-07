import { CredentialOffer, ResolvedCredentialOffer } from '../types';

export class CredentialOfferResolver {
  public constructor() {}

  /**
   * Resolves a credential offer (along with issuer metadata).
   * @param credentialOffer
   */
  public async resolveCredentialOffer(
    credentialOffer: string
  ): Promise<ResolvedCredentialOffer> {
    const parsedCredentialOffer = await this.parseCredentialOffer(
      credentialOffer
    );

    return {
      credentialOffer: parsedCredentialOffer,
    };
  }

  /**
   * Parses an out-of-band credential offer into an object.
   * @param credentialOffer out-of-band credential offer
   * @returns credential offer object
   */
  private async parseCredentialOffer(credentialOffer: string) {
    const query = credentialOffer.split('?')[1];
    if (!query) {
      throw new Error('Invalid credential offer: no query string.');
    }

    const params = new URLSearchParams(query);
    const paramLength = Array.from(params.keys()).length;

    if (paramLength !== 1) {
      throw new Error(
        'Invalid credential offer: exactly one parameter is required.'
      );
    }

    if (
      !params.has('credential_offer') &&
      !params.has('credential_offer_uri')
    ) {
      throw new Error('Invalid credential offer: missing required parameters.');
    }

    const credentialOfferURI = params.get('credential_offer_uri');
    const parsedCredentialOffer = credentialOfferURI
      ? await this.fetchCredentialOffer(credentialOfferURI)
      : params.get('credential_offer');

    if (!parsedCredentialOffer) {
      throw new Error('Invalid credential offer: null.');
    }

    try {
      return JSON.parse(parsedCredentialOffer) as CredentialOffer
    } catch (e) {
      throw new Error('Invalid credential offer: deserialization error.');
    }
  }

  private async fetchCredentialOffer(
    credentialOfferURI: string
  ): Promise<string> {
    return await fetch(credentialOfferURI).then((response) => response.text());
  }
}
