import { CredentialOffer } from '../../../types';

export const credentialOfferObjectRef1: CredentialOffer = {
  credential_issuer: 'https://trial.authlete.net',
  credential_configuration_ids: ['IdentityCredential', 'org.iso.18013.5.1.mDL'],
  grants: {
    'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
      'pre-authorized_code': '72X9bjXuPHbX_J1X-tdaCIKWKK7AG0h6gA3v5oOpu4c',
    },
  },
};
