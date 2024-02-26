import { Box } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CredentialOfferDetails from '../../components/credential-offer/CredentialOfferDetails';
import CredentialTypeCard from '../../components/credential-offer/CredentialTypeCard';
import {
  Claims,
  ICredentialCard,
} from '../../components/credential-offer/credentials.types';
import BackTitleBar from '../../components/layout/BackTitleBar';
import Footer from '../../components/layout/Footer';
import { removeUnderscoresFromWord } from '../../utils/common';

export default function CredentialTypes() {
  const push = useNavigate();
  /*TODO: the CREDENTIAL_ISSUER_METADATA is to be removed during the integration
  at this point, we'll listen to the event that'll be emitted from the /scan route
  and use the data found in there as the credential offer.
   */
  const CREDENTIAL_ISSUER_METADATA = {
    credential_issuer: 'https://trial.authlete.net',
    credential_endpoint: 'https://trial.authlete.net/api/credential',
    batch_credential_endpoint:
      'https://trial.authlete.net/api/batch_credential',
    deferred_credential_endpoint:
      'https://trial.authlete.net/api/deferred_credential',
    credential_response_encryption: {
      alg_values_supported: [
        'RSA1_5',
        'RSA-OAEP',
        'RSA-OAEP-256',
        'ECDH-ES',
        'ECDH-ES+A128KW',
        'ECDH-ES+A192KW',
        'ECDH-ES+A256KW',
      ],
      enc_values_supported: [
        'A128CBC-HS256',
        'A192CBC-HS384',
        'A256CBC-HS512',
        'A128GCM',
        'A192GCM',
        'A256GCM',
      ],
      encryption_required: false,
    },
    credential_configurations_supported: {
      'org.iso.18013.5.1.mDL': {
        format: 'mso_mdoc',
        doctype: 'org.iso.18013.5.1.mDL',
        claims: {
          'org.iso.18013.5.1': {
            family_name: {},
            given_name: {},
            birth_date: {},
            issue_date: {},
            expiry_date: {},
            issuing_country: {},
            issuing_authority: {},
            document_number: {},
            portrait: {},
            driving_privileges: {},
            un_distinguishing_sign: {},
            administrative_number: {},
            sex: {},
            height: {},
            weight: {},
            eye_colour: {},
            hair_colour: {},
            birth_place: {},
            resident_address: {},
            portrait_capture_date: {},
            age_in_years: {},
            age_birth_year: {},
            issuing_jurisdiction: {},
            nationality: {},
            resident_city: {},
            resident_state: {},
            resident_postal_code: {},
            resident_country: {},
            family_name_national_character: {},
            given_name_national_character: {},
            signature_usual_mark: {},
          },
        },
        scope: 'org.iso.18013.5.1.mDL',
      },
      IdentityCredential: {
        format: 'vc+sd-jwt',
        vct: 'https://credentials.example.com/identity_credential',
        claims: {
          given_name: {
            display: [
              {
                name: 'الاسم الشخصي',
                locale: 'ar',
              },
              {
                name: 'Vorname',
                locale: 'de',
              },
              {
                name: 'Given Name',
                locale: 'en',
              },
              {
                name: 'Nombre',
                locale: 'es',
              },
              {
                name: 'نام',
                locale: 'fa',
              },
              {
                name: 'Etunimi',
                locale: 'fi',
              },
              {
                name: 'Prénom',
                locale: 'fr',
              },
              {
                name: 'पहचानी गई नाम',
                locale: 'hi',
              },
              {
                name: 'Nome',
                locale: 'it',
              },
              {
                name: '名',
                locale: 'ja',
              },
              {
                name: 'Овог нэр',
                locale: 'mn',
              },
              {
                name: 'Voornaam',
                locale: 'nl',
              },
              {
                name: 'Nome Próprio',
                locale: 'pt',
              },
              {
                name: 'Förnamn',
                locale: 'sv',
              },
              {
                name: 'مسلمان نام',
                locale: 'ur',
              },
            ],
          },
          family_name: {
            display: [
              {
                name: 'اسم العائلة',
                locale: 'ar',
              },
              {
                name: 'Nachname',
                locale: 'de',
              },
              {
                name: 'Family Name',
                locale: 'en',
              },
              {
                name: 'Apellido',
                locale: 'es',
              },
              {
                name: 'نام خانوادگی',
                locale: 'fa',
              },
              {
                name: 'Sukunimi',
                locale: 'fi',
              },
              {
                name: 'Nom de famille',
                locale: 'fr',
              },
              {
                name: 'परिवार का नाम',
                locale: 'hi',
              },
              {
                name: 'Cognome',
                locale: 'it',
              },
              {
                name: '姓',
                locale: 'ja',
              },
              {
                name: 'өөрийн нэр',
                locale: 'mn',
              },
              {
                name: 'Achternaam',
                locale: 'nl',
              },
              {
                name: 'Sobrenome',
                locale: 'pt',
              },
              {
                name: 'Efternamn',
                locale: 'sv',
              },
              {
                name: 'خاندانی نام',
                locale: 'ur',
              },
            ],
          },
          birthdate: {
            display: [
              {
                name: 'تاريخ الميلاد',
                locale: 'ar',
              },
              {
                name: 'Geburtsdatum',
                locale: 'de',
              },
              {
                name: 'Date of Birth',
                locale: 'en',
              },
              {
                name: 'Fecha de Nacimiento',
                locale: 'es',
              },
              {
                name: 'تاریخ تولد',
                locale: 'fa',
              },
              {
                name: 'Syntymäaika',
                locale: 'fi',
              },
              {
                name: 'Date de naissance',
                locale: 'fr',
              },
              {
                name: 'जन्म की तारीख',
                locale: 'hi',
              },
              {
                name: 'Data di nascita',
                locale: 'it',
              },
              {
                name: '生年月日',
                locale: 'ja',
              },
              {
                name: 'төрсөн өдөр',
                locale: 'mn',
              },
              {
                name: 'Geboortedatum',
                locale: 'nl',
              },
              {
                name: 'Data de Nascimento',
                locale: 'pt',
              },
              {
                name: 'Födelsedatum',
                locale: 'sv',
              },
              {
                name: 'تاریخ پیدائش',
                locale: 'ur',
              },
            ],
          },
        },
        scope: 'identity_credential',
        cryptographic_binding_methods_supported: ['jwk', 'x5c'],
        credential_signing_alg_values_supported: [
          'ES256',
          'ES384',
          'ES512',
          'ES256K',
        ],
        display: [
          {
            name: 'Identity Credential',
          },
        ],
      },
    },
  };

  type ISupportedCredential =
    keyof typeof CREDENTIAL_ISSUER_METADATA.credential_configurations_supported;

  /**
   * This function helps to get the selected credential type's
   * claims in the prefered locale.
   *
   * If the provided preferred locale is found, it'll return it's value
   * else it'll use the value of the the first element of display
   * if the claim has no display, then it'll remove underscores from
   * the claim and return as value for display
   *
   * @param {Claims} claims - the different claims present in the credential type
   * @param {string} preferredLocale - the desired language in which we want the claims to be presented
   * @returns {string[]} - a list of all claims in preferred locale
   */
  function getVCClaimsInPreferredLocale(
    claims: Claims,
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
   * @param {typeof CREDENTIAL_ISSUER_METADATA} issuer_metadata - the provided metadata from issuer
   * @returns {ICredentialCard} - the metadata credential configurations supported, type and issuer of every supported type
   */
  function getVCSDJWTOffers(
    issuer_metadata: typeof CREDENTIAL_ISSUER_METADATA
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
   * @param {typeof CREDENTIAL_ISSUER_METADATA} credentialIssuerMetadata - the provided metadata from issuer
   * @param {string} preferredLocale - the desired language in which we want the claims to be presented
   * @returns {string[]} - the list of claims to display
   */
  function getVCClaims(
    selectedCredential: ISupportedCredential,
    credentialIssuerMetadata: typeof CREDENTIAL_ISSUER_METADATA,
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
        selectedOfferClaims as Claims,
        preferredLocale
      );
    }
    return [];
  }

  const [selectedCredentialOffer, setSelectedCredentialOffer] =
    useState<ICredentialCard>();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        height: '100%',
      }}
    >
      <CredentialOfferDetails
        closeDialog={() => setSelectedCredentialOffer(undefined)}
        isDialogOpen={!!selectedCredentialOffer}
        selectedCredentialOffer={selectedCredentialOffer}
        credentialOfferAttributes={getVCClaims(
          selectedCredentialOffer?.type as ISupportedCredential,
          CREDENTIAL_ISSUER_METADATA,
          'en'
        )}
      />
      <BackTitleBar pageTitle="Credential Types" onBack={() => push('/scan')} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr',
          rowGap: 1,
          backgroundColor: '#F6F7F9',
          padding: '12px',
        }}
      >
        {getVCSDJWTOffers(CREDENTIAL_ISSUER_METADATA).map((card, index) => {
          const {
            type,
            issuer,
            data: { display },
          } = card;
          return (
            <CredentialTypeCard
              key={index}
              displayName={display[0].name}
              issuer={issuer}
              type={type}
              selectCredentialType={() =>
                setSelectedCredentialOffer((prevCard) =>
                  prevCard && prevCard.type === card.type ? undefined : card
                )
              }
            />
          );
        })}
      </Box>
      <Footer showArrow={false} />
    </Box>
  );
}
