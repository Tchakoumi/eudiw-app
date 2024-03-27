import { Optionality, PresentationDefinition } from '../../../../lib/types';

export const presentationDef1: PresentationDefinition = {
  id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
  input_descriptors: [
    {
      id: '6d96f2bf-f25e-40e6-972d-d9d0a542f252',
      format: {
        'vc+sd-jwt': {},
      },
      constraints: {
        fields: [
          {
            path: ['$.given_name'],
            filter: {
              type: 'string',
            },
          },
        ],
        limit_disclosure: Optionality.REQUIRED,
      },
    },
  ],
};
export const pdFilteredCredentials = [
  {
    credential: {
      id: 1,
      title: 'Identity Credential',
      issuer: 'trial.authlete.net',
      issued_at: 1708613098000,
      claims: {
        given_name: 'Henry',
        family_name: 'Silverstone',
        birthdate: '1991-11-06',
      },
    },
    disclosures: { given_name: 'Inga' },
  },
];

export const presentationDef2: PresentationDefinition = {
  id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
  input_descriptors: [
    {
      id: '6d96f2bf-f25e-40e6-972d-d9d0a542f252',
      format: {
        'vc+sd-jwt': {},
      },
      constraints: {
        fields: [
          {
            path: ['$.vct'],
            filter: {
              type: 'string',
              const: 'https://credentials.idunion.org/VerifiedEMail',
            },
          },
        ],
        limit_disclosure: Optionality.REQUIRED,
      },
    },
  ],
};

export const presentationDef3: PresentationDefinition = {
  id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
  input_descriptors: [
    {
      id: '6d96f2bf-f25e-40e6-972d-d9d0a542f252',
      format: {
        'vc+sd-jwt': {},
      },
      constraints: {},
    },
  ],
};

export const presentationDefWithOptionalField1: PresentationDefinition = {
  id: '277d0fb5-ef4b-4cff-93f0-086af36f9190',
  input_descriptors: [
    {
      id: '6d96f2bf-f25e-40e6-972d-d9d0a542f252',
      format: {
        'vc+sd-jwt': {},
      },
      constraints: {
        fields: [
          {
            path: ['$.vct'],
            filter: {
              type: 'string',
              const: 'https://credentials.idunion.org/VerifiedEMail',
            },
            optional: true,
          },
          {
            path: ['$.given_name'],
          },
          {
            path: ['$.birthdate'],
            filter: {
              type: 'string',
              format: 'date',
            },
          },
        ],
        limit_disclosure: Optionality.REQUIRED,
      },
    },
  ],
};
