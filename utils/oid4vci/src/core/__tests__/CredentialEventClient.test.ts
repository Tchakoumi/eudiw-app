import { CredentialEventClient } from '../CredentialEventClient';
import { SdJwtCredentialProcessor } from '../SdJwtCredentialProcessor';

import {
  SdJwtProcessedCredentialObjRef1,
  SdJwtProcessedCredentialObjRef2,
  credentialStorage,
} from './fixtures';

describe('CredentialEventClient', () => {
  const client = new CredentialEventClient(credentialStorage);

  it('should retrieve successfully a credential', async () => {
    const sdJwtCredentialProcessor = new SdJwtCredentialProcessor(
      credentialStorage,
    );

    await sdJwtCredentialProcessor.storeCredential(
      SdJwtProcessedCredentialObjRef1,
    );

    await sdJwtCredentialProcessor.storeCredential(
      SdJwtProcessedCredentialObjRef2,
    );

    const credentialHeaders = await client.retrieveCredentialHeaders();

    console.log(credentialHeaders);
  });
});
