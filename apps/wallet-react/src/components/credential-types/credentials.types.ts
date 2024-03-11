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
  issuer: string;
  logo: string;
  issued_at: number;
}

export type ISupportedCredential =
  keyof CredentialIssuerMetadata<CredentialSupportedSdJwtVc>['credential_configurations_supported'];
