import { ConfigClient } from '../ConfigClient';
import { configData } from './fixtures';

describe('ConfigClient', () => {
  it('should match client IDs', () => {
    let clientId: string | undefined;

    const configClient = new ConfigClient({
      ...configData,
      clientIdRegistry: [
        {
          knownHost: 'trial.authlete.net',
          clientId: 'ba',
        },
        {
          knownHost: 'demo.authlete.net',
          clientId: 'bb',
        },
        {
          knownHost: 'authlete.net',
          clientId: 'bc',
        },
      ],
    });

    clientId = configClient.getClientId('https://trial.authlete.net');
    expect(clientId).toEqual('ba');

    clientId = configClient.getClientId('http://demo.authlete.net');
    expect(clientId).toEqual('bb');

    clientId = configClient.getClientId('other.authlete.net');
    expect(clientId).toEqual('bc');

    clientId = configClient.getClientId('server.example.com');
    expect(clientId).toBeUndefined();
  });

  it('should client ID to undefined on missing registry', () => {
    const configClient = new ConfigClient({
      ...configData,
      clientIdRegistry: undefined,
    });

    const clientId = configClient.getClientId('https://trial.authlete.net');
    expect(clientId).toBeUndefined();
  });
});
