import Message from 'antd/lib/message'

import history from '../../history'
import { captureSentryException } from '../../sentry'
import { NOT_FOUND } from '../../constants/response'
import { startLoading, stopLoading } from '../general/actions'
import * as personalInfoAPI from './api'
import { ACTION_TYPES } from './constants'

export const setPersonalInfo = (personalInfo) => ({
  type: ACTION_TYPES.SET_INFO,
  payload: personalInfo,
})

export const updatePersonalInfo = (personalInfo, merge = true) => ({
  type: ACTION_TYPES.UPDATE_INFO,
  payload: { personalInfo, merge },
})

export const setCurrentFiling = (filing, merge = true) => ({
  type: ACTION_TYPES.SET_CURRENT_FILING,
  payload: { filing, merge },
})

export const clearCurrentFiling = () => ({
  type: ACTION_TYPES.CLEAR_CURRENT_FILING,
})

export const deleteFiling = (filingId) => ({
  type: ACTION_TYPES.DELETE_FILING,
  payload: filingId,
})

export const setCurrentFilingById =
  (filingId, merge = true, forceFetch = false) =>
  async (dispatch, getStore) => {
    const { personalInfo } = getStore()
    const { localFilings = [] } = personalInfo || {}
    let filing = localFilings.find(({ id }) => id === filingId)
    if (forceFetch || !filing) {
      try {
        dispatch(startLoading())
        const { data } = await personalInfoAPI.fetchFiling(filingId)
        filing = data
        dispatch(stopLoading())
      } catch (error) {
        const { status } = error.response
        dispatch(stopLoading())
        if (status === NOT_FOUND) {
          history.push('/404')
        } else {
          captureSentryException(error)
          Message.error('No se pudo acceder a la declaración')
          history.push('/')
        }
      }
    }
    dispatch(setCurrentFiling(filing, merge))
    return filing
  }

export const fetchPersonalInfo = () => async (dispatch) => {
  try {
    dispatch(startLoading())
    const response = await personalInfoAPI.fetchPersonalInfo()
    const { data: user } = response
    dispatch(updatePersonalInfo(user))
    return user
  } catch (error) {
    captureSentryException(error)
    Message.error(translate('personalInfo.fetchPersonalInfo.error'))
  } finally {
    dispatch(stopLoading())
  }
}
