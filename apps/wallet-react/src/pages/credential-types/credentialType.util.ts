import {
  CredentialIssuerMetadata,
  CredentialSubjectDisplay,
  CredentialSupportedSdJwtVc,
  IssuerCredentialSubject,
} from '@datev/oid4vci';
import {
  ICredentialCard,
  ISupportedCredential,
} from '../../components/credential-types/credentials.types';
import { removeUnderscoresFromWord } from '../../utils/common';

export enum SupportedCredentialTypeFormat {
  VC_SD_JWT = 'vc+sd-jwt',
}

/**
 * This function helps to get the selected credential type's
 * claims in the prefered locale.
 *
 * If the provided preferred locale is found, it'll return it's value
 * else it'll use the value of the the first element of display
 * if the claim has no display, then it'll remove underscores from
 * the claim and return as value for display
 *
 * @param {IssuerCredentialSubject} claims - the different claims present in the credential type
 * @param {string} preferredLocale - the desired language in which we want the claims to be presented
 * @returns {string[]} - a list of all claims in preferred locale
 */
function getVCClaimsInPreferredLocale(
  claims: IssuerCredentialSubject,
  preferredLocale: string
): string[] {
  const claimKeysInPreferredLocals: string[] = [];
  for (const claimKey in claims) {
    const claim = claims[claimKey] as CredentialSubjectDisplay;
    if (claim.display && claim.display.length > 0) {
      const claimInPreferredLocale = claim.display.find(
        ({ locale }) => locale === preferredLocale
      );
      // if preferred locale is found, then retun the name in that locale
      if (claimInPreferredLocale)
        claimKeysInPreferredLocals.push(claimInPreferredLocale.name ?? 'N/A');
      //if preferred local is not found, just return the name on first element in display list
      else claimKeysInPreferredLocals.push(claim.display[0].name ?? 'N/A');
    } else
      claimKeysInPreferredLocals.push(
        removeUnderscoresFromWord(claimKey as string)
      );
  }
  return claimKeysInPreferredLocals;
}

/**
 * Gets all credential types of vc+sd-jwt format, adding to it the issuer and it's credential type
 *
 * @param {CredentialIssuerMetadata} issuer_metadata - the provided metadata from issuer
 * @returns {ICredentialCard} - the metadata credential configurations supported, type and issuer of every supported type
 */
export function getVCSDJWTOffers(
  issuer_metadata: CredentialIssuerMetadata<CredentialSupportedSdJwtVc>
): ICredentialCard[] {
  const credentialOfferTypeKeys = Object.keys(
    issuer_metadata.credential_configurations_supported
  ) as ISupportedCredential[];

  const vcSdJwtTypeKeys = credentialOfferTypeKeys.filter(
    (credentialType) =>
      issuer_metadata.credential_configurations_supported[credentialType]
        .format === SupportedCredentialTypeFormat.VC_SD_JWT
  );
  return vcSdJwtTypeKeys.map((credentialOfferTypeKey) => {
    return {
      type: credentialOfferTypeKey,
      issuer: issuer_metadata.credential_issuer,
      data: issuer_metadata.credential_configurations_supported[
        credentialOfferTypeKey
      ],
    };
  }) as ICredentialCard[];
}

/**
 * Serves as guard to get the claims in preferred locale.
 * verifies that provided selectedCredential exists, then moves on to get claims in provided locale.
 * if it doesn't exist, it returns and empty array
 *
 * @param {ISupportedCredential} selectedCredential - the credential type's key who's claims we want
 * @param {typeof ResolvedCredentialOffer} credentialIssuerMetadata - the provided metadata from issuer
 * @param {string} preferredLocale - the desired language in which we want the claims to be presented
 * @returns {string[]} - the list of claims to display
 */
export function getVCClaims(
  selectedCredential: ISupportedCredential,
  credentialIssuerMetadata: CredentialIssuerMetadata<CredentialSupportedSdJwtVc>,
  preferredLocale: string
): string[] {
  const offeredCredentialTypeKeys = Object.keys(
    credentialIssuerMetadata.credential_configurations_supported
  ) as ISupportedCredential[];

  if (offeredCredentialTypeKeys.includes(selectedCredential)) {
    const selectedOfferClaims =
      credentialIssuerMetadata.credential_configurations_supported[
        selectedCredential
      ].claims;

    return getVCClaimsInPreferredLocale(
      selectedOfferClaims as IssuerCredentialSubject,
      preferredLocale
    );
  }
  return [];
}
