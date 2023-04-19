import { message } from 'antd'
import { startLoading, stopLoading } from '../general/actions'
import { setCurrentFiling, setPersonalInfo } from '../personalInfo/actions'
import api from './api'
import apiPayment from '../payment/api'
import { captureSentryException } from '../../sentry'
import { recaptchaAction } from '../../HOC/withRecaptcha'
import { BAD_REQUEST } from '../../constants/response'
import { ROLES } from '../../constants/person'

import {
  REGISTER_BEGIN,
  REGISTER_ERROR,
  REGISTER_SUCCESS,
  CLEAR_ERROR,
  ERROR_UPDATE_FILLING_STATUS,
  GET_PLAN_BEGIN,
  GET_PLAN_SUCCESS,
  GET_PLAN_ERROR,
  GET_COUNTRY_BEGIN,
  GET_COUNTRY_SUCCESS,
  GET_COUNTRY_ERROR,
  UPDATE_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_ERROR,
  SEARCH_USER_BY_FILLING_BEGIN,
  SEARCH_USER_BY_FILLING_SUCCESS,
  SEARCH_USER_BY_FILLING_ERROR,
  CLEAR_LOCAL_OBJECTS,
  SEARCH_USER_BY_FILLING_0_RESULTS,
  CHANGE_FILING_ACTIVE_STATUS_BEGIN,
  CHANGE_FILING_ACTIVE_STATUS_SUCCESS,
  CHANGE_FILING_ACTIVE_STATUS_ERROR,
  SEARCH_ASSISTANT_USERS_SUCCESS,
  SEARCH_ASSISTANT_USERS_ERROR,
  SEARCH_ASSISTANT_PERSONS_SUCCESS,
  SEARCH_ASSISTANT_PERSONS_ERROR,
  SEARCH_ASSISTANT_FILINGS_BY_PERSON_SUCCESS,
  SEARCH_ASSISTANT_FILINGS_BY_PERSON_ERROR,
  SEARCH_ASSISTANT_DOCUMENTS_BY_FILING_SUCCESS,
  SEARCH_ASSISTANT_DOCUMENTS_BY_FILING_ERROR,
  SEARCH_ASSISTANT_ENGINES_BY_FILING_SUCCESS,
  SEARCH_ASSISTANT_ENGINES_BY_FILING_ERROR,
  SEARCH_ASSISTANT_PAYMENTS_BY_FILING_SUCCESS,
  SEARCH_ASSISTANT_PAYMENTS_BY_FILING_ERROR,
  SAVE_ASSISTANT_USER_SUCCESS,
  SAVE_ASSISTANT_USER_ERROR,
  SAVE_ASSISTANT_PERSON_SUCCESS,
  SAVE_ASSISTANT_PERSON_ERROR,
  CLEAR_ALL_ASSISTANT_DATA,
  UPDATE_ASSISTANT_LOCAL_STATE,
  SEARCH_ASSISTANT_FILINGS_BY_USER_SUCCESS,
  SEARCH_ASSISTANT_FILINGS_BY_USER_ERROR,
  SEARCH_ASSISTANT_FIREBASE_DOCUMENT_STATUS_SUCCESS,
  SEARCH_ASSISTANT_FIREBASE_DOCUMENT_STATUS_ERROR,
  GET_BLOB_FILE_SUCCESS,
  CLEAR_BLOB_FILE_SUCCESS,
  CLEAR_MESSAGE_TO_SHOW,
  UPDATE_ASSISTANT_USERS_SUCCESS,
  CHANGE_FILLING_ORDER_ASSISTANT_ERROR,
  CHANGE_FILLING_ORDER_ASSISTANT_SUCCESS,
  SWAP_ACCOUNT_FROM_ASSISTANT_SUCCESS,
  CHANGE_FILLING_ORDER_ASSISTANT_BEGIN,
  SWAP_ACCOUNT_FROM_ASSISTANT_ERROR,
  CHANGE_ORDER_STATUS_BEGIN,
  CHANGE_ORDER_STATUS_ERROR,
  CHANGE_ORDER_STATUS_SUCCESS,
  GET_FILINGS_BY_EMAIL_BEGIN,
  GET_FILINGS_BY_EMAIL_ERROR,
  GET_FILINGS_BY_EMAIL_SUCCESS,
  DIAN_CREDENTIALS_ASSISTANT_SUCCESS,
  DIAN_CREDENTIALS_ASSISTANT_ERROR,
  ASSISTANT_REFUND_PAYMENT_BEGIN,
  ASSISTANT_REFUND_PAYMENT_ERROR,
  ASSISTANT_REFUND_PAYMENT_SUCCESS,
  ASSISTANT_REQUEST_REFUND_PAYMENT_ERROR,
  ASSISTANT_REQUEST_REFUND_PAYMENT_SUCCESS,
} from '../actionTypes'
import _ from 'lodash'
import RedirectUser from '../../helpers/redirect-user'
import { getMaxTaxYear } from '../../helpers/collections'
import { CONFLICT } from '../../constants/response'
import { PAYMENT_STATUS } from '../../constants/payment'

