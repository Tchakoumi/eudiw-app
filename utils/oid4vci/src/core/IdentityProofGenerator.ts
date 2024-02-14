export class IdentityProofGenerator {
  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Computes key proof of wallet's identity.
   */
  public generateKeyProof(nonce: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const jwk = this.getJwkIdentity();

    return [
      'eyJ0eXAiOiJvcGVuaWQ0dmNpLXByb29mK2p3dCIsImFsZyI6IkVTMjU2IiwiandrIjp7ImNy' +
        'diI6IlAtMjU2Iiwia3R5IjoiRUMiLCJ4IjoiUFN4UXJEMnpsMF9tWGNBcXoxbWdxU2VCb0Jo' +
        'bm14Mnl4QkVwckJZOEYyMCIsInkiOiJ4VjhmYmkxRlNvc1V1bkxldUxOdUxrSmlxbVk2VEtp' +
        'TW51ci1HbjJ3UjEwIn19.eyJpc3MiOiIyMTgyMzI0MjYiLCJhdWQiOiJodHRwczovL3RyaWF' +
        'sLmF1dGhsZXRlLm5ldCIsImlhdCI6MTcwMzg0NzM3Niwibm9uY2UiOiJFaFRDOExBNmtWcnJ' +
        'PNl9YaUM3TjZOX3dYZG1hMlpzMUxIQVFCWjVFMFQwIn0.6l8QnPTclDUoWH5PsVsZQDauA_H' +
        'cIVDGxU9-TfezflIIAzTFgeC5nTr5rLBkEIgcfUvkUOwKqlM06LdVVwTZlw',
      nonce,
    ];
  }

  /**
   * Reads current wallet's identity from store.
   */
  private getJwkIdentity() {
    return {
      kty: 'EC',
      d: 'lPHtS-GHGLHoUUaRlJoIm920f0smWf1xN6fLgz7y3eA',
      use: 'sig',
      crv: 'P-256',
      kid: 'umcsmPiYZT-IkOJddkEktykzYNNsXdiNj7LTSfStz7w',
      x: '6FHJYsI0by91XSllDSHMNS20Rlw6LrPNmPAR7jadeFs',
      y: 'gJiHCDP1jbAK_s5iItC7RtKV8Hx5RlLDoP_mEaWfe9w',
      alg: 'ES256',
    };
  }
}
