import { CredentialOfferResolver } from '../core/CredentialOfferResolver';
import { OID4VCIService, OID4VCIServiceEventChannel } from './OID4VCIService';
import { EventEmitter } from 'eventemitter3';
import { ServiceResponse } from './types';

/**
 * Concrete implementation of the OID4VCI service.
 */
export class OID4VCIServiceImpl implements OID4VCIService {
  private readonly credentialOfferResolver = new CredentialOfferResolver();

  public constructor(private eventBus: EventEmitter) {}

  public getEventBus(): EventEmitter {
    return this.eventBus;
  }

  public async resolveCredentialOffer(opts: {
    credentialOffer: string;
  }): Promise<void> {
    const channel = OID4VCIServiceEventChannel.SendCredentialOffer;

    this.credentialOfferResolver
      .resolveCredentialOffer(opts.credentialOffer)
      .then((resolvedCredentialOffer) =>
        this.eventBus.emit(channel, {
          status: 'success',
          payload: resolvedCredentialOffer,
        } satisfies ServiceResponse)
      )
      .catch((error) =>
        this.eventBus.emit(channel, {
          status: 'error',
          payload: error,
        } satisfies ServiceResponse)
      );
  }
}
