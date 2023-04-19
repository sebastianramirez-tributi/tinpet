import araneaApi from './api'
import obApi from '../onboarding/api'
import { BAD_REQUEST } from '../../constants/response'
import { captureSentryException } from '../../sentry'

import {
  ARANEA_GET_STATUS_BEGIN,
  ARANEA_GET_STATUS_SUCCESS,
  ARANEA_GET_STATUS_ERROR,
  ARANEA_FLUSH,
  ARANEA_CLEAN_STATUS,
  ARANEA_CREATE_FILE_PROCESS_BEGIN,
  ARANEA_CREATE_FILE_PROCESS_SUCCESS,
  ARANEA_CREATE_FILE_PROCESS_ERROR,
  ARANEA_SET_DOWNLOADABLE_FILE,
  ARANEA_POST_DIAN_CREDENTIALS_BEGIN,
  ARANEA_POST_DIAN_CREDENTIALS_SUCCESS,
  ARANEA_POST_DIAN_CREDENTIALS_ERROR,
  ARANEA_SET_FAIL_CONNECTION,
  ARANEA_GET_ELECTRONIC_SIGNATURE_VALUE_SUCCESS,
  ARANEA_GET_ELECTRONIC_SIGNATURE_VALUE_ERROR,
  ARANEA_GET_ELECTRONIC_SIGNATURE_VALUE_BEGIN,
  ARANEA_CLEAN_SIGNATURE_TRACE,
} from '../actionTypes'

const getAraneaStatusBegin = () => ({
  type: ARANEA_GET_STATUS_BEGIN,
})

const getAraneaStatusSuccess = (payload) => ({
  type: ARANEA_GET_STATUS_SUCCESS,
  payload,
})

const getAraneaStatusError = (payload) => ({
  type: ARANEA_GET_STATUS_ERROR,
  payload,
})

const createFileProcessBegin = () => ({
  type: ARANEA_CREATE_FILE_PROCESS_BEGIN,
})

const createFileProcessSuccess = (payload) => ({
  type: ARANEA_CREATE_FILE_PROCESS_SUCCESS,
  payload,
})

const createFileProcessError = (payload) => ({
  type: ARANEA_CREATE_FILE_PROCESS_ERROR,
  payload,
})

const postDIANCredentialsBegin = () => ({
  type: ARANEA_POST_DIAN_CREDENTIALS_BEGIN,
})

const postDIANCredentialsError = (payload) => ({
  type: ARANEA_POST_DIAN_CREDENTIALS_ERROR,
  payload,
})

const postDIANCredentialsSuccess = (payload) => ({
  type: ARANEA_POST_DIAN_CREDENTIALS_SUCCESS,
  payload,
})

const getElectronicSignatureValueBegin = () => ({
  type: ARANEA_GET_ELECTRONIC_SIGNATURE_VALUE_BEGIN,
})

const getElectronicSignatureValueSuccess = (payload) => ({
  type: ARANEA_GET_ELECTRONIC_SIGNATURE_VALUE_SUCCESS,
  payload,
})

const getElectronicSignatureValueError = (payload) => ({
  type: ARANEA_GET_ELECTRONIC_SIGNATURE_VALUE_ERROR,
  payload,
})

/**
 * Cleanup action which is called when container is not being
 * active.
 */
export const flushAranea = () => ({
  type: ARANEA_FLUSH,
})

/**
 * Clean up only status gotten from aranea
 */
export const cleanStatus = () => ({
  type: ARANEA_CLEAN_STATUS,
})

/**
 * Clean up signature trace to prevent the flow to file step
 */
export const cleanSignatureTrace = () => ({
  type: ARANEA_CLEAN_SIGNATURE_TRACE,
})

/**
 * Get state from connection which user has.
 */
export const getAraneaStatus = (filingId) => async (dispatch) => {
  dispatch(getAraneaStatusBegin())
  try {
    const data = await araneaApi.getStatus(filingId)
    dispatch(getAraneaStatusSuccess(data))
  } catch (error) {
    captureSentryException(error)
    dispatch(
      getAraneaStatusError('Error en el proceso, por favor intenta de nuevo.')
    )
  }
}

/**
 * Start file process which sign and file the tax statement.
 */
export const createFileProcess = (filingId, payload) => async (dispatch) => {
  dispatch(createFileProcessBegin())
  try {
    const data = await araneaApi.createFileProcess(filingId, payload)
    dispatch(createFileProcessSuccess({ ...data, ...payload }))
  } catch (error) {
    const { status } = error.response || {}
    let message =
      'Error obteniendo la firma electrónica, por favor intenta de nuevo.'
    if (status === BAD_REQUEST) {
      message =
        'La contraseña de la firma electrónica no cumple las propiedades requeridas por el portal de la DIAN.'
    }
    dispatch(createFileProcessError(message))
    captureSentryException(error)
  }
}

export const postDIANCredentials =
  (filingId, credentials, type) => async (dispatch) => {
    dispatch(postDIANCredentialsBegin())
    try {
      const data = await araneaApi.postDIANCredentials(
        filingId,
        credentials,
        type
      )
      dispatch(
        postDIANCredentialsSuccess({
          ...data,
          nationalId: credentials.national_id,
        })
      )
    } catch (error) {
      const validatedError = (error && error.response) || {
        message: 'Error inesperado, por favor intente de nuevo más tarde',
      }
      const { message: errorMessage } = validatedError
      captureSentryException(validatedError)
      dispatch(postDIANCredentialsError(errorMessage))
    }
  }

/**
 * Set in redux store the downloadable file gotten from
 * file process.
 */
export const setDownloadableFile = (file) => (dispatch) => {
  dispatch({
    type: ARANEA_SET_DOWNLOADABLE_FILE,
    file,
  })
}

export const setFailConnection = (payload) => ({
  type: ARANEA_SET_FAIL_CONNECTION,
  payload,
})

export const getElectronicSignatureValue =
  (code, filingId) => async (dispatch) => {
    dispatch(getElectronicSignatureValueBegin())
    try {
      const { data } = await obApi.getAnswersById({ code }, filingId)
      dispatch(getElectronicSignatureValueSuccess({ data, code }))
    } catch (error) {
      captureSentryException(error)
      dispatch(
        getElectronicSignatureValueError(
          'Error obteniendo información de la firma electrónica, por favor intenta de nuevo.'
        )
      )
    }
  }
