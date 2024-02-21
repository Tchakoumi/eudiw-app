import { CredentialOfferResolver } from '../core/CredentialOfferResolver';
import { CredentialRequester } from '../core/CredentialRequester';
import { IdentityProofGenerator } from '../core/IdentityProofGenerator';
import {
  GrantType,
  PRE_AUTHORIZED_GRANT_TYPE,
  ResolvedCredentialOffer,
} from '../lib/types';
import { OID4VCIService, OID4VCIServiceEventChannel } from './OID4VCIService';
import { EventEmitter } from 'eventemitter3';
import { ServiceResponse } from './types';

/**
 * Concrete implementation of the OID4VCI service.
 */
export class OID4VCIServiceImpl implements OID4VCIService {
  private readonly credentialOfferResolver: CredentialOfferResolver;
  private readonly credentialRequester: CredentialRequester;

  public constructor(private eventBus: EventEmitter) {
    const identityProofGenerator = new IdentityProofGenerator();
    this.credentialOfferResolver = new CredentialOfferResolver();
    this.credentialRequester = new CredentialRequester(identityProofGenerator);
  }

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

  public async requestCredentialIssuance(opts: {
    resolvedCredentialOffer: ResolvedCredentialOffer;
    credentialTypeKey: string;
    grantType?: GrantType;
  }): Promise<void> {
    const {
      resolvedCredentialOffer,
      credentialTypeKey,
      grantType = PRE_AUTHORIZED_GRANT_TYPE,
    } = opts;

    const channel = '';

    this.credentialRequester
      .requestCredentialIssuance(
        resolvedCredentialOffer,
        credentialTypeKey,
        grantType
      )
      .then((result) =>
        this.eventBus.emit(channel, {
          status: 'success',
          payload: result,
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
