import { expose } from 'comlink'
import { combineReducers } from 'redux'
import filingsReducer from './filings/reducer'

const asyncReducer = combineReducers({
  filings: filingsReducer,
})

expose(asyncReducer)
