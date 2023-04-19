import initialState from './initialState'
import {
  AUTH_BEGIN,
  AUTH_SUCCESS,
  AUTH_ERROR,
  AUTH_LOGOUT,
  AUTH_SSO_ERROR,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_BEGIN,
  FORGOT_PASSWORD_ERROR,
  SEND_PASSWORD_SUCCESS,
  SEND_PASSWORD_BEGIN,
  SEND_PASSWORD_ERROR,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_BEGIN,
  CHANGE_PASSWORD_ERROR,
  SET_DISCOURSE_SSO,
} from '../actionTypes'

function authReducer(incomingState = initialState, action) {
  const state = { ...incomingState }
  // this is to avoid keep the old value of `isAuthenticated` in the state when the user logs out
  state.isAuthenticated =
    typeof incomingState.isAuthenticated === 'function'
      ? incomingState.isAuthenticated()
      : incomingState.isAuthenticated
  switch (action.type) {
    case AUTH_BEGIN:
      return {
        ...state,
        loading: true,
        userInfo: null,
        error: null,
      }
    case AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        userInfo: action.userInfo,
      }

    case AUTH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error.response?.data?.email
          ? action.error.response.data.email
          : `Ocurrió un error al intentar ingresar. Si tienes algún bloqueador de anuncios,
        por favor desactívalo e intenta nuevamente; si persiste el inconveniente,
          por favor escríbenos al chat en vivo.`,
        isAuthenticated: false,
      }
    case AUTH_SSO_ERROR:
      return {
        ...state,
        loading: false,
        error:
          'Ocurrió un error inesperado, intenta de nuevo más tarde; si persiste el inconveniente, por favor escríbenos al chat en vivo',
        isAuthenticated: false,
        errorTrace: action.error,
      }

    case AUTH_LOGOUT:
      return {
        ...state,
        loading: false,
        error: null,
        isAuthenticated: false,
        userInfo: false,
      }

    case SET_DISCOURSE_SSO:
      return {
        ...state,
        discourseSSO: action.payload,
      }

    case FORGOT_PASSWORD_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      }

    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        userInfo: true,
      }

    case FORGOT_PASSWORD_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      }

    case SEND_PASSWORD_BEGIN:
      return {
        ...state,
        loading: true,
        error: false,
      }

    case SEND_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        userInfo: true,
      }

    case SEND_PASSWORD_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      }

    case CHANGE_PASSWORD_BEGIN:
      return {
        ...state,
        changePasswordSuccessed: false,
        changePasswordLoading: true,
      }

    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        changePasswordSuccessed: true,
        changePasswordLoading: false,
      }

    case CHANGE_PASSWORD_ERROR:
      return {
        ...state,
        changePasswordLoading: false,
      }
    default:
      return state
  }
}

export default authReducer
