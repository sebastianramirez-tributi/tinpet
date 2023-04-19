import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import axios from 'axios'
import { message } from 'antd'

import { BAD_REQUEST } from '../../../constants/response'
import * as actions from '../actions'
import { ACTION_TYPES as GENERAL_ACTION_TYPES } from '../../general/actions'
import { ACTION_TYPES as PERSONAL_INFO_ACTIONS } from '../../personalInfo/constants'
import {
  AUTH_BEGIN,
  AUTH_SUCCESS,
  AUTH_ERROR,
  AUTH_SSO_ERROR,
  FORGOT_PASSWORD_BEGIN,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_ERROR,
  CHANGE_PASSWORD_BEGIN,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR,
  SET_DISCOURSE_SSO,
} from '../../../redux/actionTypes'

import { captureSentryException } from '../../../sentry'
import { getMaxTaxYear } from '../../../helpers/collections'
import {
  SUBDOMAIN_TEMPLATE,
  SUBDOMAIN_TOKEN,
} from '../../../constants/subdomains'
import { ROLES } from '../../../constants/person'
jest.mock('../../../sentry')
const MAX_TAX_YEAR = getMaxTaxYear()

const middleware = [thunk]
const mockStore = configureMockStore(middleware)

const MOCK_PERSON = {
  country_code: 'CO',
  own_person: {
    document_id: '75380777',
    email: 'example2@email.com',
    first_name: 'First Names',
    is_own_person: true,
    last_name: 'Last Names',
    phone: '151212121',
    user_document_type: 'cedula_de_ciudadania',
    tax_year: MAX_TAX_YEAR,
  },
}

const MOCK_FILING = {
  id: 'test-filing-id',
}

