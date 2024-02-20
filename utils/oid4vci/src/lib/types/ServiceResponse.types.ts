export interface ServiceResponse {
  status: 'success' | 'error';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}
