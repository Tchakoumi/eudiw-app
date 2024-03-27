import { StorageFactory } from '@datev/storage';
import {
  OID4VCIServiceDBSchema,
  credentialStoreName,
} from '../../database/schema';
import { OID4VCIServiceError } from '../../lib/errors';
import { PresentationError } from '../../lib/errors/Presentation.errors';
import {
  PresentationExchange,
  SdJwtProcessedCredential,
} from '../../lib/types';
import { HttpUtil } from '../../utils';
import { InputDescriptorHandler } from './InputDescriptorHandler';
import { RequestObjectResolver } from './RequestObjectResolver';

/**
 * This class is responsible for implementing the DIF Presentation Exchange
 * https://identity.foundation/presentation-exchange/spec/v2.0.0/
 * Handles the flow of demand and submission of proofs from a Holder to a Verifier.
 */
export class DIFPresentationExchangeService {
  private readonly requestObjectResolver: RequestObjectResolver;
  private readonly inputDescriptorHandler: InputDescriptorHandler;

  /**
   * DIF.PEX Constructor.
   * @param httpUtil
   * @param storage
   */
  public constructor(
    private storage: StorageFactory<OID4VCIServiceDBSchema>,
    httpUtil: HttpUtil
  ) {
    this.inputDescriptorHandler = new InputDescriptorHandler();
    this.requestObjectResolver = new RequestObjectResolver(httpUtil);
  }

  async processRequestObject(requestObjectUri: string) {
    const resolvedRequestObject =
      await this.requestObjectResolver.resolveRequestObject(requestObjectUri);

    const results = await this.storage.findAll(credentialStoreName);
    const credentials = results.map((_) => _.value as SdJwtProcessedCredential);

    const {
      presentation_definition: {
        input_descriptors: inputDescriptors,
        submission_requirements,
      },
    } = resolvedRequestObject;

    if (!inputDescriptors.length) {
      throw new OID4VCIServiceError(PresentationError.MissingRequiredParams);
    }

    if (submission_requirements) {
      throw new OID4VCIServiceError(
        PresentationError.UnsupportedSubmissionRequirements
      );
    }
    const matchingCredentials = await this.inputDescriptorHandler.handle(
      inputDescriptors,
      credentials
    );

    const presentationExchange: PresentationExchange = {
      resolvedRequestObject,
      matchingCredentials,
    };

    return presentationExchange;
  }
}
