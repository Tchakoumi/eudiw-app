import { VPFormat } from '../Format.types';
import { DescriptorMap } from './DescriptorMap.types';
import { InputDescriptor } from './InputDescriptor.types';
import { SubmissionRequirement } from './SubmissionRequirement.types';

export interface PresentationDefinition {
  id: string;
  name?: string;
  purpose?: string;
  format?: VPFormat;
  submission_requirements?: Array<SubmissionRequirement>;
  input_descriptors: Array<InputDescriptor>;
  frame?: object;
}

export interface PresentationSubmission {
  id: string;
  definition_id: string;
  descriptor_map: Array<DescriptorMap>;
}

