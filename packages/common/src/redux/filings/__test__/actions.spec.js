import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import message from 'antd/lib/message'

import axios from '../../../config/axios-api'
import workerMiddleware from '../../middleware/workerMiddleware'
import getAsyncReducer from '../../rootAsyncReducer'
import { captureSentryException } from '../../../sentry'
import { CONFLICT, CREATED, OK } from '../../../constants/response'
import { ACTION_TYPES as GENERAL_ACTION_TYPES } from '../../general/actions'
import { ACTIONS_TYPES } from '../constants'
import * as actions from '../actions'

jest.mock('../../../sentry')
jest.mock('antd/lib/message')

const middleware = [workerMiddleware.withAsyncReducer(getAsyncReducer), thunk]
const mockStore = configureMockStore(middleware)
const mockWorkerReducer = jest.fn().mockResolvedValue({})

jest.mock('../../rootAsyncReducer', () => {
  return () => mockWorkerReducer
})

const RESPONSE_OK = { status: OK }
const RESPONSE_CREATED = { status: CREATED }
const RESPONSE_CONFLICT = { status: CONFLICT }

describe('filings actions specs', () => {
  beforeEach(() => {
    mockWorkerReducer.mockClear()
  })

  describe('persons actions', () => {
    it('should create `EXCLUDE_OWN_PERSON` action', () => {
      const result = actions.excludeOwnPerson()
      expect(result).toEqual({
        type: ACTIONS_TYPES.EXCLUDE_OWN_PERSON,
      })
    })

    it('should handle `loadPersons`', async () => {
      const RESPONSE = [
        {
          id: 'some-id',
          first_name: 'John',
          last_name: 'Doe',
          filings: [
            {
              id: 'filing-id',
              tax_year: 2018,
              due_date: '2019-10-01',
            },
          ],
        },
      ]
      axios.get.mockResolvedValue({ data: RESPONSE })
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: ACTIONS_TYPES.SET_PERSONS, payload: RESPONSE },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const store = mockStore({})
      await store.dispatch(actions.loadPersons())
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('should handle `loadPersons` with error', async () => {
      const ERROR = 'request fail'
      axios.get.mockRejectedValue({ error: ERROR })
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const store = mockStore({})
      await store.dispatch(actions.loadPersons())
      expect(store.getActions()).toEqual(expectedActions)
      expect(captureSentryException).toHaveBeenCalled()
      expect(captureSentryException).toHaveBeenCalledWith({ error: ERROR })
      expect(message.error).toHaveBeenCalled()
    })

    it('should handle `submitPerson`', async () => {
      const INPUT_DATA = { data: 'Mocked', phone: '' }
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const ACTION = jest.fn().mockResolvedValue({})
      const store = mockStore({})
      await store.dispatch(actions.submitPerson(ACTION, INPUT_DATA))
      expect(ACTION).toHaveBeenCalledWith(INPUT_DATA)
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('should handle `submitPerson` with error', async () => {
      const INPUT_DATA = { data: 'Mocked', phone: '' }
      const ERROR_RESPONSE = {
        error: 'request fail',
        response: RESPONSE_CONFLICT,
      }
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const ACTION = jest.fn().mockRejectedValue(ERROR_RESPONSE)
      const store = mockStore({})
      await store.dispatch(actions.submitPerson(ACTION, INPUT_DATA))
      expect(ACTION).toHaveBeenCalledWith(INPUT_DATA)
      expect(store.getActions()).toEqual(expectedActions)
      expect(message.error).toHaveBeenCalled()
    })

    it('should handle `createPerson`', async () => {
      const INPUT_DATA = { data: 'Mocked', phone: '' }
      const RESPONSE = {
        id: 'some-id',
        first_name: 'John',
        last_name: 'Doe',
        filings: [
          {
            id: 'filing-id',
            tax_year: 2018,
            due_date: '2019-10-01',
          },
        ],
      }
      axios.post.mockResolvedValue({
        data: RESPONSE,
        request: RESPONSE_CREATED,
      })
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const store = mockStore({})
      await store.dispatch(actions.createPerson(INPUT_DATA))
      expect(axios.post).toHaveBeenCalled()
      expect(axios.post).toHaveBeenCalledWith('/persons', INPUT_DATA)
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('should handle `createPerson` with error', async () => {
      const INPUT_DATA = { data: 'Mocked', phone: '' }
      const ERROR_RESPONSE = {
        error: 'request fail',
        response: RESPONSE_CONFLICT,
      }
      axios.post.mockRejectedValue(ERROR_RESPONSE)
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const store = mockStore({})
      await store.dispatch(actions.createPerson(INPUT_DATA))
      expect(axios.post).toHaveBeenCalled()
      expect(axios.post).toHaveBeenCalledWith('/persons', INPUT_DATA)
      expect(store.getActions()).toEqual(expectedActions)
      expect(message.error).toHaveBeenCalled()
    })

    it('should handle `modifyPerson`', async () => {
      const ID = 'some-id'
      const INPUT_DATA = { id: ID, data: 'Mocked', phone: '' }
      const RESPONSE = {
        id: ID,
        first_name: 'John',
        last_name: 'Doe',
        filings: [
          {
            id: 'filing-id',
            tax_year: 2018,
            due_date: '2019-10-01',
          },
        ],
      }
      axios.put.mockResolvedValue({ data: RESPONSE, request: RESPONSE_OK })
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const store = mockStore({})
      await store.dispatch(actions.modifyPerson(ID, INPUT_DATA))
      expect(axios.put).toHaveBeenCalled()
      expect(axios.put).toHaveBeenCalledWith(`/persons/${ID}`, {
        ...INPUT_DATA,
        id: undefined,
      })
      expect(store.getActions()).toEqual(expectedActions)
    })

    it('should handle `modifyPerson` with error', async () => {
      const ID = 'some-id'
      const INPUT_DATA = { id: ID, data: 'Mocked', phone: '' }
      const ERROR = 'some error'
      const ERROR_RESPONSE = { error: ERROR, response: {} }
      axios.put.mockRejectedValue(ERROR_RESPONSE)
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const store = mockStore({})
      await store.dispatch(actions.modifyPerson(ID, INPUT_DATA))
      expect(axios.put).toHaveBeenCalled()
      expect(axios.put).toHaveBeenCalledWith(`/persons/${ID}`, {
        ...INPUT_DATA,
        id: undefined,
      })
      expect(store.getActions()).toEqual(expectedActions)
      expect(captureSentryException).toHaveBeenCalled()
      expect(captureSentryException).toHaveBeenCalledWith(ERROR_RESPONSE)
      expect(message.error).toHaveBeenCalled()
    })

    it('should handle `deletePerson`', async () => {
      const ID = 'person-id'
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: ACTIONS_TYPES.REMOVE_PERSON, payload: ID },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const store = mockStore({})
      axios.delete.mockResolvedValue({ data: 'some data' })
      await store.dispatch(actions.deletePerson(ID))
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.delete).toHaveBeenCalled()
      expect(axios.delete).toHaveBeenCalledWith(`/persons/${ID}`)
    })

    it('should handle `deletePerson` with error', async () => {
      const ID = 'person-id'
      const ERROR = 'some error'
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const store = mockStore({})
      axios.delete.mockRejectedValue({ error: ERROR })
      await store.dispatch(actions.deletePerson(ID))
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.delete).toHaveBeenCalled()
      expect(axios.delete).toHaveBeenCalledWith(`/persons/${ID}`)
      expect(captureSentryException).toHaveBeenCalled()
      expect(captureSentryException).toHaveBeenCalledWith({ error: ERROR })
      expect(message.error).toHaveBeenCalled()
    })
  })

  describe('filings actions', () => {
    it('should create `MOCK_FILINGS` action', () => {
      const result = actions.mockFilings()
      expect(result).toEqual({
        type: ACTIONS_TYPES.MOCK_FILINGS,
        payload: { includeId: undefined },
      })
    })

    it('should create `UPDATE_TABLE` action', () => {
      const PAYLOAD = true
      const result = actions.setTableLoading(PAYLOAD)
      expect(result).toEqual({
        type: ACTIONS_TYPES.UPDATE_TABLE,
        payload: { tableLoading: PAYLOAD },
      })
    })

    it('should handle `createFiling`', async () => {
      const FILING_DATA = { data: 'test' }
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const store = mockStore({})
      axios.post.mockResolvedValue({ data: 'some data' })
      await store.dispatch(actions.createFiling(FILING_DATA))
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.post).toHaveBeenCalled()
      expect(axios.post).toHaveBeenCalledWith(`/filings`, FILING_DATA)
    })

    it('should handle `createFiling` with error', async () => {
      const FILING_DATA = { data: 'test' }
      const ERROR = 'some error'
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const store = mockStore({})
      axios.post.mockRejectedValue({ error: ERROR })
      await store.dispatch(actions.createFiling(FILING_DATA))
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.post).toHaveBeenCalled()
      expect(axios.post).toHaveBeenCalledWith(`/filings`, FILING_DATA)
      expect(captureSentryException).toHaveBeenCalled()
      expect(captureSentryException).toHaveBeenCalledWith({ error: ERROR })
      expect(message.error).toHaveBeenCalled()
    })

    it('should handle `changeSubmissionStatus`', async () => {
      const ID = 'test-id'
      const SUBMISSION_STATUS = true
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const store = mockStore({})
      axios.patch.mockResolvedValue({})
      await store.dispatch(actions.changeSubmitStatus(ID, SUBMISSION_STATUS))
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.patch).toHaveBeenCalled()
      expect(axios.patch).toHaveBeenCalledWith(`/filings/${ID}`, {
        is_submitted: SUBMISSION_STATUS,
      })
    })

    it('should handle `changeSubmissionStatus` with error', async () => {
      const ID = 'test-id'
      const SUBMISSION_STATUS = true
      const ERROR = 'some error'
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const store = mockStore({})
      axios.patch.mockRejectedValue({ error: ERROR })
      await store.dispatch(actions.changeSubmitStatus(ID, SUBMISSION_STATUS))
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.patch).toHaveBeenCalled()
      expect(axios.patch).toHaveBeenCalledWith(`/filings/${ID}`, {
        is_submitted: SUBMISSION_STATUS,
      })
      expect(captureSentryException).toHaveBeenCalled()
      expect(captureSentryException).toHaveBeenCalledWith({ error: ERROR })
      expect(message.error).toHaveBeenCalled()
    })

    it('should handle `change160FormSubmissionStatus`', async () => {
      const ID = 'test-id'
      const SUBMISSION_STATUS = true
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const store = mockStore({})
      axios.patch.mockResolvedValue({})
      await store.dispatch(
        actions.change160FormSubmissionStatus(ID, SUBMISSION_STATUS)
      )
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.patch).toHaveBeenCalled()
      expect(axios.patch).toHaveBeenCalledWith(`/filings/${ID}/pro-data`, {
        is_submitted_form_160: SUBMISSION_STATUS,
      })
    })

    it('should handle `change160FormSubmissionStatus` with error', async () => {
      const ID = 'test-id'
      const SUBMISSION_STATUS = true
      const ERROR = 'some error'
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const store = mockStore({})
      axios.patch.mockRejectedValue({ error: ERROR })
      await store.dispatch(
        actions.change160FormSubmissionStatus(ID, SUBMISSION_STATUS)
      )
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.patch).toHaveBeenCalled()
      expect(axios.patch).toHaveBeenCalledWith(`/filings/${ID}/pro-data`, {
        is_submitted_form_160: SUBMISSION_STATUS,
      })
      expect(captureSentryException).toHaveBeenCalled()
      expect(captureSentryException).toHaveBeenCalledWith({ error: ERROR })
      expect(message.error).toHaveBeenCalled()
    })

    it('should handle `changeMustDeclareStatus`', async () => {
      const ID = 'test-id'
      const SUBMISSION_STATUS = true
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const store = mockStore({})
      axios.patch.mockResolvedValue({})
      await store.dispatch(
        actions.changeMustDeclareStatus(ID, SUBMISSION_STATUS)
      )
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.patch).toHaveBeenCalled()
      expect(axios.patch).toHaveBeenCalledWith(`/filings/${ID}/pro-data`, {
        not_needs_submitted: SUBMISSION_STATUS,
      })
    })

    it('should handle `changeMustDeclareStatus` with error', async () => {
      const ID = 'test-id'
      const SUBMISSION_STATUS = true
      const ERROR = 'some error'
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const store = mockStore({})
      axios.patch.mockRejectedValue({ error: ERROR })
      await store.dispatch(
        actions.changeMustDeclareStatus(ID, SUBMISSION_STATUS)
      )
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.patch).toHaveBeenCalled()
      expect(axios.patch).toHaveBeenCalledWith(`/filings/${ID}/pro-data`, {
        not_needs_submitted: SUBMISSION_STATUS,
      })
      expect(captureSentryException).toHaveBeenCalled()
      expect(captureSentryException).toHaveBeenCalledWith({ error: ERROR })
      expect(message.error).toHaveBeenCalled()
    })

    it('should handle `deleteFiling`', async () => {
      const ID = 'filing-id'
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const store = mockStore({})
      axios.delete.mockResolvedValue({ data: 'some data' })
      await store.dispatch(actions.deleteFiling(ID))
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.delete).toHaveBeenCalled()
      expect(axios.delete).toHaveBeenCalledWith(`/filings/${ID}`)
    })

    it('should handle `deleteFiling` with error', async () => {
      const ID = 'filing-id'
      const ERROR = 'some error'
      const expectedActions = [
        { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
        { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      ]
      const store = mockStore({})
      axios.delete.mockRejectedValue({ error: ERROR })
      await store.dispatch(actions.deleteFiling(ID))
      expect(store.getActions()).toEqual(expectedActions)
      expect(axios.delete).toHaveBeenCalled()
      expect(axios.delete).toHaveBeenCalledWith(`/filings/${ID}`)
      expect(captureSentryException).toHaveBeenCalled()
      expect(captureSentryException).toHaveBeenCalledWith({ error: ERROR })
      expect(message.error).toHaveBeenCalled()
    })

    describe(`worker actions`, () => {
      it('should handle `formatFilings`', async () => {
        const ID = 'filing-id'
        const FILINGS_MOCK = { persons: [] }
        const WORKER_FILINGS = 'worker filings'

        mockWorkerReducer.mockResolvedValue({ filings: WORKER_FILINGS })

        const expectedActions = [
          {
            type: ACTIONS_TYPES.UPDATE_TABLE,
            payload: { tableLoading: true },
          },
          { type: ACTIONS_TYPES.UPDATE_TABLE, payload: WORKER_FILINGS },
          {
            type: ACTIONS_TYPES.UPDATE_TABLE,
            payload: { tableLoading: false },
          },
        ]

        const store = mockStore({ filings: FILINGS_MOCK })
        await store.dispatch(actions.formatFilings(ID))

        expect(store.getActions()).toEqual(expectedActions)
        expect(mockWorkerReducer.mock.calls[0]).toEqual([
          { filings: FILINGS_MOCK },
          { type: ACTIONS_TYPES.FORMAT_TABLE },
        ])
      })

      it('should handle `filterFilings`', async () => {
        const FILTERS = {}
        const SORT = false
        const FILINGS_MOCK = { normalized: [] }
        const WORKER_FILINGS = 'worker filings'

        mockWorkerReducer.mockResolvedValue({ filings: WORKER_FILINGS })

        const expectedActions = [
          {
            type: ACTIONS_TYPES.UPDATE_TABLE,
            payload: { tableLoading: true },
          },
          { type: ACTIONS_TYPES.UPDATE_TABLE, payload: WORKER_FILINGS },
          {
            type: ACTIONS_TYPES.UPDATE_TABLE,
            payload: { tableLoading: false },
          },
        ]

        const store = mockStore({ filings: FILINGS_MOCK })
        await store.dispatch(
          actions.filterFilings({ filters: FILTERS, sort: SORT })
        )

        expect(store.getActions()).toEqual(expectedActions)
        expect(mockWorkerReducer.mock.calls[0]).toEqual([
          { filings: FILINGS_MOCK },
          {
            type: ACTIONS_TYPES.FILTER_TABLE,
            payload: {
              filings: FILINGS_MOCK.normalized,
              filters: FILTERS,
              sort: SORT,
            },
          },
        ])
      })
    })
  })
})
