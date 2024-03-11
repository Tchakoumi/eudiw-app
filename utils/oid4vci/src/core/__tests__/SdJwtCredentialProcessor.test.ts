import { DBConnection } from '../../database/DBConnection';
import { SdJwtCredentialProcessor } from '../SdJwtCredentialProcessor';
import { credentialResponseRef1, jwksRef1 } from './fixtures';

describe('SdJwtCredentialProcessor', () => {
  const storage = DBConnection.getStorage();
  const processor = new SdJwtCredentialProcessor(storage);

  it('should process credentials even with no claims', async () => {
    const credential = credentialResponseRef1.credential.split('~', 2)[0];
    const verifyingKeys = jwksRef1.keys;

    const processed = await processor.processCredential(
      credential,
      verifyingKeys
    );

    expect(processed.display.claims).toEqual({});
  });
});
