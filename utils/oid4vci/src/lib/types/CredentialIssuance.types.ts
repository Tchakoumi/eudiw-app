import { OpenId4VCIVersion } from './OpenID4VCIVersions.types';
import {
  CredentialOfferPayloadV1_0_11,
  CredentialOfferV1_0_11,
} from './v1_0_11.types';

export type EncodeJsonAsURIOpts = {
  uriTypeProperties?: string[];
  arrayTypeProperties?: string[];
  baseUrl?: string;
  param?: string;
  mode?: JsonURIMode;
  version?: OpenId4VCIVersion;
};

export enum JsonURIMode {
  JSON_STRINGIFY,
  X_FORM_WWW_URLENCODED,
}

export type CredentialOfferPayload = CredentialOfferPayloadV1_0_11;

export type CredentialOffer = CredentialOfferV1_0_11;

export type SearchValue = {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  [Symbol.replace](
    string: string,
    replacer: (substring: string, ...args: any[]) => string,
  ): string;
};
