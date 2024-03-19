import { RequestObjectResolver } from '../core/presentation';
import { HttpUtil } from '../utils';
import { OID4VPInterface } from './types';

export class OID4VPService implements OID4VPInterface {
  private requestObjetResolver: RequestObjectResolver;

  constructor(httpUtil: HttpUtil) {
    this.requestObjetResolver = new RequestObjectResolver(httpUtil);
  }

  async resolveRequestObject(requestObjectUri: string) {
    const requestObject = await this.requestObjetResolver.resolveRequestObject(
      requestObjectUri
    );
  }
}
