import { ConfigClient, ConfigData } from '../../../ConfigClient';
import { HttpUtil } from '../../../../utils';

export const configData: ConfigData = {
  // proxyServer: 'https://cors-anywhere.herokuapp.com',
  clientIdRegistry: [
    {
      knownHost: 'trial.authlete.net',
      clientId: '218232426',
    },
    {
      knownHost: 'verifier.ssi.tir.budru.de',
      clientId: 'verifier.ssi.tir.budru.de',
    },
    {
      knownHost: 'verifier.portal.walt.id',
      clientId: '',
    },
  ],
};

export const configClient = new ConfigClient(configData);
export const httpUtil = new HttpUtil(configClient.getProxyServer());
