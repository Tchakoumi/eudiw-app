import { fetch } from 'cross-fetch';

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

/**
 * Builds an alternative URL to proxy a request.
 * @param proxyServer the address of the proxy server
 * @param url a URL to proxy
 * @returns an alternative URL to reach the URL via the proxy server
 */
export const buildProxyUrl = (proxyServer: string, url: string): string => {
  return composeUrl(proxyServer, url);
};
