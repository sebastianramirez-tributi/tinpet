export const INITIAL_STATE = {
  status: null,
  statusCode: null,
  date: null,
  linkId: null,
  refreshToken: null,
  accessToken: null,
  institution: null,
  firebaseId: null,
  file: null,
  fileStatus: null,
  instanceId: null,
}

export const ACTION_TYPES = {
  SET_CODE_STATUS: '@@belvo/set-code-status',
  SET_LINK_ID: '@@belvo/set-link-id',
  SET_TOKENS: '@@belvo/set-tokens',
  SET_INSTITUTION: '@@belvo/set-institution',
  SET_FIREBASE: '@@belvo/set-firebase',
  SET_INSTANCE: '@@belvo/set-instance',
  CLEAR: '@@belvo/clear',
}
