import { ConfigClient, ConfigData } from '../../../ConfigClient';
import { HttpUtil } from '../../../../utils';

export const configData: ConfigData = {
  proxyServer: 'http://server.proxy.example',
  clientIdRegistry: [
    {
      knownHost: 'trial.authlete.net',
      clientId: '218232426',
    },
  ],
};

export const configClient = new ConfigClient(configData);
export const httpUtil = new HttpUtil(configClient.getProxyServer());
