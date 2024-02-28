import { CredentialOfferResolver } from '../core/CredentialOfferResolver';
import { CredentialRequester } from '../core/CredentialRequester';
import { OID4VCIService, OID4VCIServiceEventChannel } from './OID4VCIService';
import { EventEmitter } from 'eventemitter3';
import { StorageFactory } from '@datev/storage';

import {
  CredentialDBSchema,
  IdentityDBSchema,
  credentialStoreName,
  identityStoreName,
} from './schemas';

import {
  ServiceResponse,
  ServiceResponseStatus,
  GrantType,
  ResolvedCredentialOffer,
} from './types';

/**
 * Concrete implementation of the OID4VCI service.
 */
export class OID4VCIServiceImpl implements OID4VCIService {
  private readonly storage: StorageFactory<
    CredentialDBSchema & IdentityDBSchema
  >;

  private readonly credentialOfferResolver: CredentialOfferResolver;
  private readonly credentialRequester: CredentialRequester;

  public constructor(private eventBus: EventEmitter) {
    this.storage = this.initializeStorage();
    this.credentialOfferResolver = new CredentialOfferResolver();
    this.credentialRequester = new CredentialRequester(this.storage);
  }

  private initializeStorage() {
    const dbName = 'OID4VCIServiceStorage';
    const dbVersion = 1;

    const storage = new StorageFactory<CredentialDBSchema & IdentityDBSchema>(
      dbName,
      dbVersion,
      {
        upgrade(db) {
          db.createObjectStore(credentialStoreName, {
            keyPath: 'display.id',
            autoIncrement: true,
          });

          db.createObjectStore(identityStoreName);
        },
      }
    );

    return storage;
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

  public async requestCredentialIssuance(
    resolvedCredentialOffer: ResolvedCredentialOffer,
    userOpts: { credentialTypeKey: string; txCode?: string },
    grantType: GrantType = GrantType.PRE_AUTHORIZED_CODE
  ): Promise<void> {
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
}
