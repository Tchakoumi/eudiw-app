export interface FilterBase {
  type: string;
}

export interface Filter extends FilterBase {
  const?: OneOfNumberString;
  enum?: Array<OneOfNumberString>;
  exclusiveMinimum?: OneOfNumberString;
  exclusiveMaximum?: OneOfNumberString;
  format?: string;
  formatMaximum?: string;
  formatMinimum?: string;
  formatExclusiveMaximum?: string;
  formatExclusiveMinimum?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: OneOfNumberString;
  maximum?: OneOfNumberString;
  not?: object;
  pattern?: string;
  contains?: Omit<Filter, 'type'> & Partial<FilterBase>;
  items?: Filter;
}

export type OneOfNumberString = string | number;