const MAX_TAX_YEAR = getMaxTaxYear()

const registerBegin = () => ({ type: REGISTER_BEGIN })
const registerError = (error) => ({ type: REGISTER_ERROR, error })
const registerSuccess = (data) => ({ type: REGISTER_SUCCESS, data })
const clearErrorState = () => ({ type: CLEAR_ERROR, error: null })

const planBegin = () => ({ type: GET_PLAN_BEGIN })
const planError = (error) => ({ type: GET_PLAN_ERROR, error })
const planSuccess = (data) => ({ type: GET_PLAN_SUCCESS, data })

const countryBegin = () => ({ type: GET_COUNTRY_BEGIN })
const countrySuccess = (data) => ({ type: GET_COUNTRY_SUCCESS, data })
const countryError = (error) => ({ type: GET_COUNTRY_ERROR, error })

const updateUser = (data) => ({ type: UPDATE_USER, data })
const updateUserError = (error) => ({ type: UPDATE_USER_ERROR, error })

const searchUserByFillingBegin = () => ({ type: SEARCH_USER_BY_FILLING_BEGIN })
const searchFilingsByUserEmailSuccess = (data) => ({
  type: SEARCH_USER_BY_FILLING_SUCCESS,
  data,
})
const searchFilingsByUserEmailSuccess0Results = () => ({
  type: SEARCH_USER_BY_FILLING_0_RESULTS,
})
const searchFilingsByUserEmailError = (error) => ({
  type: SEARCH_USER_BY_FILLING_ERROR,
  error,
})

const changeFilingActiveStatusBegin = () => ({
  type: CHANGE_FILING_ACTIVE_STATUS_BEGIN,
})

const changeFilingActiveStatusSuccess = (filingId, isActive) => ({
  type: CHANGE_FILING_ACTIVE_STATUS_SUCCESS,
  payload: { filingId, isActive },
})

const changeFilingActiveStatusError = (error) => ({
  type: CHANGE_FILING_ACTIVE_STATUS_ERROR,
  payload: error,
})

const errorUpdateFillingStatus = (error) => ({
  type: ERROR_UPDATE_FILLING_STATUS,
  error,
})

export const clearLocalObjects = (data) => ({ type: CLEAR_LOCAL_OBJECTS })

// Assistant v2
const searchAssistantUsersSuccess = (data, assistantState) => ({
  type: SEARCH_ASSISTANT_USERS_SUCCESS,
  data,
  assistantState,
})

const searchAssistantUsersError = (error) => ({
  type: SEARCH_ASSISTANT_USERS_ERROR,
  error,
})

const searchAssistantPersonsSuccess = (data, assistantState) => ({
  type: SEARCH_ASSISTANT_PERSONS_SUCCESS,
  data,
  assistantState,
})

const searchAssistantPersonsError = (error) => ({
  type: SEARCH_ASSISTANT_PERSONS_ERROR,
  error,
})

