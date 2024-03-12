export interface ConfigData {
  /**
   * The address of a proxy server that can bypass CORS restrictions
   */
  proxyServer: string;

  /**
   * A registry of known authorization servers with granted client IDs.
   */
  clientIdRegistry?: {
    knownHost: string;
    clientId: string;
  }[];
}

export class ConfigClient {
  /**
   * Constructor.
   * @param config configuration data possibly sourced from a file
   */
  public constructor(private config: ConfigData) {}

  /**
   * Reads proxy server to bypass CORS restrictions
   * @returns the URL of the proxy server
   */
  public getProxyServer(): string {
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
