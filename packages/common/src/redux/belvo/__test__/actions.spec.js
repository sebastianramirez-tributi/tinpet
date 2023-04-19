import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import axios from 'axios'

import { ACTION_TYPES as GENERAL_ACTION_TYPES } from '../../general/actions'
import * as actions from '../actions'
import { ACTION_TYPES } from '../constants'
import { BELVO_FILE_STATUS, BELVO_STATUS } from '../../../constants/belvo'

const middleware = [thunk]
const mockStore = configureMockStore(middleware)

const MOCK_CURRENT_DATE = 1625097600000

describe('Belvo action creators', () => {
  beforeAll(() => {
    Date.now = jest.fn(() => MOCK_CURRENT_DATE)
  })

  afterAll(() => {
    Date.now.mockClear()
  })

  describe('simple action creators', () => {
    it('should create SET_CODE_STATUS with status, statusCode, file and fileStatus attributes in payload when calls setStatus', () => {
      const STATUS = 'testing-status'
      const STATUS_CODE = 'testing-status-code'
      const FILE = 'testing-file'
      const FILE_STATUS = 'testing-file-status'
      const action = actions.setStatus(STATUS, STATUS_CODE, FILE, FILE_STATUS)
      expect(action).toEqual({
        type: ACTION_TYPES.SET_CODE_STATUS,
        payload: {
          status: STATUS,
          statusCode: STATUS_CODE,
          file: FILE,
          fileStatus: FILE_STATUS,
        },
      })
    })

    it('should create SET_CODE_STATUS with status, statusCode and file attributes in payload when calls setStatus', () => {
      const STATUS = 'testing-status'
      const STATUS_CODE = 'testing-status-code'
      const FILE = 'testing-file'
      const action = actions.setStatus(STATUS, STATUS_CODE, FILE)
      expect(action).toEqual({
        type: ACTION_TYPES.SET_CODE_STATUS,
        payload: {
          status: STATUS,
          statusCode: STATUS_CODE,
          file: FILE,
          fileStatus: null,
        },
      })
    })

    it('should create SET_CODE_STATUS with status attribute in payload when calls setStatus', () => {
      const STATUS = 'testing-status'
      const action = actions.setStatus(STATUS)
      expect(action).toEqual({
        type: ACTION_TYPES.SET_CODE_STATUS,
        payload: {
          status: STATUS,
          statusCode: null,
          file: null,
          fileStatus: null,
        },
      })
    })

    it('should create SET_CODE_STATUS with status and statusCode attributes in payload when calls setStatus', () => {
      const STATUS = 'testing-status'
      const STATUS_CODE = 'testing-status-code'
      const action = actions.setStatus(STATUS, STATUS_CODE)
      expect(action).toEqual({
        type: ACTION_TYPES.SET_CODE_STATUS,
        payload: {
          status: STATUS,
          statusCode: STATUS_CODE,
          file: null,
          fileStatus: null,
        },
      })
    })

    it('should create SET_TOKENS with refresh, access, institution attributes in payload when setToken is called', () => {
      const REFRESH = 'testing-refresh'
      const ACCESS = 'testing-access'
      const action = actions.setTokens(REFRESH, ACCESS)
      expect(action).toEqual({
        type: ACTION_TYPES.SET_TOKENS,
        payload: { refresh: REFRESH, access: ACCESS },
      })
    })

    it('should create SET_TOKENS with refresh, access attributes with null value in payload when clearTokens is called', () => {
      const action = actions.clearTokens()
      expect(action).toEqual({
        type: ACTION_TYPES.SET_TOKENS,
        payload: { refresh: null, access: null },
      })
    })

    it('should create SET_LINK_ID with linkId as payload when setLinkId is called', () => {
      const LINK_ID = 'testing-link-id'
      const action = actions.setLinkId(LINK_ID)
      expect(action).toEqual({
        type: ACTION_TYPES.SET_LINK_ID,
        payload: LINK_ID,
      })
    })

    it('should create SET_FIREBASE with firebaseId and date attributes in payload when setFirebase is called', () => {
      const FIREBASE = 'testing-firebase'
      const DATE = 'testing-date'
      const action = actions.setFirebase(FIREBASE, DATE)
      expect(action).toEqual({
        type: ACTION_TYPES.SET_FIREBASE,
        payload: { firebaseId: FIREBASE, date: DATE },
      })
    })

    it('should create CLEAR when calls clear action', () => {
      const action = actions.clear()
      expect(action).toEqual({
        type: ACTION_TYPES.CLEAR,
      })
    })
  })

  describe('async actions', () => {
    let store

    beforeEach(() => {
      store = mockStore({})
    })

    it('should handle getStatus', async () => {
      const RESPONSE_DATA = {
        id: 'testing-firebase-id',
        status: 'processed',
        status_code: 'testing-status-code',
        created_at: '2021-07-01T00:00:00Z',
        zip_file: 'testing-file',
        documents_oculus_status: 'testing-file-status',
        link_id: 'testing-link-id',
        institution: 'institution-test',
        instance_id: 'instance-id-test',
      }
      const FILING_ID = 'testing-filing-Id'
      const GROUP_ID = 'testing-group-id'
      axios.get.mockResolvedValue({ data: RESPONSE_DATA })
      await store.dispatch(actions.getStatus(FILING_ID, GROUP_ID))
      expect(store.getActions()).toEqual([
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        {
          type: ACTION_TYPES.SET_LINK_ID,
          payload: RESPONSE_DATA.link_id,
        },
        {
          type: ACTION_TYPES.SET_FIREBASE,
          payload: {
            firebaseId: RESPONSE_DATA.id,
            date: RESPONSE_DATA.created_at,
          },
        },
        {
          type: ACTION_TYPES.SET_CODE_STATUS,
          payload: {
            status: RESPONSE_DATA.status,
            statusCode: RESPONSE_DATA.status_code,
            file: RESPONSE_DATA.zip_file,
            fileStatus: RESPONSE_DATA.documents_oculus_status,
          },
        },
        {
          type: ACTION_TYPES.SET_INSTANCE,
          payload: RESPONSE_DATA.instance_id,
        },
        {
          type: ACTION_TYPES.SET_INSTITUTION,
          payload: RESPONSE_DATA.institution,
        },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ])
    })

    it('should handle getToken', async () => {
      const TOKEN_DATA = {
        refresh: 'testing-refresh',
        access: 'testing-access',
      }
      const INSTITUTION_ID = 'testing-institution'
      const RESPONSE_DATA = {
        ...TOKEN_DATA,
        institution: INSTITUTION_ID,
      }
      const GROUP_ID = 'testing-group-id'
      axios.get.mockResolvedValue({ data: RESPONSE_DATA })
      await store.dispatch(actions.getToken(GROUP_ID))
      expect(axios.get).toBeCalledWith(`/libel/token/?group_id=${GROUP_ID}`)
      expect(store.getActions()).toEqual([
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: ACTION_TYPES.SET_TOKENS, payload: TOKEN_DATA },
        { type: ACTION_TYPES.SET_INSTITUTION, payload: INSTITUTION_ID },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ])
    })

    it('should handle getToken with linkId', async () => {
      const TOKEN_DATA = {
        refresh: 'testing-refresh',
        access: 'testing-access',
      }
      const INSTITUTION_ID = 'testing-institution'
      const RESPONSE_DATA = {
        ...TOKEN_DATA,
        institution: INSTITUTION_ID,
      }
      const GROUP_ID = 'testing-group-id'
      const LINK_ID = 'testing-link-id'
      axios.get.mockResolvedValue({ data: RESPONSE_DATA })
      await store.dispatch(actions.getToken(GROUP_ID, LINK_ID))
      expect(axios.get).toBeCalledWith(
        `/libel/token/?group_id=${GROUP_ID}&link_id=${LINK_ID}`
      )
      expect(store.getActions()).toEqual([
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: ACTION_TYPES.SET_TOKENS, payload: TOKEN_DATA },
        { type: ACTION_TYPES.SET_INSTITUTION, payload: INSTITUTION_ID },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ])
    })

    it('should handle registerBelvoLink', async () => {
      const RESPONSE_DATA = {
        id: 'testing-firebase-id',
        status: 'testing-processing',
      }
      const FILING_ID = 'testing-filing-Id'
      const GROUP_ID = 'testing-group-id'
      const INSTITUTION = 'testing-institution'
      const LINK_ID = 'testing-link-id'
      axios.post.mockResolvedValue({ data: RESPONSE_DATA })
      await store.dispatch(
        actions.registerBelvoLink(FILING_ID, GROUP_ID, INSTITUTION, LINK_ID)
      )
      expect(store.getActions()).toEqual([
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        {
          type: ACTION_TYPES.SET_LINK_ID,
          payload: LINK_ID,
        },
        {
          type: ACTION_TYPES.SET_FIREBASE,
          payload: {
            firebaseId: RESPONSE_DATA.id,
            date: '2021-07-01T00:00:00Z',
          },
        },
        {
          type: ACTION_TYPES.SET_CODE_STATUS,
          payload: {
            status: RESPONSE_DATA.status,
            statusCode: null,
            file: null,
            fileStatus: null,
          },
        },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ])
    })

    it('should handle deleteConnection', async () => {
      const FILING = 'filing-test'
      const INSTANCE = 'instance-test'
      const GROUP = 'group-test'
      const STATUS_RESPONSE_DATA = {
        id: 'testing-firebase-id',
        status: 'processed',
        status_code: 'testing-status-code',
        created_at: '2021-07-01T00:00:00Z',
        zip_file: 'testing-file',
        link_id: 'testing-link-id',
        institution: 'institution-test',
        instance_id: INSTANCE,
        documents_oculus_status: BELVO_FILE_STATUS.FULL,
      }
      const getStateActions = (created = true) => [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        {
          type: ACTION_TYPES.SET_LINK_ID,
          payload: STATUS_RESPONSE_DATA.link_id,
        },
        {
          type: ACTION_TYPES.SET_FIREBASE,
          payload: {
            firebaseId: STATUS_RESPONSE_DATA.id,
            date: STATUS_RESPONSE_DATA.created_at,
          },
        },
        {
          type: ACTION_TYPES.SET_CODE_STATUS,
          payload: {
            status: created ? STATUS_RESPONSE_DATA.status : 'unstarted',
            statusCode: created ? STATUS_RESPONSE_DATA.status_code : null,
            file: created ? STATUS_RESPONSE_DATA.zip_file : null,
            fileStatus: created
              ? STATUS_RESPONSE_DATA.documents_oculus_status
              : null,
          },
        },
        {
          type: ACTION_TYPES.SET_INSTANCE,
          payload: STATUS_RESPONSE_DATA.instance_id,
        },
        {
          type: ACTION_TYPES.SET_INSTITUTION,
          payload: STATUS_RESPONSE_DATA.institution,
        },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]

      axios.delete.mockResolvedValue({})
      axios.get.mockResolvedValueOnce({ data: STATUS_RESPONSE_DATA })
      axios.get.mockRejectedValueOnce({
        response: {
          status: 404,
        },
      })
      const INSTANCE_ID = 'instance-id-test'
      const store = mockStore({
        belvo: {
          instanceId: INSTANCE_ID,
        },
      })
      await store.dispatch(actions.deleteConnection(FILING, GROUP))
      expect(store.getActions()).toEqual([
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        // set state
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        {
          type: ACTION_TYPES.SET_LINK_ID,
          payload: STATUS_RESPONSE_DATA.link_id,
        },
        {
          type: ACTION_TYPES.SET_FIREBASE,
          payload: {
            firebaseId: STATUS_RESPONSE_DATA.id,
            date: STATUS_RESPONSE_DATA.created_at,
          },
        },
        {
          type: ACTION_TYPES.SET_CODE_STATUS,
          payload: {
            status: STATUS_RESPONSE_DATA.status,
            statusCode: STATUS_RESPONSE_DATA.status_code,
            file: STATUS_RESPONSE_DATA.zip_file,
            fileStatus: STATUS_RESPONSE_DATA.documents_oculus_status,
          },
        },
        {
          type: ACTION_TYPES.SET_INSTANCE,
          payload: STATUS_RESPONSE_DATA.instance_id,
        },
        {
          type: ACTION_TYPES.SET_INSTITUTION,
          payload: STATUS_RESPONSE_DATA.institution,
        },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
        // Clear
        { type: ACTION_TYPES.CLEAR },
        // Get state again but with instance deleted
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        {
          type: ACTION_TYPES.SET_CODE_STATUS,
          payload: {
            file: null,
            status: BELVO_STATUS.UNSTARTED,
            fileStatus: null,
            statusCode: null,
          },
        },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ])
    })

    it('should handle logBelvoError', async () => {
      const FILING_ID = 'filing-test'
      const DATA = {
        errorCode: 'error-code-test',
        institution: 'institution-test',
        payload: 'payload-test',
        requestId: 'request-id-test',
      }

      const REQUEST_DATA = {
        request_id: DATA.requestId,
        internal_error: DATA.errorCode,
        institution: DATA.institution,
        payload: DATA.payload,
      }

      axios.post.mockResolvedValue({})
      await store.dispatch(actions.logBelvoError(FILING_ID, DATA))

      expect(axios.post).toBeCalledWith(
        `/libel/${FILING_ID}/unsuccessful-try`,
        REQUEST_DATA
      )

      expect(store.getActions()).toEqual([
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ])
    })
  })
})
