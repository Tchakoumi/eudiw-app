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