import { eventBus } from '@datev/event-bus';
import { OID4VCIServiceEventChannel } from '@datev/oid4vci';
import { Box } from '@mui/material';
import Scrollbars from 'rc-scrollbars';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CredentialTypeCard from '../../components/credential-types/CredentialTypeCard';
import CredentialTypeDetails from '../../components/credential-types/CredentialTypeDetails';
import {
  CredentialIssuerMetadata,
  CredentialOfferResponse,
  CredentialOfferResponsePayload,
  ICredentialCard,
  VCSDJWTClaim,
} from '../../components/credential-types/credentials.types';
import BackTitleBar from '../../components/layout/BackTitleBar';
import Footer from '../../components/layout/Footer';
import { removeUnderscoresFromWord } from '../../utils/common';

export default function CredentialTypes() {
  const push = useNavigate();

  const [resolvedCredentialOffer, setResolvedCredentialOffer] =
    useState<CredentialOfferResponsePayload>();

  useEffect(() => {
    eventBus.once(
      OID4VCIServiceEventChannel.ProcessCredentialOffer,
      (data: CredentialOfferResponse) => {
        setResolvedCredentialOffer(data.payload);
      }
    );
  }, []);

  type ISupportedCredential =
    keyof CredentialIssuerMetadata['credential_configurations_supported'];

  /**
   * This function helps to get the selected credential type's
   * claims in the prefered locale.
   *
   * If the provided preferred locale is found, it'll return it's value
   * else it'll use the value of the the first element of display
   * if the claim has no display, then it'll remove underscores from
   * the claim and return as value for display
   *
   * @param {VCSDJWTClaim} claims - the different claims present in the credential type
   * @param {string} preferredLocale - the desired language in which we want the claims to be presented
   * @returns {string[]} - a list of all claims in preferred locale
   */
  function getVCClaimsInPreferredLocale(
    claims: VCSDJWTClaim,
    preferredLocale: string
  ): string[] {
    const claimKeys = Object.keys(claims) as (keyof typeof claims)[];

    const claimKeysInPreferredLocal = claimKeys.map((claimKey) => {
      if (claims[claimKey].display.length > 0) {
        const claimInPreferredLocale = claims[claimKey].display.find(
          ({ locale }) => locale === preferredLocale
        );
        // if preferred locale is found, then retun the name in that locale
        if (claimInPreferredLocale) return claimInPreferredLocale.name;
        //if preferred local is not found, just return the name on first element in display list
        return claims[claimKey].display[0].name;
      }
      // if the display list is empty return the cleanedup key
      return removeUnderscoresFromWord(claimKey as string);
    });
    return claimKeysInPreferredLocal;
  }

  /**
   * Gets all credential types of vc+sd-jwt format, adding to it the issuer and it's credential type
   *
   * @param {CredentialIssuerMetadata} issuer_metadata - the provided metadata from issuer
   * @returns {ICredentialCard} - the metadata credential configurations supported, type and issuer of every supported type
   */
  function getVCSDJWTOffers(
    issuer_metadata: CredentialIssuerMetadata
  ): ICredentialCard[] {
    const credentialOfferTypeKeys = Object.keys(
      issuer_metadata.credential_configurations_supported
    ) as ISupportedCredential[];

    const vcSdJwtTypeKeys = credentialOfferTypeKeys.filter(
      (credentialType) =>
        issuer_metadata.credential_configurations_supported[credentialType]
          .format === 'vc+sd-jwt'
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
  function getVCClaims(
    selectedCredential: ISupportedCredential,
    credentialIssuerMetadata: CredentialIssuerMetadata,
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
        selectedOfferClaims as VCSDJWTClaim,
        preferredLocale
      );
    }
    return [];
  }

  const [selectedCredentialType, setSelectedCredentialType] =
    useState<ICredentialCard>();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        height: '100%',
      }}
    >
      {resolvedCredentialOffer && (
        <CredentialTypeDetails
          closeDialog={() => setSelectedCredentialType(undefined)}
          isDialogOpen={!!selectedCredentialType}
          selectedCredentialType={selectedCredentialType}
          credntialTypeClaims={getVCClaims(
            selectedCredentialType?.type as ISupportedCredential,
            resolvedCredentialOffer.discoveryMetadata.credentialIssuerMetadata,
            'en'
          )}
          resolvedCredentialOfferPayload={resolvedCredentialOffer}
        />
      )}
      <BackTitleBar pageTitle="Credential Types" onBack={() => push('/scan')} />
      <Box
        sx={{
          backgroundColor: '#F6F7F9',
          height: '100%',
        }}
      >
        <Scrollbars universal autoHide>
          <Box
            sx={{
              display: 'grid',
              gridTemplateRows: 'auto auto 1fr',
              rowGap: 1,
              padding: '12px',
            }}
          >
            {resolvedCredentialOffer &&
              getVCSDJWTOffers(
                resolvedCredentialOffer.discoveryMetadata
                  .credentialIssuerMetadata
              ).map((card, index) => {
                const {
                  type,
                  issuer,
                  data: { display },
                } = card;
                return (
                  <CredentialTypeCard
                    key={index}
                    displayName={display ? display[0].name : ''}
                    issuer={issuer}
                    type={type}
                    selectCredentialType={() =>
                      setSelectedCredentialType((prevCard) =>
                        prevCard && prevCard.type === card.type
                          ? undefined
                          : card
                      )
                    }
                  />
                );
              })}
          </Box>
        </Scrollbars>
      </Box>
      <Footer showArrow={false} />
    </Box>
  );
}
