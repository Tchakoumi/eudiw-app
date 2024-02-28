export enum ServiceResponseStatus {
  Success = 'success',
  Error = 'error',
}

export interface ServiceResponse {
  status: ServiceResponseStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}
