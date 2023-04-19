import reducer from '../reducer'
import { INITIAL_STATE } from '../constants'
import * as actions from '../actions'

describe('belvo reducer', () => {
  it('should handle SET_STATUS action type', () => {
    const STATUS = 'testing-status'
    const result = reducer(INITIAL_STATE, actions.setStatus(STATUS))
    expect(result).toEqual({
      ...INITIAL_STATE,
      status: STATUS,
    })
  })

  it('should handle SET_STATUS action type with statusCode', () => {
    const STATUS = 'testing-status'
    const STATUS_CODE = 'testing-status-code'
    const result = reducer(
      INITIAL_STATE,
      actions.setStatus(STATUS, STATUS_CODE)
    )
    expect(result).toEqual({
      ...INITIAL_STATE,
      status: STATUS,
      statusCode: STATUS_CODE,
    })
  })

  it('should handle SET_STATUS action type with statusCode and file', () => {
    const STATUS = 'testing-status'
    const STATUS_CODE = 'testing-status-code'
    const FILE = 'testing-file'
    const result = reducer(
      INITIAL_STATE,
      actions.setStatus(STATUS, STATUS_CODE, FILE)
    )
    expect(result).toEqual({
      ...INITIAL_STATE,
      status: STATUS,
      statusCode: STATUS_CODE,
      file: FILE,
    })
  })

  it('should handle SET_STATUS action type with statusCode, file and fileStatus', () => {
    const STATUS = 'testing-status'
    const STATUS_CODE = 'testing-status-code'
    const FILE = 'testing-file'
    const FILE_STATUS = 'testing-file-status'
    const result = reducer(
      INITIAL_STATE,
      actions.setStatus(STATUS, STATUS_CODE, FILE, FILE_STATUS)
    )
    expect(result).toEqual({
      ...INITIAL_STATE,
      status: STATUS,
      statusCode: STATUS_CODE,
      file: FILE,
      fileStatus: FILE_STATUS,
    })
  })

  it('should handle SET_LINK_ID action type', () => {
    const LINK_ID = 'testing-link-id'
    const result = reducer(INITIAL_STATE, actions.setLinkId(LINK_ID))
    expect(result).toEqual({
      ...INITIAL_STATE,
      linkId: LINK_ID,
    })
  })

  it('should handle SET_TOKENS action type', () => {
    const REFRESH = 'testing-refresh'
    const ACCESS = 'testing-access'
    const result = reducer(INITIAL_STATE, actions.setTokens(REFRESH, ACCESS))
    expect(result).toEqual({
      ...INITIAL_STATE,
      refreshToken: REFRESH,
      accessToken: ACCESS,
    })
  })

  it('should handle SET_FIREBASE action type', () => {
    const FIREBASE_ID = 'testing-firebase-id'
    const DATE = 'testing-date'
    const result = reducer(
      INITIAL_STATE,
      actions.setFirebase(FIREBASE_ID, DATE)
    )
    expect(result).toEqual({
      ...INITIAL_STATE,
      firebaseId: FIREBASE_ID,
      date: DATE,
    })
  })

  it('should handle CLEAR', () => {
    const result = reducer(INITIAL_STATE, actions.clear())
    expect(result).toEqual(INITIAL_STATE)
  })
})
