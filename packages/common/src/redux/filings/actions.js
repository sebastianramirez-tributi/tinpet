import { message } from 'antd'
import { CONFLICT } from '../../constants/response'
import { normalizePhone } from '../../helpers/collections'
import { captureSentryException } from '../../sentry'
import * as general from '../general/actions'
import { ACTIONS_TYPES } from './constants'
import * as api from './api'

/**
 * Action creators
 */

/**
 * Creates action to exclude `own person` from persons list
 * Useful for those roles that doesn't edit their selfs, like Accountants
 */
export const excludeOwnPerson = () => ({
  type: ACTIONS_TYPES.EXCLUDE_OWN_PERSON,
})

/**
 * Creates action to mock filings
 */
export const mockFilings = (includeId) => ({
  type: ACTIONS_TYPES.MOCK_FILINGS,
  payload: { includeId },
})

export const mockDueDates = () => ({
  type: ACTIONS_TYPES.MOCK_DUE_DATES,
})

/**
 * Persons CRUD & actions
 */

/**
 * Fetch and normalize persons
 */
export const loadPersons = () => {
  return async (dispatch) => {
    try {
      dispatch(general.startLoading())
      const { data = [] } = await api.getPersons()
      const persons = data.map((person) => {
        let phone = {}
        if (person.phone) {
          const [prefix, number] = normalizePhone(person.phone)
          phone = { phone_prefix: prefix, phone: number }
        }

        return { ...person, ...phone }
      })

      dispatch({ type: ACTIONS_TYPES.SET_PERSONS, payload: persons })
    } catch (error) {
      message.error('Ocurrió un error al cargar las declaraciones')
      captureSentryException(error)
    } finally {
      dispatch(general.stopLoading())
    }
  }
}

/**
 * Submit the person data to a given api action
 * @param {Function} actions action to execute, passing the person data as param
 * @param {Object} person data to submit
 * @returns {Object} action response
 */
export const submitPerson = (action, person) => {
  return async (dispatch) => {
    const { phone_prefix: phonePrefix = '', phone: phoneNumber = '' } = person
    const phone = `${phonePrefix}${phoneNumber}`
    const body = {
      ...person,
      phone,
    }

    try {
      dispatch(general.startLoading())
      return await action(body)
    } catch (error) {
      const { response } = error
      const { status: requestStatus } = response

      // Here we check if the action had conflicts with existing
      // filings due to document id
      if (requestStatus === CONFLICT) {
        message.error(
          'Ya tienes una persona registrada con ese número y tipo de documento'
        )
      } else {
        // otherwise, throw the error and let the caller handle it
        throw error
      }
      /*
        This empty return (return { data: {} }) was added because createPerson and modifyPerson expect data, 
        which was causing an error. All of this occurs when attempting to create a new person with an existing
        ID or modify a person by adding an existing ID.
      */
      return { data: {} }
    } finally {
      dispatch(general.stopLoading())
    }
  }
}

/**
 * Creates a new person with the given data
 * @param {Object} person data to create
 * @returns {Object} created person data
 */
export const createPerson = (person) => {
  return async (dispatch) => {
    try {
      const { data } = await dispatch(submitPerson(api.postPerson, person))
      return data
    } catch (error) {
      message.error(`Ocurrió un error al crear esta persona`)
      captureSentryException(error)
    }
  }
}

/**
 * Modifies a person with the given data
 * @param {string} id person identifier
 * @param {Object} person data to modify
 * @returns {Object} modified person data
 */
export const modifyPerson = (id, person) => {
  return async (dispatch) => {
    try {
      const { data } = await dispatch(
        submitPerson(api.putPerson, { id, ...person })
      )
      return data
    } catch (error) {
      message.error(`Ocurrió un error al modificar esta persona`)
      captureSentryException(error)
    }
  }
}

/**
 * Deletes a person with the given ID
 * @param {string} id person identifier
 */
export const deletePerson = (id) => {
  return async (dispatch) => {
    try {
      dispatch(general.startLoading())
      await api.deletePerson(id)
      dispatch({ type: ACTIONS_TYPES.REMOVE_PERSON, payload: id })
    } catch (error) {
      message.error('Ocurrió un error al eliminar esta persona')
      captureSentryException(error)
    } finally {
      dispatch(general.stopLoading())
    }
  }
}