const searchAssistantFilingsByPersonSuccess = (data, assistantState) => ({
  type: SEARCH_ASSISTANT_FILINGS_BY_PERSON_SUCCESS,
  data,
  assistantState,
})

const searchAssistantFilingsByPersonError = (error) => ({
  type: SEARCH_ASSISTANT_FILINGS_BY_PERSON_ERROR,
  error,
})

const searchAssistantDocumentsByFilingnSuccess = (data, assistantState) => ({
  type: SEARCH_ASSISTANT_DOCUMENTS_BY_FILING_SUCCESS,
  data,
  assistantState,
})

const searchAssistantDocumentsByFilingnError = (error) => ({
  type: SEARCH_ASSISTANT_DOCUMENTS_BY_FILING_ERROR,
  error,
})

const searchAssistantEnginesByFilingnSuccess = (data, assistantState) => ({
  type: SEARCH_ASSISTANT_ENGINES_BY_FILING_SUCCESS,
  data,
  assistantState,
})

const searchAssistantEnginesByFilingnError = (error) => ({
  type: SEARCH_ASSISTANT_ENGINES_BY_FILING_ERROR,
  error,
})

const searchAssistantPaymentsByFilingnSuccess = (data, assistantState) => ({
  type: SEARCH_ASSISTANT_PAYMENTS_BY_FILING_SUCCESS,
  data,
  assistantState,
})

const searchAssistantPaymentsByFilingnError = (error) => ({
  type: SEARCH_ASSISTANT_PAYMENTS_BY_FILING_ERROR,
  error,
})

const saveAssistantUserSuccess = (data, message) => ({
  type: SAVE_ASSISTANT_USER_SUCCESS,
  data,
  message,
})

const saveAssistantUserError = (error) => ({
  type: SAVE_ASSISTANT_USER_ERROR,
  error,
})

const saveAssistantPersonSuccess = (data) => ({
  type: SAVE_ASSISTANT_PERSON_SUCCESS,
  data,
})

const saveAssistantPersonError = (error) => ({
  type: SAVE_ASSISTANT_PERSON_ERROR,
  error,
})

const clearAllAssistanData = () => ({
  type: CLEAR_ALL_ASSISTANT_DATA,
})

const updateAssistantLocalState = (data) => ({
  type: UPDATE_ASSISTANT_LOCAL_STATE,
  data,
})

const searchAssistantFilingsByUserSuccess = (data, assistantState) => ({
  type: SEARCH_ASSISTANT_FILINGS_BY_USER_SUCCESS,
  data,
  assistantState,
})

const searchAssistantFilingsByUserError = (error) => ({
  type: SEARCH_ASSISTANT_FILINGS_BY_USER_ERROR,
  error,
})

const firebaseDocumentStatusSuccess = (payload) => ({
  type: SEARCH_ASSISTANT_FIREBASE_DOCUMENT_STATUS_SUCCESS,
  payload,
})

const firebaseDocumentStatusError = () => ({
  type: SEARCH_ASSISTANT_FIREBASE_DOCUMENT_STATUS_ERROR,
})

const getBlobFileSuccess = (blob, currentEngine) => ({
  type: GET_BLOB_FILE_SUCCESS,
  blob,
  currentEngine,
})

const clearBlobFileSuccess = () => ({
  type: CLEAR_BLOB_FILE_SUCCESS,
})

const clearMessageToShow = () => ({
  type: CLEAR_MESSAGE_TO_SHOW,
})

const updateAssistantUsersSuccess = (data) => ({
  type: UPDATE_ASSISTANT_USERS_SUCCESS,
  data,
})

const changeFillingOrderAssistantBegin = () => ({
  type: CHANGE_FILLING_ORDER_ASSISTANT_BEGIN,
})

const changeFillingOrderAssistantError = (error) => ({
  type: CHANGE_FILLING_ORDER_ASSISTANT_ERROR,
  error,
})

