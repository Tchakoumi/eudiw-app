import { CredentialOfferResolver } from '../core/CredentialOfferResolver';
import { CredentialRequester } from '../core/CredentialRequester';
import { IdentityProofGenerator } from '../core/IdentityProofGenerator';
import { OID4VCIService, OID4VCIServiceEventChannel } from './OID4VCIService';
import { EventEmitter } from 'eventemitter3';
import { ServiceResponse, ServiceResponseStatus } from './types';
import { CredentialStorage } from './schemas/CredentialDBSchema';

import {
  GrantType,
  PRE_AUTHORIZED_GRANT_TYPE,
  ResolvedCredentialOffer,
} from '../lib/types';

/**
 * Concrete implementation of the OID4VCI service.
 */
export class OID4VCIServiceImpl implements OID4VCIService {
  private readonly credentialOfferResolver: CredentialOfferResolver;
  private readonly credentialRequester: CredentialRequester;

  public constructor(
    private eventBus: EventEmitter,
    private storage: CredentialStorage
  ) {
    const identityProofGenerator = new IdentityProofGenerator();
    this.credentialOfferResolver = new CredentialOfferResolver();
    this.credentialRequester = new CredentialRequester(
      identityProofGenerator,
      storage
    );
  }

  public resolveCredentialOffer(opts: { credentialOffer: string }): void {
    const channel = OID4VCIServiceEventChannel.SendCredentialOffer;

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
          payload: error,
        };

        this.eventBus.emit(channel, response);
      });
  }

  public async requestCredentialIssuance(
    resolvedCredentialOffer: ResolvedCredentialOffer,
    userOpts: { credentialTypeKey: string; txCode?: string },
    grantType: GrantType = PRE_AUTHORIZED_GRANT_TYPE
  ): Promise<void> {
    const channel = '';

    this.credentialRequester
      .requestCredentialIssuance(resolvedCredentialOffer, userOpts, grantType)
      .then((result) => {
        const response: ServiceResponse = {
          status: ServiceResponseStatus.Success,
          payload: result,
        };

        this.eventBus.emit(channel, response);
      })
      .catch((error) => {
        const response: ServiceResponse = {
          status: ServiceResponseStatus.Error,
          payload: error,
        };

        this.eventBus.emit(channel, response);
      });
  }
}
