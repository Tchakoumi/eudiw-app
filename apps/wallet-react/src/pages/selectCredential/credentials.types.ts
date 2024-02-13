export interface ClaimDisplay {
  name: string;
  locale: string;
}

export interface Claims {
  [key: string]: {
    display: ClaimDisplay[];
  };
}

export interface CredentialConfiguration {
  format: string;
  vct: string;
  claims: Claims;
  scope: string;
  cryptographic_binding_methods_supported: string[];
  credential_signing_alg_values_supported: string[];
  display: {
    name: string;
  }[];
}

export interface IdentityCredentialMetadata {
  [key: string]: CredentialConfiguration;
}

export interface IdentityCredentialMetadataConfig {
  credential_issuer: string;
  credential_endpoint: string;
  batch_credential_endpoint: string;
  deferred_credential_endpoint: string;
  credential_response_encryption: {
    alg_values_supported: string[];
    enc_values_supported: string[];
    encryption_required: boolean;
  };
  credential_configurations_supported: IdentityCredentialMetadata;
}

//   const CREDENTIAL_ISSUER_METADATA: IdentityCredentialMetadataConfig = {
//     credential_issuer: 'https://trial.authlete.net',
//     credential_endpoint: 'https://trial.authlete.net/api/credential',
//     batch_credential_endpoint: 'https://trial.authlete.net/api/batch_credential',
//     deferred_credential_endpoint: 'https://trial.authlete.net/api/deferred_credential',
//     credential_response_encryption: {
//       alg_values_supported: [
//         'RSA1_5',
//         'RSA-OAEP',
//         'RSA-OAEP-256',
//         'ECDH-ES',
//         'ECDH-ES+A128KW',
//         'ECDH-ES+A192KW',
//         'ECDH-ES+A256KW',
//       ],
//       enc_values_supported: [
//         'A128CBC-HS256',
//         'A192CBC-HS384',
//         'A256CBC-HS512',
//         'A128GCM',
//         'A192GCM',
//         'A256GCM',
//       ],
//       encryption_required: false,
//     },
//     credential_configurations_supported: {
//       IdentityCredential: {
//         format: 'vc+sd-jwt',
//         vct: 'https://credentials.example.com/identity_credential',
//         claims: {
//           given_name: {
//             display: [
//               { name: 'الاسم الشخصي', locale: 'ar' },
//               { name: 'Vorname', locale: 'de' },
//               { name: 'Given Name', locale: 'en' },
//               { name: 'Nombre', locale: 'es' },
//               { name: 'نام', locale: 'fa' },
//               { name: 'Etunimi', locale: 'fi' },
//               { name: 'Prénom', locale: 'fr' },
//               { name: 'पहचानी गई नाम', locale: 'hi' },
//               { name: 'Nome', locale: 'it' },
//               { name: '名', locale: 'ja' },
//               { name: 'Овог нэр', locale: 'mn' },
//               { name: 'Voornaam', locale: 'nl' },
//               { name: 'Nome Próprio', locale: 'pt' },
//               { name: 'Förnamn', locale: 'sv' },
//               { name: 'مسلمان نام', locale: 'ur' },
//             ],
//           },
//           family_name: {
//             display: [
//               { name: 'اسم العائلة', locale: 'ar' },
//               { name: 'Nachname', locale: 'de' },
//               { name: 'Family Name', locale: 'en' },
//               { name: 'Apellido', locale: 'es' },
//               { name: 'نام خانوادگی', locale: 'fa' },
//               { name: 'Sukunimi', locale: 'fi' },
//               { name: 'Nom de famille', locale: 'fr' },
//               { name: 'परिवार का नाम', locale: 'hi' },
//               { name: 'Cognome', locale: 'it' },
//               { name: '姓', locale: 'ja' },
//               { name: 'өөрийн нэр', locale: 'mn' },
//               { name: 'Achternaam', locale: 'nl' },
//               { name: 'Sobrenome', locale: 'pt' },
//               { name: 'Efternamn', locale: 'sv' },
//               { name: 'خاندانی نام', locale: 'ur' },
//             ],
//           },
//           birthdate: {
//             display: [
//               { name: 'تاريخ الميلاد', locale: 'ar' },
//               { name: 'Geburtsdatum', locale: 'de' },
//               { name: 'Date of Birth', locale: 'en' },
//               { name: 'Fecha de Nacimiento', locale: 'es' },
//               { name: 'تاریخ تولد', locale: 'fa' },
//               { name: 'Syntymäaika', locale: 'fi' },
//               { name: 'Date de naissance', locale: 'fr' },
//               { name: 'जन्म की तारीख', locale: 'hi' },
//               { name: 'Data di nascita', locale: 'it' },
//               { name: '生年月日', locale: 'ja' },
//               { name: 'төрсөн өдөр', locale: 'mn' },
//               { name: 'Geboortedatum', locale: 'nl' },
//               { name: 'Data de Nascimento', locale: 'pt' },
//               { name: 'Födelsedatum', locale: 'sv' },
//               { name: 'تاریخ پیدائش', locale: 'ur' },
//             ],
//           },
//         },
//         scope: 'identity_credential',
//         cryptographic_binding_methods_supported: ['jwk', 'x5c'],
//         credential_signing_alg_values_supported: ['ES256', 'ES384', 'ES512', 'ES256K'],
//         display: [{ name: 'Identity Credential' }],
//       },
//     },
//   };
