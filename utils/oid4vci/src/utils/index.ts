/**
 * Attach a path to a base URL avoiding double slash.
 */
export const composeUrl = (baseUrl: string, path: string): string => {
  const trimmedBaseUrl = baseUrl.replace(/\/$/, '');
  const trimmedPath = path.replace(/^\//, '');

  return `${trimmedBaseUrl}/${trimmedPath}`;
};
