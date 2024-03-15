import { composeUrl } from '.';
import { Encoding, OpenIDResponse } from '../lib/types/issuance';
import { fetch } from 'cross-fetch';

/**
 * This utility class is responsible all HTTP calls in the service.
 */
export class HttpUtil {
  /**
   * Constructor.
   * @param proxyServer the address of a proxy server
   */
  public constructor(private proxyServer?: string) {}

  public async plainFetch(
    url: string,
    payload?: RequestInit
  ): Promise<Response> {
    // Proxy URL if proxy server configured
    url = this.proxyServer ? composeUrl(this.proxyServer, url) : url;

    // Run fetch request
    return await fetch(url, payload);
  }

  public async formPost<T>(
    url: string,
    body: BodyInit,
    opts?: {
      bearerToken?: (() => Promise<string>) | string;
      contentType?: string;
      accept?: string;
      customHeaders?: Record<string, string>;
      exceptionOnHttpErrorStatus?: boolean;
    }
  ): Promise<OpenIDResponse<T>> {
    return await this.post(
      url,
      body,
      opts?.contentType
        ? { ...opts }
        : { contentType: Encoding.FORM_URL_ENCODED, ...opts }
    );
  }

  public async post<T>(
    url: string,
    body?: BodyInit,
    opts?: {
      bearerToken?: (() => Promise<string>) | string;
      contentType?: string;
      accept?: string;
      customHeaders?: Record<string, string>;
      exceptionOnHttpErrorStatus?: boolean;
    }
  ): Promise<OpenIDResponse<T>> {
    return await this.openIdFetch(url, body, { method: 'POST', ...opts });
  }

  public async openIdFetch<T>(
    url: string,
    body?: BodyInit,
    opts?: {
      method?: string;
      bearerToken?: (() => Promise<string>) | string;
      contentType?: string;
      accept?: string;
      customHeaders?: Record<string, string>;
      exceptionOnHttpErrorStatus?: boolean;
    }
  ): Promise<OpenIDResponse<T>> {
    const headers: Record<string, string> = opts?.customHeaders ?? {};
    if (opts?.bearerToken) {
      headers['Authorization'] = `Bearer ${
        typeof opts.bearerToken === 'function'
          ? await opts.bearerToken()
          : opts.bearerToken
      }`;
    }

    const method = opts?.method ? opts.method : body ? 'POST' : 'GET';
    const accept = opts?.accept ? opts.accept : 'application/json';
    headers['Accept'] = accept;
    if (headers['Content-Type']) {
      if (opts?.contentType && opts.contentType !== headers['Content-Type']) {
        throw Error(
          `Mismatch in content-types from custom headers (${headers['Content-Type']}) and supplied content type option (${opts.contentType})`
        );
      }
    } else {
      if (opts?.contentType) {
        headers['Content-Type'] = opts.contentType;
      } else if (method !== 'GET') {
        headers['Content-Type'] = 'application/json';
      }
    }

    const payload: RequestInit = {
      method,
      headers,
      body,
    };

    const origResponse = await this.plainFetch(url, payload);
    const isJSONResponse =
      accept === 'application/json' ||
      origResponse.headers.get('Content-Type') === 'application/json';
    const success =
      origResponse && origResponse.status >= 200 && origResponse.status < 400;
    const responseText = await origResponse.text();
    const responseBody =
      isJSONResponse && responseText.includes('{')
        ? JSON.parse(responseText)
        : responseText;

    if (!success && opts?.exceptionOnHttpErrorStatus) {
      const error = JSON.stringify(responseBody);
      throw new Error(error === '{}' ? '{"error": "not found"}' : error);
    }

    return {
      origResponse,
      successBody: success ? responseBody : undefined,
      errorBody: !success ? responseBody : undefined,
    };
  }

  /**
   * Fetches resource into data URL (Base64).
   * @param uri the URI to fetch data from
   * @returns the data URL of the response payload
   */
  public async openIdFetchIntoDataUrl(
    url: string
  ): Promise<OpenIDResponse<string>> {
    const origResponse = await this.plainFetch(url);
    const success =
      origResponse && origResponse.status >= 200 && origResponse.status < 400;

    if (!success) {
      const { status, statusText } = origResponse;

      return {
        origResponse,
        errorBody: { ...origResponse, error: `${status} ${statusText}` },
      };
    }

    const contentType = origResponse.headers.get('content-type');
    const data = await origResponse.arrayBuffer();
    const buffer = Buffer.from(data).toString('base64');
    const dataUrl = `data:${contentType};base64,${buffer}`;

    return {
      origResponse,
      successBody: dataUrl,
    };
  }
}
