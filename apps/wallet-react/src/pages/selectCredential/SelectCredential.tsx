import { Box, Button, Typography, capitalize } from '@mui/material';
import { useState } from 'react';
import AuthleteLogo from '../../assets/authlete-logo.png';
import Footer from '../../components/home/Footer';
import Header from '../../components/home/Header';
import { CredentialConfiguration } from './credentials.types';

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

  function getIdCardItems(claims: never) {
    const claimKeys = Object.keys(claims) as (keyof typeof claims)[];

    const object: Record<string, string> = {};
    claimKeys.forEach((item) => {
      object[item as string] = claims[item] as string;
    });
    return object;
  }

  function getVCSDJWTItems(
    issuer_metadata: typeof CREDENTIAL_ISSUER_METADATA
  ): { type: string; issuer: string; data: CredentialConfiguration }[] {
    const ttt = Object.keys(
      issuer_metadata.credential_configurations_supported
    ) as ISupportedCredential[];
    const bb = ttt.filter(
      (item) =>
        issuer_metadata.credential_configurations_supported[item].format ===
        'vc+sd-jwt'
    );
    return bb.map((item) => {
      return {
        type: item,
        issuer: issuer_metadata.credential_issuer,
        data: issuer_metadata.credential_configurations_supported[item],
      };
    }) as { type: string; issuer: string; data: CredentialConfiguration }[];
  }

  function getVCItems(selectedCredential: ISupportedCredential) {
    const selectedCredentialClaims =
      CREDENTIAL_ISSUER_METADATA.credential_configurations_supported[
        selectedCredential
      ].claims;

    const selectedCredentialClaimKeys = Object.keys(
      selectedCredentialClaims
    ) as (keyof typeof selectedCredentialClaims)[];

    const object: Record<string, string> = {};
    selectedCredentialClaimKeys.forEach((item) => {
      object[item as string] = selectedCredentialClaims[item] as string;
    });

    if (selectedCredentialClaimKeys.length > 1)
      return getIdCardItems(selectedCredentialClaims as never);
    return getIdCardItems(
      selectedCredentialClaims[
        selectedCredentialClaimKeys as keyof typeof selectedCredentialClaims
      ]
    );
  }

  const [showCard, setShowCard] = useState<boolean>(false);
  const [chosenCredentialType, setChosenCredentialType] = useState<string>();
  const [showDetailedId, setShowDetailedId] = useState<boolean>(false);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        height: '100%',
      }}
    >
      <Header />
      <Box
        sx={{
          backgroundColor: '#F6F7F9',
          padding: '12px',
          display: 'grid',
          rowGap: 2,
          alignContent: 'start',
        }}
      >
        <Typography variant="h3" sx={{ textAlign: 'center' }}>
          Select the desired credential types
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateRows: 'auto auto 1fr',
            rowGap: 2,
            justifyContent: 'center',
          }}
        >
          {getVCSDJWTItems(CREDENTIAL_ISSUER_METADATA).map(
            ({ type, issuer, data: { display } }) => (
              <Box
                onClick={() =>
                  setChosenCredentialType((prevType) =>
                    prevType === type ? undefined : type
                  )
                }
                sx={{
                  backgroundColor:chosenCredentialType === type
                  ? 'green'
                  :'white',
                  padding: '8px',
                  borderRadius: 4,
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                  display: 'grid',
                  rowGap: 3,
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr',
                    columnGap: 2,
                    alignItems: 'center',
                    justifyItems: 'end',
                  }}
                >
                  <img
                    src={AuthleteLogo}
                    height={100}
                    width={100}
                    alt="authlete logo"
                  />
                  <Box>
                    <Typography variant="h4">{`Authlete ${display[0].name}`}</Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      {issuer}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="h5">Issuer</Typography>
                  <Typography>
                    {issuer
                      .split('//')[1]
                      .split('.')
                      .slice(0, 2)
                      .map((_) => capitalize(_))
                      .join(' ')}
                  </Typography>
                </Box>
              </Box>
            )
          )}
          {/* <FormControl>
            <RadioGroup
              onChange={(e) => {
                setChosenCredentialType(e.target.value as ISupportedCredential);
                setShowDetailedId(false);
              }}
            >
              {getVCSDJWTItems(CREDENTIAL_ISSUER_METADATA).map(
                ({ type, data: { display } }) => (
                  <FormControlLabel
                    value={type}
                    control={<Radio />}
                    label={display[0].name}
                  />
                )
              )}
            </RadioGroup>
          </FormControl> */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setShowCard(!showCard)}
            disabled={!chosenCredentialType}
          >
            {showCard ? 'Hide Card' : 'Show Card'}
          </Button>
        </Box>

        {/* {showCard && chosenCredentialType && (
          <IDTemplate
            vcItems={getVCItems(chosenCredentialType)}
            chosenCredentialType={chosenCredentialType}
            toggleDisplayDetails={() => setShowDetailedId(!showDetailedId)}
            showDetails={showDetailedId ? -1 : 3}
          />
        )} */}
      </Box>
      <Footer showArrow={false} />
    </Box>
  );
}
