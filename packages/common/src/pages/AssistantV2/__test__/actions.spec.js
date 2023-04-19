import thunk from 'redux-thunk'
import axios from 'axios'
import configureMockStore from 'redux-mock-store'
import * as ACTION_TYPES from '../../../redux/actionTypes'
import { ACTION_TYPES as GENERAL_ACTION_TYPES } from '../../../redux/general/actions'
import * as actions from '../../../redux/form/actions'
import { captureSentryException } from '../../../sentry'

jest.mock('../../../sentry')
const middleware = [thunk]
const mockStore = configureMockStore(middleware)

describe('ACTIONS ', () => {
  it('should get all users', async () => {
    const DATA = 'data'
    const RESPONSE = [
      {
        id: 'some-id',
        first_name: 'John',
        last_name: 'Doe',
      },
    ]
    axios.get.mockResolvedValue({ data: RESPONSE })
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      {
        type: ACTION_TYPES.SEARCH_ASSISTANT_USERS_SUCCESS,
        data: RESPONSE,
        assistantState: {},
      },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
    ]
    const store = mockStore({})
    await store.dispatch(actions.getAsistantUsers(DATA, {}))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should catch error getting all users', async () => {
    const DATA = 'data'
    const ERROR = 'request fail'
    axios.get.mockRejectedValue(ERROR)
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      { type: ACTION_TYPES.SEARCH_ASSISTANT_USERS_ERROR, error: ERROR },
    ]
    const store = mockStore({})
    await store.dispatch(actions.getAsistantUsers(DATA, {}))
    expect(captureSentryException).toHaveBeenCalled()
    expect(captureSentryException).toHaveBeenCalledWith(ERROR)
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should get all persons', async () => {
    const DATA = { user_id: 'some-id' }
    const RESPONSE = [
      {
        id: 'some-id',
        first_name: 'John',
        last_name: 'Doe',
      },
    ]
    axios.get.mockResolvedValue({ data: RESPONSE })
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      {
        type: ACTION_TYPES.SEARCH_ASSISTANT_PERSONS_SUCCESS,
        data: RESPONSE,
        assistantState: {},
      },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
    ]
    const store = mockStore({})
    await store.dispatch(actions.getAssistantPersons(DATA, {}))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should catch error getting all persons', async () => {
    const DATA = 'data'
    const ERROR = 'request fail'
    axios.get.mockRejectedValue(ERROR)
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      { type: ACTION_TYPES.SEARCH_ASSISTANT_PERSONS_ERROR, error: ERROR },
    ]
    const store = mockStore({})
    await store.dispatch(actions.getAssistantPersons(DATA, {}))
    expect(captureSentryException).toHaveBeenCalled()
    expect(captureSentryException).toHaveBeenCalledWith(ERROR)
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should get all filings by person', async () => {
    const DATA = { id: 'some-id' }
    const RESPONSE = [
      {
        id: 'some-id',
        tax_year: 'mocked',
        product_plan: 'mocked',
      },
    ]
    axios.get.mockResolvedValue({ data: RESPONSE })
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      {
        type: ACTION_TYPES.SEARCH_ASSISTANT_FILINGS_BY_PERSON_SUCCESS,
        data: RESPONSE,
        assistantState: {},
      },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
    ]
    const store = mockStore({})
    await store.dispatch(actions.getAssistantFilingsByPerson(DATA, {}))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should catch error getting all filings by person', async () => {
    const DATA = 'data'
    const ERROR = 'request fail'
    axios.get.mockRejectedValue(ERROR)
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      {
        type: ACTION_TYPES.SEARCH_ASSISTANT_FILINGS_BY_PERSON_ERROR,
        error: ERROR,
      },
    ]
    const store = mockStore({})
    await store.dispatch(actions.getAssistantFilingsByPerson(DATA, {}))
    expect(captureSentryException).toHaveBeenCalled()
    expect(captureSentryException).toHaveBeenCalledWith(ERROR)
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should get all documents by filing', async () => {
    const DATA = { filing_id: 'some-id' }
    const RESPONSE = [
      {
        id: 'some-id',
        created_at: 'mocked',
        status: 'mocked',
      },
    ]
    axios.get.mockResolvedValue({ data: RESPONSE })
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      {
        type: ACTION_TYPES.SEARCH_ASSISTANT_DOCUMENTS_BY_FILING_SUCCESS,
        data: RESPONSE,
        assistantState: {},
      },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
    ]
    const store = mockStore({})
    await store.dispatch(actions.getAssistantDocumentsByFiling(DATA, {}))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should catch error getting all documents by filing', async () => {
    const DATA = 'data'
    const ERROR = 'request fail'
    axios.get.mockRejectedValue(ERROR)
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      {
        type: ACTION_TYPES.SEARCH_ASSISTANT_DOCUMENTS_BY_FILING_ERROR,
        error: ERROR,
      },
    ]
    const store = mockStore({})
    await store.dispatch(actions.getAssistantDocumentsByFiling(DATA, {}))
    expect(captureSentryException).toHaveBeenCalled()
    expect(captureSentryException).toHaveBeenCalledWith(ERROR)
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should get all engines by filing', async () => {
    const DATA = { filing_id: 'some-id' }
    const RESPONSE = [
      {
        id: 'some-id',
        author: 'mocked',
        is_assistant: 'mocked',
      },
    ]
    axios.get.mockResolvedValue({ data: RESPONSE })
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      {
        type: ACTION_TYPES.SEARCH_ASSISTANT_ENGINES_BY_FILING_SUCCESS,
        data: RESPONSE,
        assistantState: {},
      },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
    ]
    const store = mockStore({})
    await store.dispatch(actions.getAssistantEnginesByFiling(DATA, {}))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should catch error engines by filing', async () => {
    const DATA = 'data'
    const ERROR = 'request fail'
    axios.get.mockRejectedValue(ERROR)
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      {
        type: ACTION_TYPES.SEARCH_ASSISTANT_ENGINES_BY_FILING_ERROR,
        error: ERROR,
      },
    ]
    const store = mockStore({})
    await store.dispatch(actions.getAssistantEnginesByFiling(DATA, {}))
    expect(captureSentryException).toHaveBeenCalled()
    expect(captureSentryException).toHaveBeenCalledWith(ERROR)
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should get all payments by filing', async () => {
    const DATA = { filing_id: 'some-id' }
    const RESPONSE = [
      {
        id: 'some-id',
        author: 'mocked',
        is_assistant: 'mocked',
      },
    ]
    axios.get.mockResolvedValue({ data: RESPONSE })
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      {
        type: ACTION_TYPES.SEARCH_ASSISTANT_PAYMENTS_BY_FILING_SUCCESS,
        data: RESPONSE,
        assistantState: {},
      },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
    ]
    const store = mockStore({})
    await store.dispatch(actions.getAssistantPaymentsByFiling(DATA, {}))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should catch error payments by filing', async () => {
    const DATA = 'data'
    const ERROR = 'request fail'
    axios.get.mockRejectedValue(ERROR)
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      {
        type: ACTION_TYPES.SEARCH_ASSISTANT_PAYMENTS_BY_FILING_ERROR,
        error: ERROR,
      },
    ]
    const store = mockStore({})
    await store.dispatch(actions.getAssistantPaymentsByFiling(DATA, {}))
    expect(captureSentryException).toHaveBeenCalled()
    expect(captureSentryException).toHaveBeenCalledWith(ERROR)
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should save data user when is activated', async () => {
    const DATA = { user: 'some-id', data: { is_active: true } }
    const MESSAGE = 'Usuario activado exitosamente.'
    const RESPONSE = {
      data: {
        id: 'some-id',
        author: 'mocked',
        is_assistant: 'mocked',
        is_active: true,
      },
    }
    axios.put.mockResolvedValue(RESPONSE)
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      {
        type: ACTION_TYPES.SAVE_ASSISTANT_USER_SUCCESS,
        data: RESPONSE.data,
        message: MESSAGE,
      },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
    ]
    const store = mockStore({})
    await store.dispatch(actions.saveAssistantUser(DATA.user, DATA.data))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should save data user when is inactived', async () => {
    const DATA = { user: 'some-id', data: { is_active: false } }
    const MESSAGE = 'Usuario inactivado exitosamente.'
    const RESPONSE = {
      data: {
        id: 'some-id',
        author: 'mocked',
        is_assistant: 'mocked',
        is_active: false,
      },
    }
    axios.put.mockResolvedValue(RESPONSE)
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      {
        type: ACTION_TYPES.SAVE_ASSISTANT_USER_SUCCESS,
        data: RESPONSE.data,
        message: MESSAGE,
      },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
    ]
    const store = mockStore({})
    await store.dispatch(actions.saveAssistantUser(DATA.user, DATA.data))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should catch error when active/inactive user', async () => {
    const DATA = { user: 'some-id', data: { is_active: false } }
    const ERROR = { response: { data: { detail: 'request fail' } } }
    axios.put.mockRejectedValue(ERROR)
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      { type: ACTION_TYPES.SAVE_ASSISTANT_USER_ERROR, error: ERROR },
    ]
    const store = mockStore({})
    await store.dispatch(actions.saveAssistantUser(DATA.user, DATA.data))
    expect(captureSentryException).toHaveBeenCalled()
    expect(captureSentryException).toHaveBeenCalledWith(ERROR)
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should save data person when is adited', async () => {
    const DATA = { user: 'some-id', data: { is_active: false } }
    const RESPONSE = {
      data: {
        id: 'some-id',
        author: 'mocked',
        is_assistant: 'mocked',
        is_active: false,
      },
    }
    axios.put.mockResolvedValue(RESPONSE)
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      { type: ACTION_TYPES.SAVE_ASSISTANT_PERSON_SUCCESS, data: RESPONSE.data },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
    ]
    const store = mockStore({})
    await store.dispatch(actions.saveAssistantPerson(DATA.user, DATA.data))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should catch error when data is adited', async () => {
    const DATA = { user: 'some-id', data: { is_active: false } }
    const ERROR = {
      response: { data: { detail: ['request fail'] } },
      errorMessage: 'detail: request fail',
      status: 409,
    }
    axios.put.mockRejectedValue(ERROR)
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      { type: ACTION_TYPES.SAVE_ASSISTANT_PERSON_ERROR, error: ERROR },
    ]
    const store = mockStore({})
    await store.dispatch(actions.saveAssistantPerson(DATA.user, DATA.data))
    expect(captureSentryException).toHaveBeenCalled()
    expect(captureSentryException).toHaveBeenCalledWith(ERROR)
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should update the assistantLocalState', async () => {
    const DATA = { currentUser: {} }
    const store = mockStore({})
    await store.dispatch(actions.setAssistantLocalState(DATA))
    expect(store.getActions()).toEqual([
      {
        type: ACTION_TYPES.UPDATE_ASSISTANT_LOCAL_STATE,
        data: DATA,
      },
    ])
  })

  it('should get filing by user', async () => {
    const DATA = { filing_id: 'some-id' }
    const RESPONSE = [
      {
        id: 'some-id',
        product_plan: 'mocked',
        payment_status: 'mocked',
      },
    ]
    axios.get.mockResolvedValue({ data: RESPONSE })
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      {
        type: ACTION_TYPES.SEARCH_ASSISTANT_FILINGS_BY_USER_SUCCESS,
        data: RESPONSE,
        assistantState: {},
      },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
    ]
    const store = mockStore({})
    await store.dispatch(actions.getAssistantFilingsByUser(DATA, {}))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should catch error when get filing by user', async () => {
    const DATA = { filing_id: 'some-id' }
    const ERROR = {
      response: { data: { detail: 'request fail' } },
      errorMessage: 'request fail',
      status: 409,
    }
    axios.get.mockRejectedValue(ERROR)
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      {
        type: ACTION_TYPES.SEARCH_ASSISTANT_FILINGS_BY_USER_ERROR,
        error: ERROR,
      },
    ]
    const store = mockStore({})
    await store.dispatch(actions.getAssistantFilingsByUser(DATA, {}))
    expect(captureSentryException).toHaveBeenCalled()
    expect(captureSentryException).toHaveBeenCalledWith(ERROR)
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should get firebase document status', async () => {
    const DATA = 'some-id'
    const RESPONSE = {
      documentId: 'some-id',
      status: 'status',
    }

    axios.get.mockResolvedValue({ data: RESPONSE, status: 'status' })
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      {
        type: ACTION_TYPES.SEARCH_ASSISTANT_FIREBASE_DOCUMENT_STATUS_SUCCESS,
        payload: RESPONSE,
      },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
    ]
    const store = mockStore({})
    await store.dispatch(actions.getFirebaseDocumentStatus(DATA, axios.get))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should catch error when get firebase document status', async () => {
    const DATA = 'some-id'
    const ERROR = {
      response: { data: { detail: 'request fail' } },
      errorMessage: 'request fail',
      status: 409,
    }

    axios.get.mockRejectedValue(ERROR)
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      { type: ACTION_TYPES.SEARCH_ASSISTANT_FIREBASE_DOCUMENT_STATUS_ERROR },
    ]
    const store = mockStore({})
    await store.dispatch(actions.getFirebaseDocumentStatus(DATA, axios.get))
    expect(captureSentryException).toHaveBeenCalled()
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should update assistant user', async () => {
    const DATA = 'some-id'
    const RESPONSE = {
      documentId: 'some-id',
      status: 'status',
    }

    axios.get.mockResolvedValue({ data: RESPONSE })
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      { type: ACTION_TYPES.UPDATE_ASSISTANT_USERS_SUCCESS, data: RESPONSE },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
    ]
    const store = mockStore({})
    await store.dispatch(actions.updateAsistantUsers(DATA))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should catch error when update assistant user', async () => {
    const DATA = 'some-id'
    const ERROR = {
      response: { data: { detail: 'request fail' } },
      errorMessage: 'request fail',
      status: 409,
    }

    axios.get.mockRejectedValue(ERROR)
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      { type: ACTION_TYPES.SEARCH_ASSISTANT_USERS_ERROR, error: ERROR },
    ]
    const store = mockStore({})
    await store.dispatch(actions.updateAsistantUsers(DATA))
    expect(captureSentryException).toHaveBeenCalled()
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should swap account from assistant', async () => {
    const DATA = 'some-id'
    const RESPONSE = {
      documentId: 'some-id',
      status: 'status',
    }

    axios.patch.mockResolvedValue({ data: RESPONSE })
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      {
        type: ACTION_TYPES.SWAP_ACCOUNT_FROM_ASSISTANT_SUCCESS,
        data: RESPONSE,
        assistantState: {},
      },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
    ]
    const store = mockStore({})
    await store.dispatch(actions.swapAccountFromAssistant(DATA, {}))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should catch swap account from assistant', async () => {
    const DATA = 'some-id'
    const ERROR = {
      response: { data: { detail: 'request fail' } },
      errorMessage: 'request fail',
      status: 409,
    }

    axios.patch.mockRejectedValue(ERROR)
    const expectedActions = [
      { type: GENERAL_ACTION_TYPES.ADD_LOADING_COUNT },
      { type: GENERAL_ACTION_TYPES.REMOVE_LOADING_COUNT },
      { type: ACTION_TYPES.SWAP_ACCOUNT_FROM_ASSISTANT_ERROR, error: ERROR },
    ]
    const store = mockStore({})
    await store.dispatch(actions.swapAccountFromAssistant({ data: DATA }, {}))
    expect(captureSentryException).toHaveBeenCalled()
    expect(captureSentryException).toHaveBeenCalledWith(ERROR)
    expect(store.getActions()).toEqual(expectedActions)
  })
})
