import EventEmitter from 'eventemitter3';
import { OID4VCIServiceError } from './errors';
import {
  IDeriveOID4VCFlow,
  OID4VCFlow,
  OID4VCServiceEventChannel,
} from './types';

export class OID4VCService {
  /**
   * OpenID for VC service
   * @param eventBus
   */
  public constructor(private eventBus: EventEmitter) {}

  deriveOID4VCFlow(encodedUri: string) {
    const url = new URL(encodedUri);
    if (!url.search) {
      throw new OID4VCIServiceError('encoded uri is missing query params');
    }

    const params = new URLSearchParams(url.search);
    let oidvcFlow: IDeriveOID4VCFlow;
    if (
      !params.has('credential_offer') &&
      !params.has('credential_offer_uri')
    ) {
      oidvcFlow = { encodedUri, flow: OID4VCFlow.Presentation };
    } else if (
      !params.has('request') &&
      !params.has('request_uri') &&
      !params.has('presentation_definition_uri')
    ) {
      oidvcFlow = { encodedUri, flow: OID4VCFlow.Presentation };
    } else
      throw new OID4VCIServiceError('unresolved flow: missing required params');

    this.eventBus.emit(OID4VCServiceEventChannel.DeriveOID4VCFlow, oidvcFlow);
  }
}
