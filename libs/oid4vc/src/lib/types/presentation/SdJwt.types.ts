export type SdJwtDecodedDisclosure =
  | [string, string, JsonValue]
  | [string, JsonValue];

export interface SdJwtDisclosure {
  /* The encoded disclosure */
  encoded: string;

  /*
   * The decoded disclosure, in format [salt, claim, value] or in case of array entry [salt, value]
   */
  decoded: SdJwtDecodedDisclosure;

  /*
   * Digest over disclosure, can be used to match against a value within the SD JWT payload
   */
  digest: string;
}

export type JsonValue =
  | string
  | number
  | boolean
  | { [x: string]: JsonValue | undefined }
  | Array<JsonValue>;
