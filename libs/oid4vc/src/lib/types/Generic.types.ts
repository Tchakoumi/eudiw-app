export interface ErrorResponse extends Response {
  error: string;
  error_description?: string;
  error_uri?: string;
  state?: string;
}

export enum OID4VCServiceEventChannel {
  ResolveOID4VCUri = 'resolve-oid4vc-uri',
  PresentationWorking = 'presentation -working'
}
