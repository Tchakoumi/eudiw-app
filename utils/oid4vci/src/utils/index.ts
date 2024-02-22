import { fetch } from 'cross-fetch';

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

/**
 * Returns current unix timestamp in seconds.
 */
export const currentTimestampInSecs = (): number => {
  return Math.floor(new Date().getTime() / 1000);
};

/**
 * Fetches resource into data URL (Base64).
 * @param uri the URI to fetch data from
 * @returns the data URL of the response payload
 */
export const fetchIntoDataUrl = async (uri: string): Promise<string> => {
  return await fetch(uri).then(async (response) => {
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    const data = await response.arrayBuffer();
    const buffer = Buffer.from(data).toString('base64');

    return `data:${contentType};base64,${buffer}`;
  });
};
