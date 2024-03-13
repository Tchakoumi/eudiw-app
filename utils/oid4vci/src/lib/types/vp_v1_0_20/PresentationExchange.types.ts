import { OID4VPFormatType } from './Format.types';
import { InputDescriptor } from './InputDescriptor.types';
import { SubmissionRequirement } from './SubmissionRequirement.types';

export interface PresentationDefinition {
  id: string;
  name?: string;
  purpose?: string;
  format?: OID4VPFormatType;
  submission_requirements?: Array<SubmissionRequirement>;
  input_descriptors: Array<InputDescriptor>;
  frame?: object;
}
