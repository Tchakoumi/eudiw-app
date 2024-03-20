export * from './Encoding';
export * from './HttpUtil';

/**
 * Attaches a path to a base URL, avoiding double slash.
 * @param baseUrl a base URL
 * @param path a path
 * @returns a complete URL with path appended to baseUrl
 */
export const composeUrl = (baseUrl: string, path: string): string => {
  const trimmedBaseUrl = baseUrl.trim().replace(/\/$/, '');
  const trimmedPath = path.trim().replace(/^\//, '');

  return `${trimmedBaseUrl}/${trimmedPath}`;
};

/**
 * Returns current unix timestamp in seconds.
 */
export const currentTimestampInSecs = (): number => {
  return Math.floor(new Date().getTime() / 1000);
};

/**
 * Checks if a string is DNS name
 * @param domain DNS name
 * @returns boolean indicating if the `domain` is valid
 */
export const isValidDNSName = (domain: string) => {
  const dnsNameRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return dnsNameRegex.test(domain);
};