const changeFillingOrderAssistantSuccess = (data) => ({
  type: CHANGE_FILLING_ORDER_ASSISTANT_SUCCESS,
  data,
})

const swapAccountFromAssistantSuccess = (data, assistantState) => ({
  type: SWAP_ACCOUNT_FROM_ASSISTANT_SUCCESS,
  data,
  assistantState,
})

const swapAccountFromAssistantError = (error) => ({
  type: SWAP_ACCOUNT_FROM_ASSISTANT_ERROR,
  error,
})

const changeOrderStatusBegin = () => ({
  type: CHANGE_ORDER_STATUS_BEGIN,
})

const changeOrderStatusError = (error) => ({
  type: CHANGE_ORDER_STATUS_ERROR,
  error,
})

const changeStatusSuccess = (orderId, status) => ({
  type: CHANGE_ORDER_STATUS_SUCCESS,
  payload: { orderId, status },
})

const getFillingsByEmailBegin = () => ({
  type: GET_FILINGS_BY_EMAIL_BEGIN,
})

const getFilingsByEmailSuccess = (data, assistantState) => ({
  type: GET_FILINGS_BY_EMAIL_SUCCESS,
  data,
  assistantState,
})

const dianCredentialsAssistantSuccess = (data, assistantState) => ({
  type: DIAN_CREDENTIALS_ASSISTANT_SUCCESS,
  data,
  assistantState,
})

const geFilingsByEmailError = () => ({
  type: GET_FILINGS_BY_EMAIL_ERROR,
})

const dianCredentialsAssistantError = (error) => ({
  type: DIAN_CREDENTIALS_ASSISTANT_ERROR,
  error,
})

const assistantRefundPaymentBegin = () => ({
  type: ASSISTANT_REFUND_PAYMENT_BEGIN,
})

const assistantRefundPaymentError = (error) => ({
  type: ASSISTANT_REFUND_PAYMENT_ERROR,
  error,
})

const assistantRefundPaymentSuccess = () => ({
  type: ASSISTANT_REFUND_PAYMENT_SUCCESS,
})

const assistantRequestRefundPaymentError = (error) => ({
  type: ASSISTANT_REQUEST_REFUND_PAYMENT_ERROR,
  error,
})

const assistantRequestRefundPaymentSuccess = (data, assistantState) => ({
  type: ASSISTANT_REQUEST_REFUND_PAYMENT_SUCCESS,
  data,
  assistantState,
})

export const clearError = () => (dispatch) => {
  return dispatch(clearErrorState(null))
}

export const register = (data, isSura) => async (dispatch) => {
  dispatch(startLoading())
  dispatch(registerBegin())
  try {
    const registerProcess = await api.register(data)
    recaptchaAction(async (token) => {
      const login = await api.login(data.email, data.password, token)
      const infoUser = login.data.user
      if (!infoUser.is_validate_email) {
        message.info(
          'Hemos enviado un correo electrónico para validar tu email'
        )
      }

      localStorage.setItem('jwtToken', login.data.access)
      dispatch(setPersonalInfo(infoUser))
      localStorage.setItem('actualPerson', JSON.stringify(infoUser.own_person))
      // google send data registration
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'formSubmitted',
        formName: 'App Registration',
      })
      // In Sura the document_id it's the password
      if (isSura) {
        registerProcess.data.document_id = data.password
      }
      dispatch(stopLoading())
      dispatch(registerSuccess(registerProcess.data))
    })
  } catch (e) {
    dispatch(stopLoading())
    captureSentryException(e, [BAD_REQUEST])
    dispatch(registerError(e))
  }
}

