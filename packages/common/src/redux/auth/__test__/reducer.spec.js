import initialState from '../initialState'
import reducer from '../reducer'
import * as actions from '../actions'

describe('auth reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      ...initialState,
      isAuthenticated: false,
    })
  })

  describe('change password', () => {
    it('should handle CHANGE_PASSWORD_BEGIN', () => {
      const EXPECTED = {
        ...initialState,
        isAuthenticated: false,
        changePasswordSuccessed: false,
        changePasswordLoading: true,
      }
      const result = reducer(initialState, actions.changePasswordBegin())
      expect(result).toEqual(EXPECTED)
    })
    it('should handle CHANGE_PASSWORD_SUCCESS', () => {
      const EXPECTED = {
        ...initialState,
        isAuthenticated: false,
        changePasswordSuccessed: true,
        changePasswordLoading: false,
      }
      const result = reducer(initialState, actions.changePasswordSuccess())
      expect(result).toEqual(EXPECTED)
    })
    it('should handle CHANGE_PASSWORD_ERROR', () => {
      const EXPECTED = {
        ...initialState,
        isAuthenticated: false,
        changePasswordLoading: false,
      }
      const result = reducer(initialState, actions.changePasswordError())
      expect(result).toEqual(EXPECTED)
    })
  })
})
