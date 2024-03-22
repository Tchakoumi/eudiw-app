import nock from 'nock';

import { eventBus } from '@datev/event-bus';
import {
  credentialOfferObjectRef1,
  discoveryMetadataRef1,
  encodeCredentialOffer,
  nockReplyWithMetadataRef1,
} from '../../core/issuance/__tests__/fixtures';
import { OID4VCService } from '../OID4VCService';
import { OID4VCIServiceEventChannel } from '../types/OID4VCIInterface';
import { ServiceResponseStatus } from '../types/issuance';

describe('OID4VCService', () => {
  const oid4vc = new OID4VCService(eventBus);

  it('should not resolve OID4VC URI without query params', () => {
    const requestObject = `oid4vp://?`;

    expect(() => oid4vc.resolveOID4VCUri(requestObject)).toThrow(
      'oid4vc uri is missing query params'
    );
  });

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

  it('should not resolve OID4VC URI to request object', () => {
    const requestObject = `oid4vp://?presentation_definition_uri=https%3A%2F%2Fverifier.portal.walt.id%2Fopenid4vc%2Fpd%2FiSt3KOTJtnS`;

    expect(() => oid4vc.resolveOID4VCUri(requestObject)).toThrow(
      'oid4vp is not supported yet'
    );
  });

  it('should throw invalid oid4vc uri', () => {
    const requestObject = `oid4vp://?client_id=`;

    expect(() => oid4vc.resolveOID4VCUri(requestObject)).toThrow(
      'unsupported or invalid oid4vc uri'
    );
  });
});
