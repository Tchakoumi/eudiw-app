export enum OID4VCServiceEventChannel {
  DeriveOID4VCFlow = 'derive-oid4vc-flow',
}

export enum OID4VCFlow {
  Issuance = 'issuance',
  Presentation = 'presentation',
}

export interface IDeriveOID4VCFlow {
  encodedUri: string;
  flow: OID4VCFlow;
}
