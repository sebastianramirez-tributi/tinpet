import moment from 'moment'
import * as belvoApi from './api'
import onboardingApi from '../onboarding/api'

import { BELVO_STATUS, BELVO_STATUS_CODES } from '../../constants/belvo'
import { captureSentryException } from '../../sentry'
import { startLoading, stopLoading } from '../general/actions'
import { ACTION_TYPES } from './constants'

export const setStatus = (
  status,
  statusCode = null,
  file = null,
  fileStatus = null
) => ({
  type: ACTION_TYPES.SET_CODE_STATUS,
  payload: { status, statusCode, file, fileStatus },
})

export const setInstance = (instanceId) => ({
  type: ACTION_TYPES.SET_INSTANCE,
  payload: instanceId,
})

export const setTokens = (refresh, access) => ({
  type: ACTION_TYPES.SET_TOKENS,
  payload: { refresh, access },
})

export const setInstitution = (institution) => ({
  type: ACTION_TYPES.SET_INSTITUTION,
  payload: institution,
})

export const clearTokens = () => ({
  type: ACTION_TYPES.SET_TOKENS,
  payload: { refresh: null, access: null },
})

export const setLinkId = (linkId) => ({
  type: ACTION_TYPES.SET_LINK_ID,
  payload: linkId,
})

export const setFirebase = (firebaseId, date) => ({
  type: ACTION_TYPES.SET_FIREBASE,
  payload: { firebaseId, date },
})

export const clear = () => ({
  type: ACTION_TYPES.CLEAR,
})

export const getStatus = (filingId, groupId) => async (dispatch) => {
  dispatch(startLoading())
  try {
    const response = await belvoApi.getCodeStatus(filingId, groupId)
    const { data } = response
    const {
      id: firebaseId,
      status,
      status_code: statusCode,
      created_at: date,
      zip_file: file,
      documents_oculus_status: fileStatus,
      link_id: linkId,
      institution,
      instance_id: instanceId,
    } = data
    dispatch(setLinkId(linkId))
    dispatch(setFirebase(firebaseId, date))
    dispatch(setStatus(status, statusCode, file, fileStatus))
    dispatch(setInstance(instanceId))
    dispatch(setInstitution(institution))
  } catch (error) {
    const { response } = error
    const { status } = response || {}
    if (status === 404) {
      dispatch(setStatus(BELVO_STATUS.UNSTARTED))
    } else {
      if (!response) {
        dispatch(
          setStatus(
            BELVO_STATUS.FAILED,
            BELVO_STATUS_CODES.INTERNET_CONNECTION_ERROR
          )
        )
      }
      captureSentryException(error)
    }
  }
  dispatch(stopLoading())
}

export const getToken = (groupId, linkId) => async (dispatch) => {
  dispatch(startLoading())
  try {
    const response = await belvoApi.getToken(groupId, linkId)
    const { data } = response
    const { refresh, access, institution } = data
    dispatch(setTokens(refresh, access))
    dispatch(setInstitution(institution))
  } catch (error) {
    captureSentryException(error)
  }
  dispatch(stopLoading())
}

export const registerBelvoLink =
  (filingId, groupId, institution, linkId) => async (dispatch) => {
    dispatch(startLoading())
    try {
      const response = await belvoApi.register(
        filingId,
        groupId,
        institution,
        linkId
      )
      const { data } = response
      const { id: firebaseId, status } = data
      dispatch(setLinkId(linkId))
      dispatch(setFirebase(firebaseId, moment.utc().format()))
      dispatch(setStatus(status))
    } catch (error) {
      captureSentryException(error)
    }
    dispatch(stopLoading())
  }

export const deleteConnection =
  (filingId, groupId) => async (dispatch, getStore) => {
    dispatch(startLoading())
    try {
      await dispatch(getStatus(filingId, groupId))
      const { belvo } = getStore()
      const { instanceId } = belvo
      await onboardingApi.deleteInstance({
        fillingId: filingId,
        instance_id: instanceId,
      })
      dispatch(clear())
      await dispatch(getStatus(filingId, groupId))
    } catch (error) {
      captureSentryException(error)
    }
    dispatch(stopLoading())
  }

export const cancelPendingConnection =
  (filingId, linkId) => async (dispatch) => {
    dispatch(startLoading())
    try {
      await belvoApi.cancelPendingConnection(filingId, linkId)
      dispatch(clearTokens())
    } catch (error) {
      captureSentryException(error)
    }
    dispatch(stopLoading())
  }

/**
 * @typedef {Object} BelvoErrorData
 * @property {string} BelvoErrorData.institution
 * @property {string} BelvoErrorData.requestId
 * @property {string} BelvoErrorData.errorCode
 * @property {string} BelvoErrorData.payload
 *
 * logs a Belvo error event
 * @param {string} filingId
 * @param {BelvoErrorData} data
 */
export const logBelvoError = (filingId, data) => async (dispatch) => {
  const { institution, payload, errorCode, requestId } = data
  dispatch(startLoading())
  try {
    await belvoApi.logBelvoError(
      filingId,
      institution,
      requestId,
      errorCode,
      payload
    )
  } catch (error) {
    captureSentryException(error)
  }
  dispatch(stopLoading())
}
