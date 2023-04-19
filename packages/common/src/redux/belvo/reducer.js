import { INITIAL_STATE, ACTION_TYPES } from './constants'

const reducer = (state = INITIAL_STATE, action) => {
  const { payload } = action
  switch (action.type) {
    case ACTION_TYPES.SET_CODE_STATUS: {
      const { status, statusCode, file, fileStatus } = payload
      return { ...state, status, statusCode, file, fileStatus }
    }

    case ACTION_TYPES.SET_INSTANCE: {
      return { ...state, instanceId: payload }
    }

    case ACTION_TYPES.SET_LINK_ID: {
      return { ...state, linkId: payload }
    }

    case ACTION_TYPES.SET_TOKENS: {
      return {
        ...state,
        refreshToken: payload.refresh,
        accessToken: payload.access,
      }
    }

    case ACTION_TYPES.SET_INSTITUTION: {
      return {
        ...state,
        institution: payload,
      }
    }

    case ACTION_TYPES.SET_FIREBASE: {
      const { firebaseId, date } = payload
      return {
        ...state,
        firebaseId,
        date,
      }
    }

    case ACTION_TYPES.CLEAR: {
      return INITIAL_STATE
    }

    default: {
      return state
    }
  }
}

export default reducer
