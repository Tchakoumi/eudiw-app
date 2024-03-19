import { RequestObjectResolver } from '../core/presentation';
import { HttpUtil } from '../utils';
import { OID4VPInterface, ResolvedRequestObject } from './types';

export class OID4VPService implements OID4VPInterface {
  private requestObjetResolver: RequestObjectResolver;

  constructor(httpUtil: HttpUtil) {
    this.requestObjetResolver = new RequestObjectResolver(httpUtil);
  }

  resolveRequestObject(
    requestObjectUri: string
  ): Promise<ResolvedRequestObject> {
    return this.requestObjetResolver.resolveRequestObject(requestObjectUri);
  }
}
