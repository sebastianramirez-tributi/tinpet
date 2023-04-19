import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'

import {
  personalInfoPersistConfig,
  rootPersistConfig,
} from './store/redux-persist-config'
import { ACTION_TYPES as GENERAL_ACTION_TYPES } from './general/actions'
import generalReducer from './general/reducer'
import personalInfo from './personalInfo/reducer'
import authReducer from './auth/reducer'
import onboardingReducer from './onboarding/reducer'
import paymentReducer from './payment/reducer'
import taxReducer from './tax/reducer'
import registerReducer from './form/reducer'
import belvo from './belvo/reducer'
import aranea from './aranea/reducer'
import filings from './filings/reducer'

const appReducer = combineReducers({
  auth: authReducer,
  general: generalReducer,
  onboardingReducer,
  paymentReducer,
  registerReducer,
  taxReducer,
  belvo,
  personalInfo: persistReducer(personalInfoPersistConfig, personalInfo),
  aranea,
  filings,
})

const rootReducer = (state, action) => {
  if (action.type === GENERAL_ACTION_TYPES.RESET_STORE) {
    state = undefined
  }
  return appReducer(state, action)
}

export default persistReducer(rootPersistConfig, rootReducer)
