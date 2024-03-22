import { eventBus } from '@datev/event-bus';
import { OID4VCService } from '../OID4VCService';
import {
  credentialOfferObjectRef1,
  discoveryMetadataRef1,
  encodeCredentialOffer,
  nockReplyWithMetadataRef1,
} from '../../core/issuance/__tests__/fixtures';
import { OID4VCIServiceEventChannel } from '../types/OID4VCIInterface';
import { ServiceResponseStatus } from '../types/issuance';

import nock from 'nock';

describe('OID4VCService', () => {
  const oid4vc = new OID4VCService(eventBus);

  it('should resolve OID4VC URI to credential offer', async () => {
    const credentialOffer = `oid4vci://?credential_offer=${encodeCredentialOffer(
      credentialOfferObjectRef1
    )}`;

    const scope = nock(/./);
    nockReplyWithMetadataRef1(scope);

    const callback = jest.fn(() => {
      eventBus.emit('complete');
    });

    eventBus.on(OID4VCIServiceEventChannel.ProcessCredentialOffer, callback);
    oid4vc.resolveOID4VCUri(credentialOffer);

    // Wait for callback completion
    await new Promise((resolve) => {
      eventBus.once('complete', resolve);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      status: ServiceResponseStatus.Success,
      payload: {
        credentialOffer: credentialOfferObjectRef1,
        discoveryMetadata: discoveryMetadataRef1,
      },
    });
  });
});
