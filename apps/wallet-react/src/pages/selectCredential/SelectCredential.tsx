import { Box } from '@mui/material';
import { useState } from 'react';
import Footer from '../../components/home/Footer';
import Header from '../../components/home/Header';
import CredentialTypeCard from './CredentialTypeCard';
import CredentialOfferDetails from './CredentialOfferDetails';
import { Claims, CredentialConfiguration } from './credentials.types';

export default function SelectCredential() {
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

  function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function cleanupClaimKey(claimKey: string) {
    return claimKey
      .split('_')
      .map((jj) => capitalize(jj))
      .join(' ');
  }

  // TODO: Is it possible to type the preferredLocal?
  /**
   * This function helps to get the selected credential type
   * attributes and the display in the prefered language
   *
   * @param {string} claims - the different claims presentin the credential type
   * @param {string} preferredLocal - the desired language we want the claims to be presented in
   */
  function getOfferedIdAttributes(claims: Claims, preferredLocal: string) {
    const claimKeys = Object.keys(claims) as (keyof typeof claims)[];

    const claimKeysInPreferredLocal = claimKeys.map((item) => {
      const claimInPreferredLocale = claims[item].display.find(
        ({ locale }) => locale === preferredLocal
      );
      if (claims[item].display.length > 0) {
        // if preferred locale is found,
        // then retun the name in that locale
        if (claimInPreferredLocale) return claimInPreferredLocale.name;
        //if preferred local is not found,
        // just return the name on first element in display list
        return claims[item].display[0].name;
      }
      // if the display list is empty
      // return the cleanedup key
      return cleanupClaimKey(item as string);
    });
    return claimKeysInPreferredLocal;
  }

  function getVCSDJWTData(
    issuer_metadata: typeof CREDENTIAL_ISSUER_METADATA
  ): { type: string; issuer: string; data: CredentialConfiguration }[] {
    const credentialOfferTypeKeys = Object.keys(
      issuer_metadata.credential_configurations_supported
    ) as ISupportedCredential[];

    const vcSdJwtTypeKeys = credentialOfferTypeKeys.filter(
      (item) =>
        issuer_metadata.credential_configurations_supported[item].format ===
        'vc+sd-jwt'
    );
    return vcSdJwtTypeKeys.map((item) => {
      return {
        type: item,
        issuer: issuer_metadata.credential_issuer,
        data: issuer_metadata.credential_configurations_supported[item],
      };
    }) as { type: string; issuer: string; data: CredentialConfiguration }[];
  }

  function getVCItems(selectedCredential: ISupportedCredential) {
    const selectedOfferClaims =
      CREDENTIAL_ISSUER_METADATA.credential_configurations_supported[
        selectedCredential
      ].claims;

    return getOfferedIdAttributes(selectedOfferClaims as Claims, 'en');
  }

  const [chosenCredentialType, setChosenCredentialType] = useState<string>();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        height: '100%',
      }}
    >
      <CredentialOfferDetails
        closeDialog={() => setChosenCredentialType(undefined)}
        isDialogOpen={!!chosenCredentialType}
        credentialOfferAttributes={
          chosenCredentialType
            ? getVCItems(chosenCredentialType as ISupportedCredential)
            : []
        }
      />
      <Header />
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr',
          rowGap: 1,
          backgroundColor: '#F6F7F9',
          padding: '12px',
        }}
      >
        {getVCSDJWTData(CREDENTIAL_ISSUER_METADATA).map(
          ({ type, issuer, data: { display } }, index) => (
            <CredentialTypeCard
              key={index}
              displayName={display[0].name}
              issuer={issuer}
              type={type}
              selectCredentialType={(type) =>
                setChosenCredentialType((prevType) =>
                  prevType === type ? undefined : type
                )
              }
            />
          )
        )}
      </Box>
      <Footer showArrow={false} />
    </Box>
  );
}
