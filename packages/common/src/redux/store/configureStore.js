import { applyMiddleware, compose, createStore } from 'redux'
import { persistStore } from 'redux-persist'
import thunk from 'redux-thunk'

import workerMiddleware from '../middleware/workerMiddleware'
import getAsyncReducer from '../rootAsyncReducer'
import rootReducer from '../rootReducer'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(workerMiddleware.withAsyncReducer(getAsyncReducer), thunk)
    )
  )
  const persistor = persistStore(store)
  return { store, persistor }
}
