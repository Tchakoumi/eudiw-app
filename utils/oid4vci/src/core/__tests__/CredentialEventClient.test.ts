import { CredentialEventClient } from '../CredentialEventClient';
import { SdJwtCredentialProcessor } from '../SdJwtCredentialProcessor';

import { SdJwtProcessedCredentialObjRef1, credentialStorage } from './fixtures';

describe('CredentialEventClient', () => {
  const client = new CredentialEventClient(credentialStorage);

  it('should retrieve successfully a credential', async () => {
    const sdJwtCredentialProcessor = new SdJwtCredentialProcessor(
      credentialStorage,
    );

    await sdJwtCredentialProcessor.storeCredential(
      SdJwtProcessedCredentialObjRef1,
    );

    const storedCredential = await client.retrieveCredentialHeaders(
      SdJwtProcessedCredentialObjRef1,
    );
  });
});
