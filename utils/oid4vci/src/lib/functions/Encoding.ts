export function convertJsonToURI(
  json:
    | {
        [s: string]: never;
      }
    | ArrayLike<never>
    | string
    | object
): string {
  const results = [];

  for (const [key, value] of Object.entries(json)) {
    if (!value) {
      continue;
    }

    if (Array.isArray(value)) {
      results.push(
        value
          .map(
            (v) =>
              `${encodeAndStripWhitespace(key)}=${customEncodeURIComponent(
                v,
                /\./g
              )}`
          )
          .join('&')
      );
      continue;
    }
    const isBool = typeof value == 'boolean';
    const isNumber = typeof value == 'number';
    const isString = typeof value == 'string';
    let encoded;
    if (isBool || isNumber) {
      encoded = `${encodeAndStripWhitespace(key)}=${value}`;
    } else if (isString) {
      encoded = `${encodeAndStripWhitespace(key)}=${customEncodeURIComponent(
        value,
        /\./g
      )}`;
    } else {
      encoded = `${encodeAndStripWhitespace(key)}=${customEncodeURIComponent(
        JSON.stringify(value),
        /\./g
      )}`;
    }
    results.push(encoded);
  }
  const components = results.join('&');

  return components;
}

/**
 * @function customEncodeURIComponent is used to encode chars that are not encoded by default
 * @param searchValue The pattern/regexp to find the char(s) to be encoded
 * @param uriComponent query string
 */
function customEncodeURIComponent(
  uriComponent: string,
  searchValue: SearchValue
): string {
  // -_.!~*'() are not escaped because they are considered safe.
  // Add them to the regex as you need
  return encodeURIComponent(uriComponent).replace(
    searchValue,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

export type SearchValue = {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  [Symbol.replace](
    string: string,
    replacer: (substring: string, ...args: unknown[]) => string
  ): string;
};

function encodeAndStripWhitespace(key: string): string {
  return encodeURIComponent(key.replace(' ', ''));
}
