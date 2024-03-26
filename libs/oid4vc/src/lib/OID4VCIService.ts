import { EventEmitter } from 'eventemitter3';
import { ConfigClient } from '../core/ConfigClient';
import { CredentialEventClient } from '../core/issuance/CredentialEventClient';
import { CredentialOfferResolver } from '../core/issuance/CredentialOfferResolver';
import { CredentialRequester } from '../core/issuance/CredentialRequester';
import { DBConnection } from '../database/DBConnection';
import { HttpUtil } from '../utils';
import {
  OID4VCIInterface,
  OID4VCIServiceEventChannel,
} from './types/OID4VCIInterface';

import { OID4VCIServiceError } from './errors';
import {
  GrantType,
  ResolvedCredentialOffer,
  ServiceResponse,
  ServiceResponseStatus,
} from './types/issuance';

/**
 * Concrete implementation of the OID4VCI service.
 */
export class OID4VCIService implements OID4VCIInterface {
  private readonly credentialOfferResolver: CredentialOfferResolver;
  private readonly credentialRequester: CredentialRequester;
  private readonly credentialEventClient: CredentialEventClient;

  public constructor(private eventBus: EventEmitter) {
    const configClient = new ConfigClient();
    const httpUtil = new HttpUtil(configClient.getProxyServer());
    const storage = DBConnection.getStorage();

    this.credentialOfferResolver = new CredentialOfferResolver(httpUtil);
    this.credentialEventClient = new CredentialEventClient(storage);

    this.credentialRequester = new CredentialRequester(
      configClient,
      httpUtil,
      storage
    );
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
        if (!result)
          throw new OID4VCIServiceError(
            'No credential found for the provided ID'
          );
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
  public deleteCredential(id: number): void {
    const channel = OID4VCIServiceEventChannel.DeleteCredential;

    this.credentialEventClient
      .deleteCredentialByKey(id)
      .then(() => {
        const response: ServiceResponse = {
          status: ServiceResponseStatus.Success,
          payload: `Credential with key ${id} successfully deleted.`,
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