/**
 * Filings CRUD & actions
 */

/**
 * Set table to loading state
 * @param {boolean} loading new loading state
 */
export const setTableLoading = (loading = true) => ({
  type: ACTIONS_TYPES.UPDATE_TABLE,
  payload: { tableLoading: loading },
})

/**
 * Format persons into filings for data table
 */
export const formatFilings = () => {
  const action = async (dispatch, getState, getAsyncReducer) => {
    const { filings } = getState()

    dispatch(setTableLoading())
    const asyncReducer = await getAsyncReducer()

    // Tells the worker to format the data
    const formatTransaction = await asyncReducer(
      { filings },
      {
        type: ACTIONS_TYPES.FORMAT_TABLE,
      }
    )

    dispatch({
      type: ACTIONS_TYPES.UPDATE_TABLE,
      payload: formatTransaction.filings,
    })
    dispatch(setTableLoading(false))
  }

  action.worker = true
  return action
}

/**
 * @typedef {Object} FilterFilingsParams
 * @property {Object} FilterFilingsParams.filters
 * @property {Object} FilterFilingsParams.sort
 *
 * @param {FilterFilingsParams} params
 */
export const filterFilings = ({ filters, sort }) => {
  const action = async (dispatch, getState, getAsyncReducer) => {
    const { filings } = getState()

    dispatch(setTableLoading())
    const asyncReducer = await getAsyncReducer()
    const filterTransaction = await asyncReducer(
      {
        filings,
      },
      {
        type: ACTIONS_TYPES.FILTER_TABLE,
        payload: { filings: filings.normalized, filters, sort },
      }
    )

    dispatch({
      type: ACTIONS_TYPES.UPDATE_TABLE,
      payload: filterTransaction.filings,
    })
    dispatch(setTableLoading(false))
  }
  action.worker = true

  return action
}

export const createFiling = (filing) => {
  return async (dispatch) => {
    try {
      dispatch(general.startLoading())
      const { data } = await api.postFiling(filing)
      return data
    } catch (error) {
      captureSentryException(error)
      message.error('Ocurrió un error al crear la declaración')
    } finally {
      dispatch(general.stopLoading())
    }
  }
}

export const changeSwitchValue = (action, filingId, data) => {
  return async (dispatch) => {
    try {
      dispatch(general.startLoading())
      await action({ ...data, id: filingId })
    } catch (error) {
      captureSentryException(error)
      throw error
    } finally {
      dispatch(general.stopLoading())
    }
  }
}

export const changeSubmitStatus = (filingId, isSubmitted) => {
  return async (dispatch) => {
    try {
      await dispatch(
        changeSwitchValue(api.patchFiling, filingId, {
          is_submitted: isSubmitted,
        })
      )
    } catch (error) {
      message.error(
        'Ocurrió un error al cambiar el estado de presentación de la declaración'
      )
    }
  }
}

export const change160FormSubmissionStatus = (filingId, isSubmitted) => {
  return async (dispatch) => {
    try {
      await dispatch(
        changeSwitchValue(api.patchProFiling, filingId, {
          is_submitted_form_160: isSubmitted,
        })
      )
    } catch (error) {
      message.error(
        'Ocurrió un error al cambiar el estado del formulario 160 de la declaración'
      )
    }
  }
}

export const changeMustDeclareStatus = (filingId, status) => {
  return async (dispatch) => {
    try {
      await dispatch(
        changeSwitchValue(api.patchProFiling, filingId, {
          not_needs_submitted: status,
        })
      )
    } catch (error) {
      message.error('Ocurrió un error al cambiar el estado de la declaración')
    }
  }
}

export const deleteFiling = (filingId) => {
  return async (dispatch) => {
    try {
      dispatch(general.startLoading())
      await api.deleteFiling(filingId)
    } catch (error) {
      captureSentryException(error)
      message.error('Ocurrió un error al eliminar la declaración')
    } finally {
      dispatch(general.stopLoading())
    }
  }
}
