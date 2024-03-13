import {
  CredentialIssuerMetadata,
  CredentialSupportedSdJwtVc,
  DisplayCredential,
} from '@datev/oid4vci';

export interface ICredentialCard {
  type: string;
  issuer: string;
  data: CredentialSupportedSdJwtVc;
}

export type IVerifiableCredential = Omit<DisplayCredential, 'claims'>;

export type ISupportedCredential =
  keyof CredentialIssuerMetadata<CredentialSupportedSdJwtVc>['credential_configurations_supported'];

export enum SupportedCredentialTypeFormat {
  VC_SD_JWT = 'vc+sd-jwt',
}

export interface IVerifiableCredentialDetails extends IVerifiableCredential {
  claims: IVcData;
}

export type IDisplayClaimValues = Record<string, boolean>;
export type IVcData = Record<string, string>;
