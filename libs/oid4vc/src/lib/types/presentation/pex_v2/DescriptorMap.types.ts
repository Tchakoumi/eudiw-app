import { VPFormat } from '../Format.types';

export interface DescriptorMap {
  id: string;
  path: string;
  format: VPFormat;
  path_nested?: DescriptorMap;
}