export const update =
  (data, utmParams = {}) =>
  async (dispatch, getState) => {
    dispatch(startLoading())
    const { personalInfo } = getState()
    try {
      const { data: updatePersonInfo } = await api.patchPerson(
        personalInfo.own_person.id,
        {
          user_document_type: data.user_document_type,
          document_id: data.document_id,
          phone: data.phone,
          first_name: data.first_name,
          last_name: data.last_name,
        }
      )
      const { data: updateUserinfo } = await api.putUserInfo(personalInfo.id, {
        national_id: data.document_id,
        ...data,
        ...utmParams,
      })
      const { data: createdPersonFiling } = await api.postFiling(
        personalInfo.country_code,
        MAX_TAX_YEAR,
        updatePersonInfo
      )

      updateUserinfo.last_filing = createdPersonFiling

      dispatch(setPersonalInfo(updateUserinfo))
      localStorage.removeItem('actualPerson')
      localStorage.setItem(
        'actualPerson',
        JSON.stringify(updateUserinfo.own_person)
      )
      updateUserinfo.next = 'plans'
      dispatch(updateUser(updateUserinfo))
    } catch (e) {
      message.error(
        'Hubo un error actualizando tu información, por favor intenta de nuevo'
      )
      captureSentryException(e)
      dispatch(updateUserError(e))
    }

    dispatch(stopLoading())
  }

export const createNewFilling = (data) => (dispatch) => {
  api
    .createfillingPlan(data)
    .then((response) => {
      dispatch(updateUser(response.data))
    })
    .catch((error) => captureSentryException(error))
}

export const getProductPlan = (country) => (dispatch) => {
  dispatch(planBegin())
  api
    .getPlans(country)
    .then((response) => {
      dispatch(planSuccess(response.data))
    })
    .catch((error) => {
      captureSentryException(error)
      dispatch(planError(error))
    })
}

export const editPersonAsAssistant =
  (data, personId, email) => async (dispatch) => {
    try {
      dispatch(startLoading())
      await api.editPerson(data, personId)
      dispatch(searchUserByFillingBegin())
      const getPersonList = await api.getFilingsByEmail({ fillingId: email })
      dispatch(searchFilingsByUserEmailSuccess(getPersonList.data))
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(searchFilingsByUserEmailError(error))
    }
  }

export const getAssistantFilling = (data) => async (dispatch) => {
  dispatch(startLoading())
  dispatch(searchUserByFillingBegin())

  try {
    const response = await api.getFilingsByEmail(data)
    if (response.data.length === 0) {
      dispatch(searchFilingsByUserEmailSuccess0Results())
    } else {
      dispatch(searchFilingsByUserEmailSuccess(response.data))
    }
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)
    dispatch(searchFilingsByUserEmailError(error))
  }
}

export const changeFilingOrderAssistant = (data) => async (dispatch) => {
  dispatch(startLoading())
  dispatch(changeFillingOrderAssistantBegin())

  try {
    const response = await api.putChangeOrderFiling(data)
    dispatch(changeFillingOrderAssistantSuccess(response.data))
    message.success('Transferencia realizada exitosamente.')
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)
    dispatch(changeFillingOrderAssistantError(error))
  }
}

export const changeFilingActiveStatus =
  (filingId, isActive) => async (dispatch) => {
    dispatch(startLoading())
    dispatch(changeFilingActiveStatusBegin())
    try {
      await api.setFilingStatus(filingId, isActive)
      dispatch(changeFilingActiveStatusSuccess(filingId, isActive))
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      if (error.response.status === 500) {
        dispatch(
          changeFilingActiveStatusError(
            'No se pueden activar 2 declaraciones del mismo año para la misma persona'
          )
        )
      }
    }
  }

export const getCountries = () => (dispatch) => {
  dispatch(countryBegin())
  api
    .getCountries()
    .then((response) => {
      const colombiaIndex = _.findIndex(
        response.data,
        (o) => o.name === 'Colombia'
      )
      const col = response.data[colombiaIndex]
      response.data.splice(colombiaIndex, 1)
      response.data.unshift(col)
      dispatch(countrySuccess(response.data))
    })
    .catch((error) => {
      dispatch(countryError(error))
      captureSentryException(error)
    })
}

