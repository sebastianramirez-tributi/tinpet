import { ACTION_TYPES, INITIAL_STATE } from './constants'

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_INFO: {
      const newState = action.payload
      const { last_filing: lastFiling } = newState
      const localFilings = lastFiling ? [lastFiling] : []
      return {
        ...newState,
        localFilings,
        currentFiling: lastFiling,
      }
    }

    case ACTION_TYPES.UPDATE_INFO: {
      const { personalInfo: newState, merge } = action.payload
      const oldState = merge && state ? state : {}
      return {
        ...oldState,
        ...newState,
      }
    }

    case ACTION_TYPES.SET_CURRENT_FILING: {
      const { filing, merge } = action.payload
      const { localFilings, currentFiling } = state
      // Remove the existing filing from locals to append the updated one later
      const updatedLocalFilings = localFilings.filter(
        ({ id }) => id !== filing.id
      )
      const updatedCurrentFiling = merge
        ? // We use `Object.assign` due to `currentFiling` could be `null`,
          // and cannot be set a default value when destruct
          Object.assign({}, currentFiling || {}, filing)
        : filing
      return {
        ...state,
        // Merge updated and local filings
        localFilings: [...updatedLocalFilings, updatedCurrentFiling],
        currentFiling: updatedCurrentFiling,
      }
    }

    case ACTION_TYPES.CLEAR_CURRENT_FILING: {
      return {
        ...state,
        currentFiling: null,
      }
    }

    case ACTION_TYPES.DELETE_FILING: {
      const { localFilings } = state
      const updatedLocalFilings = localFilings.filter(
        ({ id }) => id !== action.payload
      )
      return {
        ...state,
        localFilings: updatedLocalFilings,
      }
    }

    case ACTION_TYPES.CLEAR_INFO: {
      return null
    }

    default:
      return state
  }
}

export default reducer
