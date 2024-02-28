import { EventEmitter } from 'eventemitter3';
import { CredentialOfferResolver } from '../core/CredentialOfferResolver';
import { OID4VCIService, OID4VCIServiceEventChannel } from './OID4VCIService';
import { ServiceResponse, ServiceResponseStatus } from './types';

/**
 * Concrete implementation of the OID4VCI service.
 */
export class OID4VCIServiceImpl implements OID4VCIService {
  private readonly credentialOfferResolver = new CredentialOfferResolver();

  public constructor(private eventBus: EventEmitter) {}

  public resolveCredentialOffer(opts: { credentialOffer: string }): void {
    const channel = OID4VCIServiceEventChannel.ProcessCredentialOffer;

    this.credentialOfferResolver
      .resolveCredentialOffer(opts.credentialOffer)
      .then((resolvedCredentialOffer) => {
        const response: ServiceResponse = {
          status: ServiceResponseStatus.Success,
          payload: resolvedCredentialOffer,
        };

        this.eventBus.emit(channel, response);
      })
      .catch((error) => {
        const response: ServiceResponse = {
          status: ServiceResponseStatus.Error,
          payload: String(error),
        };

        this.eventBus.emit(channel, response);
      });
  }
}
