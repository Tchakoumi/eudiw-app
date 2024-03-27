export enum ResponseMode {
  FRAGMENT = 'fragment',
  FORM_POST = 'form_post',
  DIRECT_POST = 'direct_post',
  QUERY = 'query',
}

export enum ResponseType {
  CODE = 'code',
  // https://openid.net/specs/openid-4-verifiable-presentations-1_0-20.html#name-response-type-vp_token
  VP_TOKEN = 'vp_token',
  ID_TOKEN = 'id_token',
  ID_TOKEN_VP_TOKEN = 'vp_token id_token',
}
