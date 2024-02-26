import { Encoding, OpenIDResponse } from '../types';
import { fetch } from 'cross-fetch';

export const formPost = async <T>(
  url: string,
  body: BodyInit,
  opts?: {
    bearerToken?: (() => Promise<string>) | string;
    contentType?: string;
    accept?: string;
    customHeaders?: Record<string, string>;
    exceptionOnHttpErrorStatus?: boolean;
  }
): Promise<OpenIDResponse<T>> => {
  return await post(
    url,
    body,
    opts?.contentType
      ? { ...opts }
      : { contentType: Encoding.FORM_URL_ENCODED, ...opts }
  );
};

export const post = async <T>(
  url: string,
  body?: BodyInit,
  opts?: {
    bearerToken?: (() => Promise<string>) | string;
    contentType?: string;
    accept?: string;
    customHeaders?: Record<string, string>;
    exceptionOnHttpErrorStatus?: boolean;
  }
): Promise<OpenIDResponse<T>> => {
  return await openIdFetch(url, body, { method: 'POST', ...opts });
};

const openIdFetch = async <T>(
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
): Promise<OpenIDResponse<T>> => {
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

  const origResponse = await fetch(url, payload);
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
};
