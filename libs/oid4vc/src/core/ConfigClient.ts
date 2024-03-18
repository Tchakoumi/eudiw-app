export interface ConfigData {
  /**
   * The address of a proxy server that can bypass CORS restrictions.
   */
  proxyServer?: string;

  /**
   * A registry of known authorization servers with granted client IDs.
   */
  clientIdRegistry?: {
    knownHost: string;
    clientId: string;
  }[];
}

export class ConfigClient {
  private readonly config: ConfigData;

  /**
   * Constructor.
   *
   * Configuration data are primarily sourced from environment vars.
   * However, you can override them via a config parameter.
   *
   * @param config overriding configuration data
   */
  public constructor(config?: ConfigData) {
    const envProxyServer = process.env?.['NX_PROXY_SERVER'];
    const envClientIdRegistry = process.env?.['NX_CLIENT_ID_REGISTRY'];

    this.config = {
      proxyServer: config?.proxyServer ?? envProxyServer,
      clientIdRegistry:
        config?.clientIdRegistry ??
        (envClientIdRegistry ? JSON.parse(envClientIdRegistry) : undefined),
    };
  }

  /**
   * Reads proxy server to bypass CORS restrictions
   * @returns the URL of the proxy server
   */
  public getProxyServer(): string | undefined {
    return this.config.proxyServer;
  }

  /**
   * Reads matching client ID from configuration
   * @param issuer target credential Issuer
   * @returns matching client ID
   */
  public getClientId(issuer: string): string | undefined {
    const issuerURL = issuer.includes('://') ? issuer : `http://${issuer}`;
    const host = new URL(issuerURL).host;

    const clientIdRegistry = this.config.clientIdRegistry ?? [];
    for (const { knownHost, clientId } of clientIdRegistry) {
      if (host.includes(knownHost)) {
        return clientId;
      }
    }

    return undefined;
  }
}
