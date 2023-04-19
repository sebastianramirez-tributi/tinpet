import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import axios from 'axios'

import { ACTION_TYPES as GENERAL_ACTION_TYPES } from '../../general/actions'
import * as actions from '../actions'
import { ACTION_TYPES } from '../constants'

const middleware = [thunk]
const mockStore = configureMockStore(middleware)

describe('PersonalInfo action creators', () => {
  describe('sync actions', () => {
    it('should create `setPersonalInfo` action', () => {
      const personalInfo = { test: 'data' }
      const action = actions.setPersonalInfo(personalInfo)
      expect(action).toEqual({
        type: ACTION_TYPES.SET_INFO,
        payload: personalInfo,
      })
    })

    it('should create `updatePersonalInfo` action', () => {
      const personalInfo = { test: 'data' }
      const merge = false
      const action = actions.updatePersonalInfo(personalInfo, merge)
      expect(action).toEqual({
        type: ACTION_TYPES.UPDATE_INFO,
        payload: { personalInfo, merge },
      })
    })

    it('should create `setCurrentFiling` action', () => {
      const filing = { test: 'data' }
      const merge = false
      const action = actions.setCurrentFiling(filing, merge)
      expect(action).toEqual({
        type: ACTION_TYPES.SET_CURRENT_FILING,
        payload: { filing, merge },
      })
    })

    it('should create `clearCurrentFiling` action', () => {
      const action = actions.clearCurrentFiling()
      expect(action).toEqual({
        type: ACTION_TYPES.CLEAR_CURRENT_FILING,
      })
    })

    it('should create `deleteFiling` action', () => {
      const filingId = 'testing-filing-id'
      const action = actions.deleteFiling(filingId)
      expect(action).toEqual({
        type: ACTION_TYPES.DELETE_FILING,
        payload: filingId,
      })
    })
  })

  describe('async actions', () => {
    it('should handle `setCurrentFilingById` action without localFilings', async () => {
      const store = mockStore({
        personalInfo: {
          localFilings: [],
        },
      })
      const filingId = 'testing-filing-id'
      const filing = {
        id: filingId,
      }
      const merge = false
      axios.get.mockResolvedValueOnce({ data: filing })
      await store.dispatch(actions.setCurrentFilingById(filingId, merge))
      expect(store.getActions()).toEqual([
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
        { type: ACTION_TYPES.SET_CURRENT_FILING, payload: { filing, merge } },
      ])
      expect(axios.get).toHaveBeenCalled()
    })

    it('should handle `setCurrentFilingById` action with localFilings', async () => {
      const filingId = 'testing-filing-id'
      const filing = {
        id: filingId,
      }
      const store = mockStore({
        personalInfo: {
          localFilings: [filing],
        },
      })
      const merge = false
      await store.dispatch(actions.setCurrentFilingById(filingId, merge))
      expect(store.getActions()).toEqual([
        { type: ACTION_TYPES.SET_CURRENT_FILING, payload: { filing, merge } },
      ])
      expect(axios.get).not.toHaveBeenCalled()
    })

    it('should handle `setCurrentFilingById` action with localFilings and `forceFetch`', async () => {
      const filingId = 'testing-filing-id'
      const filing = {
        id: filingId,
      }
      const store = mockStore({
        personalInfo: {
          localFilings: [filing],
        },
      })
      const merge = false
      axios.get.mockResolvedValueOnce({ data: filing })
      await store.dispatch(actions.setCurrentFilingById(filingId, merge, true))
      expect(store.getActions()).toEqual([
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
        { type: ACTION_TYPES.SET_CURRENT_FILING, payload: { filing, merge } },
      ])
      expect(axios.get).toHaveBeenCalled()
    })

    it('should handle `fetchPersonalInfo` action', async () => {
      const store = mockStore({
        personalInfo: {
          id: 'testing-id',
          changingValue: 'initial',
        },
      })
      axios.get.mockResolvedValueOnce({ data: { changingValue: 'updated' } })
      await store.dispatch(actions.fetchPersonalInfo())
      expect(store.getActions()).toEqual([
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        {
          type: ACTION_TYPES.UPDATE_INFO,
          payload: {
            merge: true,
            personalInfo: {
              changingValue: 'updated',
            },
          },
        },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ])
      expect(axios.get).toHaveBeenCalled()
    })
  })
})
