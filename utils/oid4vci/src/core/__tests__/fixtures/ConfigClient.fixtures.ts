import { ConfigClient, ConfigData } from '../../ConfigClient';

export const configData: ConfigData = {
  clientIdRegistry: [
    {
      knownHost: 'trial.authlete.net',
      clientId: '218232426',
    },
  ],
};

export const configClient = new ConfigClient(configData);
