import { message } from 'antd'
import * as actions from '../../redux/actionTypes'
import { startLoading, stopLoading } from '../general/actions'
import { setPersonalInfo, updatePersonalInfo } from '../personalInfo/actions'
import api from './api'
import { captureSentryException } from '../../sentry'
import formApi from '../form/api'
import {
  APP,
  DECLARANTES,
  SUBDOMAIN_TEMPLATE,
  SUBDOMAIN_TOKEN,
  COOKIE_CROSS_DOMAIN,
} from '../../constants/subdomains'
import { BAD_REQUEST, CONFLICT, NOT_FOUND } from '../../constants/response'
import { PARTNER_KEY, ROLES } from '../../constants/person'
import {
  getMaxTaxYear,
  normalizePartner,
  removeCookie,
} from '../../helpers/collections'
const MAX_TAX_YEAR = getMaxTaxYear()

const authBegin = () => ({ type: actions.AUTH_BEGIN })
const authlogout = () => ({ type: actions.AUTH_LOGOUT })
const authSuccess = (userInfo) => ({ type: actions.AUTH_SUCCESS, userInfo })
const authError = (error) => ({ type: actions.AUTH_ERROR, error })
const authSSOError = (error) => ({ type: actions.AUTH_SSO_ERROR, error })

const forgotPasswordBegin = () => ({ type: actions.FORGOT_PASSWORD_BEGIN })
const forgotPasswordSuccess = () => ({ type: actions.FORGOT_PASSWORD_SUCCESS })
const forgotPasswordError = (error) => ({
  type: actions.FORGOT_PASSWORD_ERROR,
  error,
})

const sendPasswordBegin = () => ({ type: actions.SEND_PASSWORD_BEGIN })
const sendPasswordSuccess = () => ({ type: actions.SEND_PASSWORD_SUCCESS })
const sendPasswordError = (error) => ({
  type: actions.SEND_PASSWORD_ERROR,
  error,
})
export const changePasswordBegin = () => ({
  type: actions.CHANGE_PASSWORD_BEGIN,
})
export const changePasswordSuccess = () => ({
  type: actions.CHANGE_PASSWORD_SUCCESS,
})
export const changePasswordError = () => ({
  type: actions.CHANGE_PASSWORD_ERROR,
})

export const auth = (data) => async (dispatch) => {
  const user = data.user

  if (!user.is_validate_email) {
    message.info(translate('validateEmail.sentMessage'))
  }

  localStorage.removeItem('jwtToken')
  localStorage.removeItem('jwtTokenRefresh')
  localStorage.removeItem('actualPerson')

  localStorage.setItem('jwtToken', data.access)
  localStorage.setItem('jwtTokenRefresh', data.refresh)
  localStorage.setItem(
    'actualPerson',
    JSON.stringify(user.role !== ROLES.ACCOUNTANT ? user.own_person : {})
  )

  // set personal info needs to be called after `jwtToken` be defined
  // because the dispatch triggers a validation where the token is needed.
  // So, if token is not defined but personal info is, the app redirects to `/register` path
  dispatch(setPersonalInfo(user))
  dispatch(authSuccess(data))
}

export const login =
  (username, password, token, redirectOnPartner, domain = APP) =>
  async (dispatch) => {
    dispatch(startLoading())
    dispatch(authBegin())
    try {
      const { data } = await api.login(username, password, token)
      const { access, refresh, user } = data
      const { partner = APP } = user
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'formSubmitted',
        formName: 'App Login',
      })
      const normalizedPartner = normalizePartner(partner)
      if (
        redirectOnPartner &&
        normalizedPartner !== domain &&
        ![ROLES.ASSISTANT, ROLES.ACCOUNTANT].includes(user?.role)
      ) {
        const partnerEnv =
          normalizedPartner === APP &&
          SUBDOMAIN_TEMPLATE.includes('tributilabs')
            ? DECLARANTES
            : normalizedPartner

        location.href = `${SUBDOMAIN_TEMPLATE.replace(
          SUBDOMAIN_TOKEN,
          partnerEnv
        )}/signin?token=${access}&refresh=${refresh}`

        return
      }

      dispatch(auth(data))
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      dispatch(authError(error))
      const errorEmailPassword = error.response && error.response.data.email
      if (!errorEmailPassword) {
        captureSentryException(error)
      }
      window.scrollTo(0, 0)
    }
  }

export const loginSocial =
  (token, redirectOnPartner, domain = APP) =>
  async (dispatch) => {
    dispatch(startLoading())
    dispatch(authBegin())
    try {
      const response = await api.loginSocial(token)
      const { access, refresh, user } = response.data
      const { partner } = user
      // google info
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'socialLogin',
        formName: 'App Login',
      })
      const normalizedPartner = normalizePartner(partner)
      if (
        redirectOnPartner &&
        normalizedPartner !== domain &&
        ![ROLES.ASSISTANT, ROLES.ACCOUNTANT].includes(user?.role)
      ) {
        const partnerEnv =
          normalizedPartner === APP &&
          SUBDOMAIN_TEMPLATE.includes('tributilabs')
            ? DECLARANTES
            : normalizedPartner
        location.href = `${SUBDOMAIN_TEMPLATE.replace(
          SUBDOMAIN_TOKEN,
          partnerEnv
        )}/signin?token=${access}&refresh=${refresh}`
        return
      }
      dispatch(auth(response.data))
      localStorage.removeItem('signUpProviderFlag')
      localStorage.setItem('signUpProviderFlag', true)
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      const errorEmailPassword = error.response && error.response.data.email
      if (!errorEmailPassword) {
        captureSentryException(error)
      }
      dispatch(authError(error))
      window.scrollTo(0, 0)
    }
  }

