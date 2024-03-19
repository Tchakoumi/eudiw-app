
export interface OID4VPInterface {
  /**
   * Resolves the authentication request given as URI and
   * verifies the validity of the request.
   *
   * @param requestObjectUri string obtain from the scanned Qr code
   * @returns the resolved and verified authentication request.
   */
  resolveRequestObject(requestObjectUri: string): Promise<void>;
}
