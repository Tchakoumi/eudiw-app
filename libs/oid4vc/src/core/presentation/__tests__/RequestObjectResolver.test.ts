import { HttpUtil } from '../../../utils/HttpUtil';
import { RequestObjectResolver } from '../RequestObjectResolver';
import {
  requestObjectEncodedUri1,
  requestObjectEncodedUri2,
  resolvedRequestObject1,
  resolvedRequestObject2,
} from './fixtures/RequestObjectResolver.fixtures';

describe('RequestObjectResolver', () => {
  const httpUtil = new HttpUtil();
  const requestObjectResolver = new RequestObjectResolver(httpUtil);

  it('should successfully parsed request object from verifier.ssi.tir.budru.de', async () => {
    const requestObject = await requestObjectResolver.resolveRequestObject(
      requestObjectEncodedUri1
    );

    expect(requestObject).toStrictEqual(resolvedRequestObject1);
  });

  it('should successfully parsed request object from verifier.portal.walt.id', async () => {
    const requestObject = await requestObjectResolver.resolveRequestObject(
      requestObjectEncodedUri2
    );

    expect(requestObject).toStrictEqual(resolvedRequestObject2);
  });
});
