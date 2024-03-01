/**
 * Attaches a path to a base URL, avoiding double slash.
 * @param baseUrl a base URL
 * @param path a path
 * @returns a complete URL with path appended to baseUrl
 */
export const composeUrl = (baseUrl: string, path: string): string => {
  const trimmedBaseUrl = baseUrl.replace(/\/$/, '');
  const trimmedPath = path.replace(/^\//, '');

  return `${trimmedBaseUrl}/${trimmedPath}`;
};