export const updateStatusFilling =
  (status, fillingId, ownerId) => async (dispatch, getStore) => {
    const { personalInfo } = getStore()
    const { role } = personalInfo || {}
    if (!ownerId && role === 'assistant' && status !== 'summary') {
      return
    }
    dispatch(startLoading())

    try {
      const response = await api.putfillingStatus(
        status,
        fillingId,
        !!ownerId,
        ownerId
      )
      dispatch(setCurrentFiling(response.data, false))
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(errorUpdateFillingStatus(error))
      throw error
    }
  }

// This function it's because FSM fail's because incorrect inicial status
const forceRedirect =
  (status, fillingId, navigate, location) => async (dispatch) => {
    const previusPath = location.pathname
    try {
      if (previusPath === '/payment/success') {
        const response = await api.putfillingStatus(status, fillingId)
        const { data: filing } = response
        dispatch(setCurrentFiling(filing, false))
        navigate(`/filings/${fillingId}/onboarding`, { replace: true })
      } else if (previusPath.endsWith('/onboarding')) {
        const response = await api.getFiling(fillingId)
        const { data: filing } = response
        dispatch(setCurrentFiling(filing, false))
        RedirectUser.fromControlPanel(filing, navigate)
      }
    } catch (error) {
      captureSentryException(error)
    }
  }

/**
 * This function only will be called when an assistant run an engine
 * as an user
 */
export const runEngineAsUserFromAssistant =
  (firstStatus, status, filingId, navigate, runAsUserFromAssistant, ownerId) =>
  async (dispatch) => {
    dispatch(startLoading())
    try {
      await api.putfillingStatus(
        firstStatus,
        filingId,
        runAsUserFromAssistant,
        ownerId
      )
      const { data: filing } = await api.putfillingStatus(
        status,
        filingId,
        runAsUserFromAssistant,
        ownerId
      )
      sessionStorage.setItem('currentOwner', ownerId)
      dispatch(stopLoading())
      dispatch(setCurrentFiling(filing, false))
      RedirectUser.fromControlPanel(filing, navigate)
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
    }
  }

export const updateStatusAndRedirect =
  (status, fillingId, navigate, location) => (dispatch, getStore) => {
    const { personalInfo } = getStore()
    const { role, consumer_app: consumerApp } = personalInfo || {}
    const isAssistant = role === ROLES.ASSISTANT
    const isAccountant = role === ROLES.ACCOUNTANT
    const isAccountantApp = consumerApp === 'artecontable'
    if ((!isAssistant && !isAccountant) || (isAccountant && isAccountantApp)) {
      dispatch(startLoading())
      api
        .putfillingStatus(status, fillingId)
        .then(({ data: filing }) => {
          dispatch(stopLoading())
          dispatch(setCurrentFiling(filing, false))
          RedirectUser.fromControlPanel(filing, navigate)
        })
        .catch((error) => {
          dispatch(stopLoading())
          dispatch(forceRedirect(status, fillingId, navigate, location))
          captureSentryException(error)
        })
    } else {
      const previousPath = location.pathname
      if (previousPath === '/payment/success') {
        navigate(`/filings/${fillingId}/onboarding`, { replace: true })
      } else {
        navigate('/filingstatus', { replace: true })
      }
    }
  }

// Assistant v2
export const getAsistantUsers = (data, assistantState) => async (dispatch) => {
  dispatch(startLoading())
  try {
    const response = await api.getAssistantUsers(data)
    if (response.data) {
      dispatch(searchAssistantUsersSuccess(response.data, assistantState))
    }
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)
    dispatch(searchAssistantUsersError(error))
  }
}

export const getAssistantPersons =
  (data, assistantState) => async (dispatch) => {
    dispatch(startLoading())
    try {
      const response = await api.getAssistantPersons({ user_id: data })
      if (response.data) {
        dispatch(searchAssistantPersonsSuccess(response.data, assistantState))
      }
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(searchAssistantPersonsError(error))
    }
  }

