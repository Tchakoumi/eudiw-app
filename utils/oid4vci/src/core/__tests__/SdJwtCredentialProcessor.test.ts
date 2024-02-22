import { credentialResponseRef1, jwksRef1, storage } from './fixtures';
import { SdJwtCredentialProcessor } from '../SdJwtCredentialProcessor';

describe('SdJwtCredentialProcessor', () => {
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