describe('auth action creators', () => {
  let store
  beforeEach(() => {
    store = mockStore({})
  })
  describe('login', () => {
    const assignMock = jest.fn()
    beforeAll(() => {
      delete window.location
      window.location = { assign: assignMock }
    })
    afterAll(() => {
      assignMock.mockClear()
    })
    it('Should login properly', async () => {
      const username = 'test@test.com'
      const password = 'passtest'
      const RESPONSE = {
        access: 'accessToken',
        refresh: 'refreshToken',
        user: {},
      }
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: AUTH_BEGIN },
        {
          type: PERSONAL_INFO_ACTIONS.SET_INFO,
          payload: {},
        },
        { type: AUTH_SUCCESS, userInfo: RESPONSE },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const expectedRequestData = { email: username, password }
      axios.post.mockResolvedValue({ data: RESPONSE })
      await store.dispatch(actions.login(username, password))
      expect(axios.post).toBeCalled()
      expect(axios.post).toHaveBeenCalledWith(
        'auth/jwt/login',
        expectedRequestData
      )
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('Should failed login', async () => {
      window.scrollTo = jest.fn()
      const username = 'test@test.com'
      const password = 'badpasstest'
      const ERROR = {
        data: {
          email: 'El correo y/o contraseña suministrado es inválido',
        },
      }
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: AUTH_BEGIN },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
        { type: AUTH_ERROR, error: { response: ERROR } },
      ]
      const expectedRequestData = { email: username, password }
      axios.post.mockRejectedValue({ response: ERROR })
      await store.dispatch(actions.login(username, password))
      expect(axios.post).toBeCalled()
      expect(axios.post).toHaveBeenCalledWith(
        'auth/jwt/login',
        expectedRequestData
      )
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('should redirect when partner and domain are different and user is tax_filer', async () => {
      const username = 'test@test.com'
      const password = 'passtest'
      const PARTNER = 'bancolombia'
      const redirectOnPartner = true
      const RESPONSE = {
        access: 'accessToken',
        refresh: 'refreshToken',
        user: { partner: PARTNER, role: ROLES.TAX_FILER },
      }
      const EXPECTED_REDIRECT =
        SUBDOMAIN_TEMPLATE.replace(SUBDOMAIN_TOKEN, PARTNER) +
        `/signin?token=${RESPONSE.access}&refresh=${RESPONSE.refresh}`
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: AUTH_BEGIN },
      ]
      const expectedRequestData = { email: username, password }
      axios.post.mockResolvedValue({ data: RESPONSE })
      await store.dispatch(
        actions.login(username, password, undefined, redirectOnPartner)
      )
      expect(axios.post).toBeCalled()
      expect(axios.post).toHaveBeenCalledWith(
        'auth/jwt/login',
        expectedRequestData
      )
      expect(window.location.href).toBe(EXPECTED_REDIRECT)
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('should redirect when partner and domain are different and user is tax_filer, and partner is app', async () => {
      const username = 'test@test.com'
      const password = 'passtest'
      const PARTNER = 'app'
      const TOKEN = 'token'
      const redirectOnPartner = true
      const RESPONSE = {
        access: 'accessToken',
        refresh: 'refreshToken',
        user: { partner: PARTNER, role: ROLES.TAX_FILER },
      }
      const EXPECTED_REDIRECT =
        SUBDOMAIN_TEMPLATE.replace(SUBDOMAIN_TOKEN, 'declarantes') +
        `/signin?token=${RESPONSE.access}&refresh=${RESPONSE.refresh}`
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: AUTH_BEGIN },
      ]
      const expectedRequestData = { email: username, password, token: TOKEN }
      axios.post.mockResolvedValue({ data: RESPONSE })
      await store.dispatch(
        actions.login(
          username,
          password,
          TOKEN,
          redirectOnPartner,
          'bancolombia'
        )
      )
      expect(axios.post).toBeCalled()
      expect(axios.post).toHaveBeenCalledWith(
        'auth/jwt/login',
        expectedRequestData
      )
      expect(window.location.href).toBe(EXPECTED_REDIRECT)
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('should redirect when partner and domain are different and user is tax_filer in loginSocial', async () => {
      const TOKEN = 'token'
      const PARTNER = 'bancolombia'
      const redirectOnPartner = true
      const RESPONSE = {
        access: 'accessToken',
        refresh: 'refreshToken',
        user: { partner: PARTNER, role: ROLES.TAX_FILER },
      }
      const EXPECTED_REDIRECT =
        SUBDOMAIN_TEMPLATE.replace(SUBDOMAIN_TOKEN, PARTNER) +
        `/signin?token=${RESPONSE.access}&refresh=${RESPONSE.refresh}`
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: AUTH_BEGIN },
      ]
      const expectedRequestData = { token: TOKEN }
      axios.post.mockResolvedValue({ data: RESPONSE })
      await store.dispatch(actions.loginSocial(TOKEN, redirectOnPartner))
      expect(axios.post).toBeCalled()
      expect(axios.post).toHaveBeenCalledWith(
        'auth/jwt/auth0login/',
        expectedRequestData
      )
      expect(window.location.href).toBe(EXPECTED_REDIRECT)
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('should redirect when partner and domain are different and user is tax_filer in loginSocial, and partner is app', async () => {
      const TOKEN = 'token'
      const PARTNER = 'app'
      const redirectOnPartner = true
      const RESPONSE = {
        access: 'accessToken',
        refresh: 'refreshToken',
        user: { partner: PARTNER, role: ROLES.TAX_FILER },
      }
      const EXPECTED_REDIRECT =
        SUBDOMAIN_TEMPLATE.replace(SUBDOMAIN_TOKEN, 'declarantes') +
        `/signin?token=${RESPONSE.access}&refresh=${RESPONSE.refresh}`
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: AUTH_BEGIN },
      ]
      const expectedRequestData = { token: TOKEN }
      axios.post.mockResolvedValue({ data: RESPONSE })
      await store.dispatch(
        actions.loginSocial(TOKEN, redirectOnPartner, 'bancolombia')
      )
      expect(axios.post).toBeCalled()
      expect(axios.post).toHaveBeenCalledWith(
        'auth/jwt/auth0login/',
        expectedRequestData
      )
      expect(window.location.href).toBe(EXPECTED_REDIRECT)
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('should not redirect when partner and domain are different and user is assitant in loginSocial, and partner is app', async () => {
      const TOKEN = 'token'
      const PARTNER = 'app'
      const redirectOnPartner = true
      const RESPONSE = {
        access: 'accessToken',
        refresh: 'refreshToken',
        user: { partner: PARTNER, role: ROLES.ASSISTANT },
      }
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: AUTH_BEGIN },
        {
          type: PERSONAL_INFO_ACTIONS.SET_INFO,
          payload: RESPONSE.user,
        },
        { type: AUTH_SUCCESS, userInfo: RESPONSE },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const expectedRequestData = { token: TOKEN }
      axios.post.mockResolvedValue({ data: RESPONSE })
      await store.dispatch(
        actions.loginSocial(TOKEN, redirectOnPartner, 'bancolombia')
      )
      expect(axios.post).toBeCalled()
      expect(axios.post).toHaveBeenCalledWith(
        'auth/jwt/auth0login/',
        expectedRequestData
      )
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('Should handleSSOAuth without creating a filing', async () => {
    const TOKEN = 'token'
    const REFRESH = 'refresh'
    const shouldCreateFiling = false
    const expectedActions = [
      { type: AUTH_BEGIN },
      { type: PERSONAL_INFO_ACTIONS.SET_INFO, payload: MOCK_PERSON },
      { type: AUTH_SUCCESS, userInfo: MOCK_PERSON },
    ]
    axios.get.mockResolvedValue({ data: MOCK_PERSON })
    await store.dispatch(
      actions.handleSSOAuth(TOKEN, REFRESH, shouldCreateFiling)
    )
    expect(axios.get).toBeCalled()
    expect(axios.get).toHaveBeenCalledWith('/auth/users/me')
    expect(axios.post).not.toBeCalled()
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('Should handleSSOAuth creating a filing', async () => {
    const TOKEN = 'token'
    const REFRESH = 'refresh'
    const shouldCreateFiling = true
    const expectedActions = [
      { type: AUTH_BEGIN },
      { type: PERSONAL_INFO_ACTIONS.SET_INFO, payload: MOCK_PERSON },
      { type: AUTH_SUCCESS, userInfo: MOCK_PERSON },
    ]
    const { own_person: ownPerson } = MOCK_PERSON
    const expectedFilingBody = {
      country_code: MOCK_PERSON.country_code,
      tax_year: ownPerson.tax_year,
      person_id: ownPerson.id,
      first_name: ownPerson.first_name,
      last_name: ownPerson.last_name,
      user_document_type: ownPerson.user_document_type,
      document_id: ownPerson.document_id,
    }
    axios.get.mockResolvedValue({ data: MOCK_PERSON })
    axios.post.mockResolvedValue({ data: MOCK_FILING })
    await store.dispatch(
      actions.handleSSOAuth(TOKEN, REFRESH, shouldCreateFiling)
    )
    expect(axios.get).toBeCalled()
    expect(axios.get).toHaveBeenCalledWith('/auth/users/me')
    expect(axios.post).toBeCalled()
    expect(axios.post).toHaveBeenCalledWith('/filings', expectedFilingBody)
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('Should handleSSOAuth error', async () => {
    const shouldCreateFiling = false
    const ERROR = {
      response: {
        data: 'Invalid JWT',
      },
    }
    const expectedActions = [
      { type: AUTH_BEGIN },
      { type: AUTH_SSO_ERROR, error: ERROR },
    ]
    axios.get.mockRejectedValue({ ...ERROR })
    await store.dispatch(actions.handleSSOAuth(null, null, shouldCreateFiling))
    expect(axios.get).toBeCalled()
    expect(axios.get).toHaveBeenCalledWith('/auth/users/me')
    expect(captureSentryException).toBeCalled()
    expect(captureSentryException).toHaveBeenCalledWith({ ...ERROR })
    expect(store.getActions()).toEqual(expectedActions)
  })

  describe('Discourse sso', () => {
    it('should dispatch sso token', async () => {
      const TOKEN = 'sso-testing-token'
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: SET_DISCOURSE_SSO, payload: TOKEN },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]

      axios.post.mockResolvedValue({ data: { sso_login: TOKEN } })
      await store.dispatch(actions.getDiscourseSSO('sso', 'sig'))
      expect(axios.post).toHaveBeenCalledWith('/sso/discourse', {
        sso: 'sso',
        sig: 'sig',
      })
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  describe('sendForgotPassword', () => {
    it('should call properly service', async () => {
      const EMAIL = 'test@email.com'
      const TOKEN = 'test-token'
      const pathName = 'auth/users/reset_password'
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: FORGOT_PASSWORD_BEGIN },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
        { type: FORGOT_PASSWORD_SUCCESS },
      ]
      axios.post.mockResolvedValue()
      await store.dispatch(actions.sendForgotPassword(EMAIL, TOKEN))
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.post).toBeCalledWith(pathName, {
        email: EMAIL,
        token: TOKEN,
      })
    })

    it('should handle error properly in service', async () => {
      const EMAIL = 'test@email.com'
      const TOKEN = 'test-token'
      const pathName = 'auth/users/reset_password'
      const ERROR = { status: 400 }
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: FORGOT_PASSWORD_BEGIN },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
        { type: FORGOT_PASSWORD_ERROR, error: ERROR },
      ]
      axios.post.mockRejectedValue(ERROR)
      await store.dispatch(actions.sendForgotPassword(EMAIL, TOKEN))
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.post).toBeCalledWith(pathName, {
        email: EMAIL,
        token: TOKEN,
      })
      expect(captureSentryException).toBeCalled()
    })
  })

  describe('changeUserPassword', () => {
    it('should handle fulfillment when endpoint respond OK', async () => {
      const spy = jest.spyOn(message, 'success')
      const expectedActions = [
        { type: CHANGE_PASSWORD_BEGIN },
        { type: CHANGE_PASSWORD_SUCCESS },
      ]
      const PAYLOAD = {
        email: 'test@test.com',
        new_password: 'p4$$w0rd',
      }
      axios.post.mockResolvedValueOnce({})
      await store.dispatch(actions.changeUserPassword(PAYLOAD))
      expect(axios.post).toBeCalled()
      expect(axios.post).toHaveBeenCalledWith('auth/change-password', PAYLOAD)
      expect(store.getActions()).toEqual(expectedActions)
      expect(spy).toBeCalled()
      expect(spy).toBeCalledWith('Contraseña cambiada exitosamente')
      spy.mockRestore()
    })

    it('should handle error when endpoint respond 400', async () => {
      const spy = jest.spyOn(message, 'error')
      const RESPONSE = {
        status: BAD_REQUEST,
        data: ['Por favor elige una contraseña más segura.'],
      }
      const expectedActions = [
        { type: CHANGE_PASSWORD_BEGIN },
        { type: CHANGE_PASSWORD_ERROR },
      ]
      const PAYLOAD = {
        email: 'test@test.com',
        new_password: '123hello123',
      }
      axios.post.mockRejectedValueOnce({ response: RESPONSE })
      await store.dispatch(actions.changeUserPassword(PAYLOAD))
      expect(axios.post).toBeCalled()
      expect(axios.post).toHaveBeenCalledWith('auth/change-password', PAYLOAD)
      expect(store.getActions()).toEqual(expectedActions)
      expect(spy).toBeCalled()
      expect(spy).toBeCalledWith(RESPONSE.data[0])
      spy.mockRestore()
    })

    it('should handle error when endpoint respond undefined', async () => {
      const spy = jest.spyOn(message, 'error')
      const RESPONSE = {}
      const expectedActions = [
        { type: CHANGE_PASSWORD_BEGIN },
        { type: CHANGE_PASSWORD_ERROR },
      ]
      const PAYLOAD = {
        email: 'test@test.com',
        new_password: '123hello123',
      }
      axios.post.mockRejectedValueOnce({ response: RESPONSE })
      await store.dispatch(actions.changeUserPassword(PAYLOAD))
      expect(axios.post).toBeCalled()
      expect(axios.post).toHaveBeenCalledWith('auth/change-password', PAYLOAD)
      expect(store.getActions()).toEqual(expectedActions)
      expect(spy).toBeCalled()
      expect(spy).toBeCalledWith(
        'No se pudo cambiar la contraseña, intenta de nuevo más tarde'
      )
      spy.mockRestore()
    })
  })

  describe('requestEmailValidation', () => {
    it('should call `/users/send-validate-email`', async () => {
      axios.get.mockResolvedValue({ response: true })
      await store.dispatch(actions.requestEmailValidation())
      expect(axios.get).toBeCalled()
      expect(axios.get).toBeCalledWith('/users/send-validate-email')
      expect(store.getActions()).toEqual([
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ])
    })

    it('should handle call with error', async () => {
      const ERROR = 'error mock'
      axios.get.mockRejectedValue(ERROR)
      await store.dispatch(actions.requestEmailValidation())
      expect(axios.get).toBeCalled()
      expect(axios.get).toBeCalledWith('/users/send-validate-email')
      expect(store.getActions()).toEqual([
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ])
      expect(captureSentryException).toBeCalled()
      expect(captureSentryException).toHaveBeenCalledWith(ERROR)
    })
  })

  describe('changeEmail', () => {
    const USER_ID = 'test-id'

    beforeEach(() => {
      store = mockStore({
        personalInfo: {
          id: USER_ID,
        },
      })
    })

    it('should call `/users/:userId`', async () => {
      const EMAIL = 'test@tributi.com'
      const messageSpy = jest.spyOn(message, 'info')
      axios.put.mockResolvedValue({ response: true })
      await store.dispatch(actions.changeEmail(EMAIL))
      expect(axios.put).toBeCalled()
      expect(axios.put).toBeCalledWith(`/users/${USER_ID}`, { email: EMAIL })
      expect(store.getActions()).toEqual([
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        {
          type: PERSONAL_INFO_ACTIONS.UPDATE_INFO,
          payload: {
            merge: true,
            personalInfo: {
              email: EMAIL,
            },
          },
        },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ])
      expect(messageSpy).toHaveBeenCalledWith(
        'Email actualizado exitosamente. Revisa el correo que acabamos de enviarte al nuevo email.'
      )
    })

    it('should handle call with error', async () => {
      const EMAIL = 'test@tributi.com'
      const ERROR = 'error mock'
      const messageSpy = jest.spyOn(message, 'error')
      axios.put.mockRejectedValue(ERROR)
      await store.dispatch(actions.changeEmail(EMAIL))
      expect(axios.put).toBeCalled()
      expect(axios.put).toBeCalledWith(`/users/${USER_ID}`, { email: EMAIL })
      expect(store.getActions()).toEqual([
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ])
      expect(captureSentryException).toBeCalled()
      expect(captureSentryException).toHaveBeenCalledWith(ERROR)
      expect(messageSpy).toHaveBeenCalledWith(
        'No pudimos cambiar tu email, intenta nuevamente'
      )
    })

    it('should handle call with error 409', async () => {
      const EMAIL = 'test@tributi.com'
      const ERROR = { response: { status: 409 } }
      const messageSpy = jest.spyOn(message, 'error')
      axios.put.mockRejectedValue(ERROR)
      await store.dispatch(actions.changeEmail(EMAIL))
      expect(axios.put).toBeCalled()
      expect(axios.put).toBeCalledWith(`/users/${USER_ID}`, { email: EMAIL })
      expect(store.getActions()).toEqual([
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ])
      expect(captureSentryException).not.toHaveBeenCalled()
      expect(messageSpy).toHaveBeenCalledWith(
        'Ese email ya se encuentra registrado.'
      )
    })
  })
})
