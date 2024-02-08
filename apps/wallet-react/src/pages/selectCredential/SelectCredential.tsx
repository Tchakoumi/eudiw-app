import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import Footer from '../../components/home/Footer';
import Header from '../../components/home/Header';
import { useState } from 'react';

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
          family_name: {},
          given_name: {},
          birthdate: {},
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

  function getOfferedCredentials() {
    return Object.keys(
      CREDENTIAL_ISSUER_METADATA.credential_configurations_supported
    ) as ISupportedCredential[];
  }

  function getVCItems(selectedCredential: ISupportedCredential) {
    const selectedCredentialClaims =
      CREDENTIAL_ISSUER_METADATA.credential_configurations_supported[
        selectedCredential
      ].claims;

    const selectedCredentialClaimKeys = Object.keys(selectedCredentialClaims) ;
    // const object = selectedCredentialClaimKeys.forEach(item=>selectedCredentialClaims[item])
    if (selectedCredentialClaimKeys.length > 1) return selectedCredentialClaims;
    return selectedCredentialClaims[selectedCredentialClaimKeys as keyof typeof selectedCredentialClaims];
  }

  function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  const [canShowCards, setCanShowCards] = useState<boolean>(false);
  const [chosenCredentialType, setChosenCredentialType] =
    useState<ISupportedCredential>();

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
          <FormControl>
            <RadioGroup
              onChange={(e) =>
                setChosenCredentialType(e.target.value as ISupportedCredential)
              }
            >
              {getOfferedCredentials()
                .sort((a, b) => (a > b ? 1 : -1))
                .map((type) => (
                  <FormControlLabel
                    value={type}
                    control={<Radio />}
                    label={type}
                  />
                ))}
            </RadioGroup>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setCanShowCards(true)}
            disabled={!chosenCredentialType}
          >
            Next
          </Button>
        </Box>

        {canShowCards && chosenCredentialType && (
          <Box sx={{ display: 'grid' }}>
            {Object.keys(getVCItems(chosenCredentialType)).map((key) => (
              <Typography>
                {key
                  .split('_')
                  .map((jj) => capitalize(jj))
                  .join(' ')}
              </Typography>
            ))}
          </Box>
        )}
      </Box>
      <Footer showArrow={false} />
    </Box>
  );
}
