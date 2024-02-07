import { AuthzFlowType } from './Authorization.types';
import { Grant } from './Generic.types';
import { OpenId4VCIVersion } from './OpenID4VCIVersions.types';
import {
  CredentialOfferPayloadV1_0_11,
  CredentialOfferV1_0_11,
} from './v1_0_11.types';

export interface UniformCredentialOffer {
  credential_offer?: UniformCredentialOfferPayload;
  credential_offer_uri?: string;
}

export type UniformCredentialOfferPayload = CredentialOfferPayloadV1_0_11;

export type EncodeJsonAsURIOpts = {
  uriTypeProperties?: string[];
  arrayTypeProperties?: string[];
  baseUrl?: string;
  param?: string;
  mode?: JsonURIMode;
  version?: OpenId4VCIVersion;
};

export interface AssertedUniformCredentialOffer extends UniformCredentialOffer {
  credential_offer: UniformCredentialOfferPayload;
}

export enum JsonURIMode {
  JSON_STRINGIFY,
  X_FORM_WWW_URLENCODED,
}

export type CredentialOfferPayload = CredentialOfferPayloadV1_0_11;

export type CredentialOffer = CredentialOfferV1_0_11;

export interface UniformCredentialOfferRequest
  extends AssertedUniformCredentialOffer {
  original_credential_offer: CredentialOfferPayload;
  version: OpenId4VCIVersion;
  supportedFlows: AuthzFlowType[];
}

export interface CredentialOfferRequestWithBaseUrl
  extends UniformCredentialOfferRequest {
  scheme: string;
  baseUrl: string;
  userPinRequired: boolean;
  issuerState?: string;
  preAuthorizedCode?: string;
}

export type SearchValue = {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  [Symbol.replace](
    string: string,
    replacer: (substring: string, ...args: any[]) => string,
  ): string;
};