export const getAssistantFilingsByPerson =
  (data, assistantState) => async (dispatch) => {
    dispatch(startLoading())
    try {
      const response = await api.getAssistantFilingsByPerson({
        person_id: data,
        version: 2,
      })
      if (response.data) {
        dispatch(
          searchAssistantFilingsByPersonSuccess(response.data, assistantState)
        )
      }
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(searchAssistantFilingsByPersonError(error))
    }
  }

export const getAssistantDocumentsByFiling =
  (data, assistantState) => async (dispatch) => {
    dispatch(startLoading())
    try {
      const response = await api.getAssistantDocumentsByFiling({
        filing_id: data,
      })
      if (response.data) {
        dispatch(
          searchAssistantDocumentsByFilingnSuccess(
            response.data,
            assistantState
          )
        )
      }
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(searchAssistantDocumentsByFilingnError(error))
    }
  }

export const getAssistantEnginesByFiling =
  (data, assistantState) => async (dispatch) => {
    dispatch(startLoading())
    try {
      const response = await api.getAssistantEnginesByFiling({
        filing_id: data,
      })
      if (response.data) {
        dispatch(
          searchAssistantEnginesByFilingnSuccess(response.data, assistantState)
        )
      }
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(searchAssistantEnginesByFilingnError(error))
    }
  }

export const getAssistantPaymentsByFiling =
  (data, assistantState) => async (dispatch) => {
    dispatch(startLoading())
    try {
      const response = await api.getAssistantPaymentsByFiling(data)
      if (response.data) {
        dispatch(
          searchAssistantPaymentsByFilingnSuccess(response.data, assistantState)
        )
      }
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(searchAssistantPaymentsByFilingnError(error))
    }
  }

export const saveAssistantUser = (user, data) => async (dispatch) => {
  dispatch(startLoading())
  try {
    const response = await api.saveAssistantUser(user, data)
    if (response.data) {
      const { is_active } = data
      let message = ''
      if (is_active !== undefined) {
        message = is_active
          ? 'Usuario activado exitosamente.'
          : 'Usuario inactivado exitosamente.'
      }
      dispatch(saveAssistantUserSuccess(response.data, message))
    }
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)
    dispatch(saveAssistantUserError(error))
  }
}

export const saveAssistantPerson = (person, data) => async (dispatch) => {
  dispatch(startLoading())
  try {
    const response = await api.saveAssistantPerson(person, data)
    if (response.data) {
      dispatch(saveAssistantPersonSuccess(response.data))
    }
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)

    let errorMessage
    const { data: dataError } = error.response
    if (typeof dataError === 'object') {
      errorMessage = `${Object.keys(dataError)[0]}: ${
        dataError[Object.keys(dataError)[0]][0]
      }`
    } else {
      errorMessage = error.response.data.detail
    }

    const payload = {
      ...error,
      errorMessage,
    }

    if (error.response.status === CONFLICT) {
      payload.errorMessage =
        'Ya hay una persona registrada con ese número y tipo de documento'
    }

    dispatch(saveAssistantPersonError(payload))
  }
}

export const setAssistantLocalState =
  (data, message = null) =>
  async (dispath) => {
    message && message.destroy()
    dispath(updateAssistantLocalState(data))
  }

export const getAssistantFilingsByUser =
  (data, assistantState) => async (dispatch) => {
    dispatch(startLoading())
    try {
      const response = await api.getAssistantFilingsByUser(data, assistantState)

      if (response.data) {
        dispatch(
          searchAssistantFilingsByUserSuccess(response.data, assistantState)
        )
      }
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(searchAssistantFilingsByUserError(error))
    }
  }

export const getFirebaseDocumentStatus =
  (documentId, getDoc) => async (dispatch) => {
    dispatch(startLoading())
    try {
      const data = await getDoc(documentId)
      dispatch(
        firebaseDocumentStatusSuccess({ documentId, status: data.status })
      )
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(firebaseDocumentStatusError())
    }
  }

