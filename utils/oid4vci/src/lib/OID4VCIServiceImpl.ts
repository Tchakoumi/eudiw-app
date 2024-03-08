import serviceConfig from '../config.json';

import { EventEmitter } from 'eventemitter3';
import { ConfigClient } from '../core/ConfigClient';
import { CredentialOfferResolver } from '../core/CredentialOfferResolver';
import { CredentialRequester } from '../core/CredentialRequester';
import { OID4VCIService, OID4VCIServiceEventChannel } from './OID4VCIService';

import {
  GrantType,
  ResolvedCredentialOffer,
  ServiceResponse,
  ServiceResponseStatus,
} from './types';
import { CredentialEventClient } from '../core/CredentialEventClient';
import { DBConnection } from '../database/DBConnection';

/**
 * Concrete implementation of the OID4VCI service.
 */
export class OID4VCIServiceImpl implements OID4VCIService {
  private readonly credentialOfferResolver: CredentialOfferResolver;
  private readonly credentialRequester: CredentialRequester;
  private readonly credentialEventClient: CredentialEventClient;

  public constructor(private eventBus: EventEmitter) {
    const configClient = new ConfigClient(serviceConfig);
    const storage = DBConnection.getStorage();

    this.credentialOfferResolver = new CredentialOfferResolver();
    this.credentialEventClient = new CredentialEventClient(storage);
    this.credentialRequester = new CredentialRequester(configClient, storage);
  }

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
          payload: error.toString(),
        };

        this.eventBus.emit(channel, response);
      });
  }

  public requestCredentialIssuance(
    resolvedCredentialOffer: ResolvedCredentialOffer,
    userOpts: { credentialTypeKey: string; txCode?: string },
    grantType: GrantType = GrantType.PRE_AUTHORIZED_CODE
  ): void {
    const channel = OID4VCIServiceEventChannel.CredentialProposition;

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
          payload: error.toString(),
        };

        this.eventBus.emit(channel, response);
      });
  }

  public retrieveCredentialHeaders(): void {
    const channel = OID4VCIServiceEventChannel.RetrieveCredentialHeaders;

    this.credentialEventClient
      .retrieveCredentialHeaders()
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
          payload: error.toString(),
        };

        this.eventBus.emit(channel, response);
      });
  }

  public retrieveCredentialDetails(id: number): void {
    const channel = OID4VCIServiceEventChannel.RetrieveCredentialDetails;

    this.credentialEventClient
      .retrieveCredentialDetails(id)
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
          payload: error.toString(),
        };

        this.eventBus.emit(channel, response);
      });
  }

  /**
   * Attempts to delete a credential and emits the result to an event channel.
   * @param key The key of the credential to delete.
   */
  public deleteCredentialAndEmitResult(key: IDBValidKey): void {
    const channel = OID4VCIServiceEventChannel.DeleteCredential;

    this.credentialEventClient
      .deleteCredentialByKey(key)
      .then(() => {
        const response: ServiceResponse = {
          status: ServiceResponseStatus.Success,
          payload: `Credential with key ${key} successfully deleted.`,
        };
        this.eventBus.emit(channel, response);
      })
      .catch((error) => {
        const response: ServiceResponse = {
          status: ServiceResponseStatus.Error,
          payload: error.toString(),
        };
        this.eventBus.emit(channel, response);
      });
  }
}
