import {
  AssertedUniformCredentialOffer,
  AuthzFlowType,
  CredentialOffer,
  CredentialOfferPayload,
  Grant,
  OpenIDResponse,
  OpenId4VCIVersion,
  UniformCredentialOffer,
  UniformCredentialOfferPayload,
  UniformCredentialOfferRequest,
} from '../types';
import { CredentialOfferPayloadV1_0_11 } from '../types/v1_0_11.types';
import { getJson } from './HttpUtils';

export async function assertedUniformCredentialOffer(
  origCredentialOffer: UniformCredentialOffer,
  opts?: {
    resolve?: boolean;
  },
): Promise<AssertedUniformCredentialOffer> {
  const credentialOffer = JSON.parse(JSON.stringify(origCredentialOffer));
  if (
    credentialOffer.credential_offer_uri &&
    !credentialOffer.credential_offer
  ) {
    if (opts?.resolve === undefined || opts.resolve) {
      credentialOffer.credential_offer = await resolveCredentialOfferURI(
        credentialOffer.credential_offer_uri,
      );
    } else {
      throw Error(
        `No credential_offer present, but we did get a URI, but resolution was explicitly disabled`,
      );
    }
  }
  if (!credentialOffer.credential_offer) {
    throw Error(`No credential_offer present`);
  }
  credentialOffer.credential_offer = await toUniformCredentialOfferPayload(
    credentialOffer.credential_offer,
    { version: credentialOffer.version },
  );
  return credentialOffer as AssertedUniformCredentialOffer;
}

export async function resolveCredentialOfferURI(
  uri?: string,
): Promise<UniformCredentialOfferPayload | undefined> {
  if (!uri) {
    return undefined;
  }
  const response = (await getJson(
    uri,
  )) as OpenIDResponse<UniformCredentialOfferPayload>;
  if (!response || !response.successBody) {
    throw Error(
      `Could not get credential offer from uri: ${uri}: ${JSON.stringify(response?.errorBody)}`,
    );
  }
  return response.successBody as UniformCredentialOfferPayload;
}

export function toUniformCredentialOfferPayload(
  offer: CredentialOfferPayload,
  opts?: {
    version?: OpenId4VCIVersion;
  },
): UniformCredentialOfferPayload {
  // The function now only deals with OpenId4VCIVersion.VER_1_0_11
  const version = opts?.version ?? determineSpecVersionFromOffer(offer);
  if (version !== OpenId4VCIVersion.VER_1_0_11) {
    throw new Error(
      `Unsupported version: ${version}. Only VER_1_0_11 is supported.`,
    );
  }

  // Directly cast the offer to UniformCredentialOfferPayload and return
  const orig = offer as UniformCredentialOfferPayload;
  return {
    ...orig,
  };
}

export function determineSpecVersionFromOffer(
  offer: CredentialOfferPayload | CredentialOffer,
): OpenId4VCIVersion {
  if (isCredentialOfferV1_0_11(offer)) {
    return OpenId4VCIVersion.VER_1_0_11;
  }
  return OpenId4VCIVersion.VER_UNKNOWN;
}

function isCredentialOfferV1_0_11(
  offer: CredentialOfferPayload | CredentialOffer,
): boolean {
  if (!offer) {
    return false;
  }
  if ('credential_issuer' in offer && 'credentials' in offer) {
    // payload
    return true;
  }
  if ('credential_offer' in offer && offer['credential_offer']) {
    // offer, so check payload
    return isCredentialOfferV1_0_11(offer['credential_offer']);
  }
  return 'credential_offer_uri' in offer;
}

export function getIssuerFromCredentialOfferPayload(
  request: CredentialOfferPayload,
): string | undefined {
  // Check if request is valid and not null or undefined
  if (!request) {
    return undefined;
  }

  // Check if 'credential_issuer' is a property of the request and return its value
  if ('credential_issuer' in request) {
    return request.credential_issuer;
  }

  // Return undefined if neither property is found
  return undefined;
}

export async function toUniformCredentialOfferRequest(
  offer: CredentialOffer,
  opts?: {
    resolve?: boolean;
    version?: OpenId4VCIVersion;
  },
): Promise<UniformCredentialOfferRequest> {
  const version = opts?.version ?? determineSpecVersionFromOffer(offer);
  let originalCredentialOffer = offer.credential_offer;
  let credentialOfferURI: string | undefined;
  if (
    'credential_offer_uri' in offer &&
    offer?.credential_offer_uri !== undefined
  ) {
    credentialOfferURI = offer.credential_offer_uri;
    if (opts?.resolve || opts?.resolve === undefined) {
      originalCredentialOffer = (await resolveCredentialOfferURI(
        credentialOfferURI,
      )) as CredentialOfferPayloadV1_0_11;
    } else if (!originalCredentialOffer) {
      throw Error(
        `Credential offer uri (${credentialOfferURI}) found, but resolution was explicitly disabled and credential_offer was supplied`,
      );
    }
  }
  if (!originalCredentialOffer) {
    throw Error('No credential offer available');
  }
  const payload = toUniformCredentialOfferPayload(
    originalCredentialOffer,
    opts,
  );
  const supportedFlows = determineFlowType(payload, version);
  return {
    credential_offer: payload,
    original_credential_offer: originalCredentialOffer,
    ...(credentialOfferURI && { credential_offer_uri: credentialOfferURI }),
    supportedFlows,
    version,
  };
}

export function determineFlowType(
  suppliedOffer: AssertedUniformCredentialOffer | UniformCredentialOfferPayload,
  version: OpenId4VCIVersion,
): AuthzFlowType[] {
  const payload: UniformCredentialOfferPayload =
    getCredentialOfferPayload(suppliedOffer);
  const supportedFlows: AuthzFlowType[] = [];
  if (payload.grants?.authorization_code) {
    supportedFlows.push(AuthzFlowType.AUTHORIZATION_CODE_FLOW);
  }
  if (
    payload.grants?.['urn:ietf:params:oauth:grant-type:pre-authorized_code']?.[
      'pre-authorized_code'
    ]
  ) {
    supportedFlows.push(AuthzFlowType.PRE_AUTHORIZED_CODE_FLOW);
  }
  if (supportedFlows.length === 0 && version < OpenId4VCIVersion.VER_1_0_09) {
    // auth flow without op_state was possible in v08. The only way to know is that the detections would result in finding nothing.
    supportedFlows.push(AuthzFlowType.AUTHORIZATION_CODE_FLOW);
  }
  return supportedFlows;
}

export function getCredentialOfferPayload(
  offer: AssertedUniformCredentialOffer | UniformCredentialOfferPayload,
): UniformCredentialOfferPayload {
  let payload: UniformCredentialOfferPayload;
  if ('credential_offer' in offer && offer['credential_offer']) {
    payload = offer.credential_offer;
  } else {
    payload = offer as UniformCredentialOfferPayload;
  }
  return payload;
}
