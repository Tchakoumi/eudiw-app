import { OpenId4VCIVersion } from './OpenID4VCIVersions.types';

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

export type SearchValue = {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  [Symbol.replace](
    string: string,
    replacer: (substring: string, ...args: any[]) => string,
  ): string;
};
