import { RequestObjectResolver } from '../RequestObjectResolver';
import { httpUtil } from './fixtures/ConfigClient.fixtures';
import {
  requestObjectEncodedUri1,
  resolvedRequestObject1,
  requestObjectEncodedUri2,
  resolvedRequestObject2
} from './fixtures/RequestObjectResolver.fixtures';

describe('RequestObjectResolver', () => {
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
