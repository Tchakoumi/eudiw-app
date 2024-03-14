export interface SubmissionRequirement {
  name?: string;
  purpose?: string;
  rule: Rules;
  count?: number;
  min?: number;
  max?: number;
  from?: string;
  from_nested?: Array<SubmissionRequirement>;
}

export enum Rules {
  ALL = 'all',
  PICK = 'Pick',
}
