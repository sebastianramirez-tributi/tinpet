import * as actions from '../actions'

describe('General action creators', () => {
  it('should create an add loading counter action', () => {
    const result = actions.startLoading()
    expect(result).toEqual({ type: actions.ACTION_TYPES.ADD_LOADING_COUNT })
  })

  it('should create a remove loading counter action', () => {
    const result = actions.stopLoading()
    expect(result).toEqual({ type: actions.ACTION_TYPES.REMOVE_LOADING_COUNT })
  })

  it('should create a summary tab activity status action with payload `true`', () => {
    const result = actions.setSummaryTabStatus(true)
    expect(result).toEqual({
      type: actions.ACTION_TYPES.SET_SUMMARY_TAB_STATUS,
      payload: true,
    })
  })

  it('should create a summary tab activity status action with payload `false`', () => {
    const result = actions.setSummaryTabStatus(false)
    expect(result).toEqual({
      type: actions.ACTION_TYPES.SET_SUMMARY_TAB_STATUS,
      payload: false,
    })
  })
})
