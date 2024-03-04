import { credentialStoreName } from '../../schema';
import { CredentialEventClient } from '../CredentialEventClient';
import { SdJwtCredentialProcessor } from '../SdJwtCredentialProcessor';

import {
  credentialHeaderObjRef1,
  credentialHeaderObjRef2,
  sdJwtProcessedCredentialObjRef1,
  sdJwtProcessedCredentialObjRef2,
  storage,
} from './fixtures';

describe('CredentialEventClient', () => {
  const client = new CredentialEventClient(storage);

  afterEach(async () => {
    storage.clear(credentialStoreName);
  });

  it('should retrieve successfully one credential headers', async () => {
    const sdJwtCredentialProcessor = new SdJwtCredentialProcessor(storage);

    await sdJwtCredentialProcessor.storeCredential(
      sdJwtProcessedCredentialObjRef1
    );

    const credentialHeaders = await client.retrieveCredentialHeaders();

    expect(credentialHeaders).toEqual(credentialHeaderObjRef2);
    expect(credentialHeaders).toHaveLength(1);
    expect(credentialHeaders).not.toHaveProperty('claims');
  });

  it('should retrieve successfully two credential headers', async () => {
    const sdJwtCredentialProcessor = new SdJwtCredentialProcessor(storage);

    await sdJwtCredentialProcessor.storeCredential(
      sdJwtProcessedCredentialObjRef1
    );

    await sdJwtCredentialProcessor.storeCredential(
      sdJwtProcessedCredentialObjRef2
    );

    const credentialHeaders = await client.retrieveCredentialHeaders();

    expect(credentialHeaders).toEqual(credentialHeaderObjRef1);
    expect(credentialHeaders).toHaveLength(2);
  });

  it('should retrieve successfully an empty object', async () => {
    const credentialHeaders = await client.retrieveCredentialHeaders();

    expect(credentialHeaders).toEqual([]);
    expect(credentialHeaders).toHaveLength(0);
  });
});
