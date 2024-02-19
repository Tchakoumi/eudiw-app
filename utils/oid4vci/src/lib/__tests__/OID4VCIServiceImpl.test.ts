import nock from 'nock';

import { OID4VCIService } from '../OID4VCIService';
import { OID4VCIServiceImpl } from '../OID4VCIServiceImpl';
import { ResolvedCredentialOffer } from '../types';

import {
  authorizationServerMetadataRef1,
  credentialIssuerMetadataRef1,
  credentialOfferObjectRef1,
  jwtIssuerMetadataRef1,
  encodeCredentialOffer,
  nockReplyWithMetadataRef1,
} from '../../core/__tests__/fixtures';

describe('OID4VCIServiceImpl', () => {
  const service: OID4VCIService = new OID4VCIServiceImpl();

  beforeAll(async () => {
    nock.disableNetConnect();
  });

  beforeEach(async () => {
    nock.cleanAll();
  });

  it('should resolve credential offer', async () => {
    const credentialOffer = `?credential_offer=${encodeCredentialOffer(
      credentialOfferObjectRef1
    )}`;

    const scope = nock(credentialOfferObjectRef1.credential_issuer);
    nockReplyWithMetadataRef1(scope);

    const resolved = await service.resolveCredentialOffer(credentialOffer);

    expect(resolved).toEqual({
      credentialOffer: credentialOfferObjectRef1,
      discoveryMetadata: {
        credentialIssuerMetadata: credentialIssuerMetadataRef1,
        authorizationServerMetadata: authorizationServerMetadataRef1,
        jwtIssuerMetadata: jwtIssuerMetadataRef1,
      },
    } as ResolvedCredentialOffer);
  });
});
