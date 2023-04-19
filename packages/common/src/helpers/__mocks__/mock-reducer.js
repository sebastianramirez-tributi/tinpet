import configureStore from 'redux-mock-store'
import merge from 'lodash/merge'
import { persistStore } from 'redux-persist'

jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist')
  return {
    ...real,
    persistReducer: jest
      .fn()
      .mockImplementation((config, reducers) => reducers),
  }
})

const MIDDLEWARES = []

const DEFAULT_STORE = {
  taxReducer: {
    TaxInfo: [
      {
        id: '1f30043d-609b-4dfd-ab08-3994add902b6',
        product: {
          name: 'Planeación Tributaria',
          description: 'PR',
          kind: 'tax_planning',
        },
        created_at: '2019-12-09T21:46:45.738608Z',
        updated_at: '2019-12-11T20:40:35.410106Z',
        description: 'planeacion',
        status: 'declined',
        price: '2000.00',
        user: 'eea89c90-ac46-4d76-903b-523a15b0defc',
      },
    ],
    payment_order: {},
  },
  paymentReducer: {
    compute_taxes: {},
  },
  onboardingReducer: {
    summaryData: [],
  },
  auth: {
    isAuthenticated: true,
    userInfo: {},
  },
  registerReducer: {},
  accountant: {},
  personalInfo: {
    _persist: 'mock-persist',
  },
  general: {},
  filings: {},
}

const createMockStore = configureStore(MIDDLEWARES)

export const overwriteStore = (storeValue = {}) => {
  const store = createMockStore(merge({}, DEFAULT_STORE, storeValue))
  store.dispatch = jest.fn()
  return store
}

export const store = overwriteStore()

export const persistor = persistStore(store)
