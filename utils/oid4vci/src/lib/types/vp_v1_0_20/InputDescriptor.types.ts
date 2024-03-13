import { OID4VPFormatType } from './Format.types';

export interface InputDescriptor {
  id: string;
  name?: string;
  purpose?: string;
  format?: OID4VPFormatType;
  group?: Array<string>;
  //   issuance?: Array<Issuance>;
  constraints: Constraints;
}

export interface Constraints {
  limit_disclosure?: Optionality;
  statuses?: Statuses;
  fields?: Array<Field>;
  subject_is_issuer?: Optionality;
  //   is_holder?: Array<HolderSubject>;
  //   same_subject?: Array<HolderSubject>;
}

export enum Optionality {
  REQUIRED = 'required',
  PREFERRED = 'preferred',
}

export interface Statuses {
  active?: PdStatus;
  suspended?: PdStatus;
  revoked?: PdStatus;
}
export interface PdStatus {
  directive?: Directives;
}

export type Directives = 'required' | 'allowed' | 'disallowed';

export interface Field {
  id?: string;
  path: Array<string>;
  purpose?: string;
  // filter?: FilterV2;
  predicate?: Optionality;
  name?: string;
}