export const getBlobFile = (URL, engine) => async (dispatch) => {
  try {
    const blobData = await api.getBlobData(URL)
    if (blobData) {
      dispatch(getBlobFileSuccess(blobData, engine))
      return blobData
    }
  } catch (error) {
    captureSentryException(error)
  }
}

export const clearBlobFile = () => (dispatch) => {
  dispatch(clearBlobFileSuccess())
}

export const clearMessage = () => (dispatch) => {
  dispatch(clearMessageToShow())
}

export const updateAsistantUsers = (data) => async (dispatch) => {
  dispatch(startLoading())
  try {
    const response = await api.getAssistantUsers(data)
    if (response.data) {
      dispatch(updateAssistantUsersSuccess(response.data))
    }
    dispatch(stopLoading())
  } catch (error) {
    dispatch(stopLoading())
    captureSentryException(error)
    dispatch(searchAssistantUsersError(error))
  }
}

export const swapAccountFromAssistant =
  (data, assistantState) => async (dispatch) => {
    dispatch(startLoading())
    try {
      const response = await api.accountSwap(data)
      if (response.data) {
        dispatch(swapAccountFromAssistantSuccess(response.data, assistantState))
      }
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(swapAccountFromAssistantError(error))
    }
  }

export const changeOrderStatus =
  (orderId, status, param) => async (dispatch) => {
    dispatch(startLoading())
    dispatch(changeOrderStatusBegin())
    let result = {}
    try {
      if (status === PAYMENT_STATUS.APPROVED) {
        result = await apiPayment.approved_order(orderId, param)
      } else {
        result = await apiPayment.assistantCancelOrder(orderId)
      }
      dispatch(changeStatusSuccess(orderId, status))
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(
        changeOrderStatusError('No se pueden cambiar el estado de esta orden')
      )
    }
  }

export const getAssistantFillingByEmail =
  (data, assistantState) => async (dispatch) => {
    dispatch(startLoading())
    dispatch(getFillingsByEmailBegin())
    try {
      const response = await api.getFilingsByEmailV2(data)
      dispatch(getFilingsByEmailSuccess(response.data, assistantState))
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(geFilingsByEmailError(error))
    }
  }

export const getAssistantDianCredentials =
  (filingId, assistantState) => async (dispatch) => {
    dispatch(startLoading())
    try {
      const response = await api.dianCredentials(filingId)
      if (response.data) {
        dispatch(dianCredentialsAssistantSuccess(response.data, assistantState))
      }
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      dispatch(dianCredentialsAssistantError(error))
    }
  }

export const assistantRefundPayment =
  (orderId, param, filingId) => async (dispatch) => {
    dispatch(startLoading())
    dispatch(assistantRefundPaymentBegin())
    let result = {}
    try {
      result = await api.refundPayment(orderId, param)
      dispatch(assistantRefundPaymentSuccess())
      dispatch(getAssistantPaymentsByFiling({ filing_id: filingId }))
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      const { response } = error
      const { data } = response
      dispatch(assistantRefundPaymentError(data[0]))
    }
  }

export const getAssistantRequestRefundPayment =
  (orderId, assistantState) => async (dispatch) => {
    dispatch(startLoading())
    try {
      const result = await api.requestRefundPayment(orderId)
      const { data } = result
      dispatch(assistantRequestRefundPaymentSuccess([data], assistantState))
      dispatch(stopLoading())
    } catch (error) {
      dispatch(stopLoading())
      captureSentryException(error)
      const { response } = error
      const { data } = response || {}
      const { detail } = data
      const errorMessage = detail || data[0]
      dispatch(assistantRequestRefundPaymentError(errorMessage))
    }
  }

export const toggleVideocallException =
  (filingId, status) => async (dispatch) => {
    try {
      dispatch(startLoading())
      await api.patchFilingProData(filingId, {
        video_call_url_exception: status,
      })
    } catch (error) {
      captureSentryException(error)
      message.error(
        'Ocurrió un error al cambiar el estado de la excepción de video llamada de la declaración'
      )
    } finally {
      dispatch(stopLoading())
    }
  }
