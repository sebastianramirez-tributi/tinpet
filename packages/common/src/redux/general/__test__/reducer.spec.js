import reducer from '../reducer'
import INITIAL_STATE from '../initialState'
import * as actions from '../actions'

describe('general reducer', () => {
  it('should add one to the loading counter', () => {
    const result = reducer(INITIAL_STATE, actions.startLoading())
    expect(result).toEqual({
      ...INITIAL_STATE,
      loadingCount: INITIAL_STATE.loadingCount + 1,
    })
  })

  it('should remove one from the loading counter', () => {
    const LOADING_COUNT = 100
    const result = reducer(
      { ...INITIAL_STATE, loadingCount: LOADING_COUNT },
      actions.stopLoading()
    )
    expect(result).toEqual({
      ...INITIAL_STATE,
      loadingCount: LOADING_COUNT - 1,
    })
  })

  it('should keep loading count with zero as minimum value', () => {
    const ZERO_LOADING_COUNT = 0
    const result = reducer(
      { ...INITIAL_STATE, loadingCount: ZERO_LOADING_COUNT },
      actions.stopLoading()
    )
    expect(result).toEqual({
      ...INITIAL_STATE,
      loadingCount: ZERO_LOADING_COUNT,
    })
  })

  it('should set `isSummaryTabActive` to true', () => {
    const result = reducer(INITIAL_STATE, actions.setSummaryTabStatus(true))
    expect(result).toEqual({
      ...INITIAL_STATE,
      isSummaryTabActive: true,
    })
  })

  it('should set `isSummaryTabActive` to false', () => {
    const result = reducer(
      { ...INITIAL_STATE, isSummaryTabActive: true },
      actions.setSummaryTabStatus(false)
    )
    expect(result).toEqual({
      ...INITIAL_STATE,
      isSummaryTabActive: false,
    })
  })
})
