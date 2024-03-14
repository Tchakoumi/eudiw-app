import {
  CredentialIssuerMetadata,
  CredentialSupportedSdJwtVc,
} from '@datev/oid4vci';

export interface ICredentialCard {
  type: string;
  issuer: string;
  data: CredentialSupportedSdJwtVc;
}

export interface IVerifiableCredential {
  id: string;
  title: string;
  subtitle: string;
  issuer: string;
  logo: string;
}

export type ISupportedCredential =
  keyof CredentialIssuerMetadata<CredentialSupportedSdJwtVc>['credential_configurations_supported'];

export enum SupportedCredentialTypeFormat {
  VC_SD_JWT = 'vc+sd-jwt',
}
