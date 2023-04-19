import reducer from '../reducer'
import { INITIAL_STATE } from '../constants'
import * as actions from '../actions'

describe('PersonalInfo reducer', () => {
  it('should handle `SET_INFO` action type', () => {
    const lastFiling = 'last filing data'
    const data = {
      last_filing: lastFiling,
    }
    const result = reducer(INITIAL_STATE, actions.setPersonalInfo(data))
    expect(result).toEqual({
      ...INITIAL_STATE,
      last_filing: lastFiling,
      localFilings: [lastFiling],
      currentFiling: lastFiling,
    })
  })

  it('should handle `UPDATE_INFO` action type', () => {
    const data = {
      new: 'data',
    }
    const result = reducer(
      { original: 'data' },
      actions.updatePersonalInfo(data, true)
    )
    expect(result).toEqual({
      original: 'data',
      ...data,
    })
  })

  it('should handle `UPDATE_INFO` action type without merge', () => {
    const data = {
      overwrote: 'data',
    }
    const result = reducer(
      { original: 'data' },
      actions.updatePersonalInfo(data, false)
    )
    expect(result).toEqual({
      ...data,
    })
  })

  it('should handle `SET_CURRENT_FILING` action type', () => {
    const filing = {
      id: 'testing-filing-id',
    }
    const result = reducer(
      { ...INITIAL_STATE, localFilings: [] },
      actions.setCurrentFiling(filing, true)
    )
    expect(result).toEqual({
      ...INITIAL_STATE,
      localFilings: [filing],
      currentFiling: filing,
    })
  })

  it('should handle `SET_CURRENT_FILING` action type with merge', () => {
    const filingId = 'testing-filing-id'
    const existingFiling = {
      id: filingId,
      existing: 'data',
    }
    const newFiling = {
      id: filingId,
      incoming: 'data',
    }
    const mergedFiling = { ...existingFiling, ...newFiling }
    const result = reducer(
      {
        ...INITIAL_STATE,
        localFilings: [existingFiling],
        currentFiling: existingFiling,
      },
      actions.setCurrentFiling(newFiling, true)
    )
    expect(result).toEqual({
      ...INITIAL_STATE,
      localFilings: [mergedFiling],
      currentFiling: mergedFiling,
    })
  })

  it('should handle `SET_CURRENT_FILING` action type without merge', () => {
    const filingId = 'testing-filing-id'
    const existingFiling = {
      id: filingId,
      existing: 'data',
    }
    const newFiling = {
      id: filingId,
      incoming: 'data',
    }
    const result = reducer(
      {
        ...INITIAL_STATE,
        localFilings: [existingFiling],
        currentFiling: existingFiling,
      },
      actions.setCurrentFiling(newFiling, false)
    )
    expect(result).toEqual({
      ...INITIAL_STATE,
      localFilings: [newFiling],
      currentFiling: newFiling,
    })
  })

  it('should handle `CLEAR_CURRENT_FILING` action type', () => {
    const filingId = 'testing-filing-id'
    const existingFiling = {
      id: filingId,
      existing: 'data',
    }
    const result = reducer(
      {
        ...INITIAL_STATE,
        localFilings: [existingFiling],
        currentFiling: existingFiling,
      },
      actions.clearCurrentFiling()
    )
    expect(result).toEqual({
      ...INITIAL_STATE,
      localFilings: [existingFiling],
      currentFiling: null,
    })
  })

  it('should handle `DELETE_FILING` action type', () => {
    const filingId = 'testing-filing-id'
    const filing = {
      id: filingId,
    }
    const result = reducer(
      {
        ...INITIAL_STATE,
        localFilings: [filing],
      },
      actions.deleteFiling(filingId)
    )
    expect(result).toEqual({
      ...INITIAL_STATE,
      localFilings: [],
    })
  })
})
