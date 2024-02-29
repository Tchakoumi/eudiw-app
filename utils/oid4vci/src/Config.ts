export class Config {
  private static readonly clientIdRegistry: Record<string, string> = {
    'trial.authlete.net': '218232426',
  };

  /**
   * Reads matching client ID from static ledger
   * @param issuer target credential Issuer
   * @returns matching client ID
   */
  public static getClientId(issuer: string): string | undefined {
    const host = new URL(issuer).host;

    for (const [knownHost, clientId] of Object.entries(this.clientIdRegistry)) {
      if (host.includes(knownHost)) {
        return clientId;
      }
    }

    return undefined;
  }
}
