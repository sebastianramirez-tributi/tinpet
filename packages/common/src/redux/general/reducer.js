import initialState from './initialState'
import { ACTION_TYPES } from './actions'

const reducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case ACTION_TYPES.ADD_LOADING_COUNT:
      return {
        ...state,
        loadingCount: state.loadingCount + 1,
      }

    case ACTION_TYPES.REMOVE_LOADING_COUNT:
      return {
        ...state,
        loadingCount: Math.max(state.loadingCount - 1, 0),
      }

    case ACTION_TYPES.SET_TAX_YEAR_CONSTANTS: {
      return {
        ...state,
        constants: action.payload,
        configWasSet: true,
      }
    }

    case ACTION_TYPES.CLEAN_TAXFILING_CONFIG: {
      return {
        ...state,
        constants: {},
        configWasSet: false,
      }
    }
    case ACTION_TYPES.SET_TAX_YEAR_CONSTANTS_ERROR: {
      return {
        ...state,
        configError: true,
      }
    }
    case ACTION_TYPES.SET_CRISP_WEBSITE_ID:
      return {
        ...state,
        crispWebsiteId: payload,
      }

    case ACTION_TYPES.SET_SUMMARY_TAB_STATUS:
      return {
        ...state,
        isSummaryTabActive: payload,
      }

    default:
      return state
  }
}

export default reducer