export const sendForgotPassword = (email, token) => async (dispatch) => {
  dispatch(startLoading())
  dispatch(forgotPasswordBegin())
  try {
    await api.sendForgotPassword(email, token)
    dispatch(stopLoading())
    dispatch(forgotPasswordSuccess())
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error, [BAD_REQUEST])
    dispatch(forgotPasswordError(error))
  }
}

export const changePasswordWithToken = (email, tokens) => (dispatch) => {
  dispatch(sendPasswordBegin())
  api
    .changePassword(email, tokens)
    .then((response) => dispatch(sendPasswordSuccess(response.data)))
    .catch((error) => {
      captureSentryException(error)
      dispatch(sendPasswordError(error))
    })
}

export const changeUserPassword = (data) => async (dispatch) => {
  dispatch(changePasswordBegin())
  try {
    await api.changeUserPassword(data)
    dispatch(changePasswordSuccess())
    message.success('Contraseña cambiada exitosamente')
  } catch (error) {
    const { response } = error
    dispatch(changePasswordError())
    captureSentryException(error)
    let msg = 'No se pudo cambiar la contraseña, intenta de nuevo más tarde'
    if (response && response.status === BAD_REQUEST) {
      ;[msg] = error.response.data
    }
    message.destroy()
    message.error(msg)
  }
}

export const logged = () => {
  return !!localStorage.getItem('jwtToken')
}

export const logout = () => async (dispatch) => {
  const { hostname } = location
  dispatch(startLoading())
  await api.logout()
  dispatch(stopLoading())
  dispatch(authlogout())
  localStorage.removeItem('jwtTokenRefresh')
  localStorage.removeItem('jwtToken')
  localStorage.removeItem('userIdentified')
  removeCookie(PARTNER_KEY, COOKIE_CROSS_DOMAIN)
  window.location.href = '/login'
}

/**
 * This function integrates both authMe and create filing if it's
 * neccessary.
 */
export const handleSSOAuth =
  (token, refreshToken, shouldCreateFiling) => async (dispatch) => {
    dispatch(authBegin())
    if (token) {
      localStorage.setItem('jwtToken', token)
    }
    if (refreshToken) {
      localStorage.setItem('jwtTokenRefresh', refreshToken)
    }
    try {
      localStorage.removeItem('actualPerson')
      const { data: user } = await api.authMe()
      const { last_filing: lastFiling, own_person: ownPerson } = user || {}
      if (!lastFiling && shouldCreateFiling) {
        const { data: personFiling } = await formApi.postFiling(
          user.country_code,
          MAX_TAX_YEAR,
          ownPerson
        )
        user.last_filing = personFiling
      }
      dispatch(setPersonalInfo(user))
      localStorage.setItem('actualPerson', JSON.stringify(user.own_person))
      dispatch(authSuccess(user))
    } catch (error) {
      captureSentryException(error)
      dispatch(authSSOError(error))
    }
  }

/**
 * Gets SSO Data for discourse login
 * @param {string} sso
 * @param {string} sig
 * @returns discourse sso key
 */
export const getDiscourseSSO = (sso, sig) => async (dispatch) => {
  try {
    dispatch(startLoading())
    const res = await api.getDiscourseSSO(sso, sig)
    const { sso_login: data } = res.data
    dispatch({ type: actions.SET_DISCOURSE_SSO, payload: data })
  } catch (error) {
    captureSentryException(error)
  } finally {
    dispatch(stopLoading())
  }
}

export const requestEmailValidation = () => async (dispatch) => {
  try {
    dispatch(startLoading())
    await api.requestEmailValidation()
  } catch (error) {
    captureSentryException(error)
    message.error(translate('validateEmail.errorMessage'))
  } finally {
    dispatch(stopLoading())
  }
}

export const changeEmail = (newEmail) => async (dispatch, getStore) => {
  try {
    dispatch(startLoading())
    const { personalInfo } = getStore()
    const { id: userId } = personalInfo
    await api.changeUserEmail(userId, newEmail)
    dispatch(updatePersonalInfo({ email: newEmail }))
    message.info(translate('validateEmail.changeEmail.request.success'))
    return true
  } catch (error) {
    const { status } = error.response || {}
    if (![CONFLICT, NOT_FOUND].includes(status)) {
      captureSentryException(error)
      message.error(translate('validateEmail.changeEmail.request.error'))
    } else if (status === CONFLICT) {
      message.error(translate('validateEmail.changeEmail.request.forbidden'))
    }
    return false
  } finally {
    dispatch(stopLoading())
  }
}
