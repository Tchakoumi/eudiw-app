import EventEmitter from 'eventemitter3';
import { OID4VCIService } from './OID4VCIService';
import { OID4VCIServiceError } from './errors';

export class OID4VCService {
  private readonly oid4vciService: OID4VCIService;
  /**
   * OpenID for VC service
   * @param eventBus
   */
  public constructor(eventBus: EventEmitter) {
    this.oid4vciService = new OID4VCIService(eventBus);
  }

  resolveOID4VCUri(oid4vcUri: string) {
    const url = new URL(oid4vcUri);
    if (!url.search) {
      throw new OID4VCIServiceError('oid4vc uri is missing query params');
    }

    const params = new URLSearchParams(url.search);
    if (params.has('credential_offer') || params.has('credential_offer_uri')) {
      return this.oid4vciService.resolveCredentialOffer({
        credentialOffer: oid4vcUri,
      });
    } else if (
      params.has('request') ||
      params.has('request_uri') ||
      params.has('presentation_definition_uri')
    ) {
      //TODO call the presentation starter flow here
      throw new OID4VCIServiceError('oid4vp is not supported yet');
    } else {
      throw new OID4VCIServiceError('unsupported or invalid oid4vc uri');
    }
  }
}
