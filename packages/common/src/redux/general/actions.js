// Action Types

export const ACTION_TYPES = {
  ADD_LOADING_COUNT: '@@general/add-loading-count',
  REMOVE_LOADING_COUNT: '@@general/remove-loading-count',
  SET_CRISP_WEBSITE_ID: '@@general/set-crisp-website-id',
  RESET_STORE: '@@general/reset-store',
  SET_TAX_YEAR_CONSTANTS: '@@general/set-tax-year-constants',
  CLEAN_TAXFILING_CONFIG: '@@general/clean-taxfiling-config',
  SET_TAX_YEAR_CONSTANTS_ERROR: '@@general/set-tax-year-constants/error',
  SET_SUMMARY_TAB_STATUS: '@@general/set-summary-tab-status',
}

// Action Creators

/**
 * Adds 1 step to the loading count
 * If the loading count is grater than zero, the a loader is shown
 * otherwise, is hidden
 */
export const startLoading = () => ({ type: ACTION_TYPES.ADD_LOADING_COUNT })

/**
 * Removes 1 step from the loading count
 * If the loading count is grater than zero, the a loader is shown
 * otherwise, is hidden
 */
export const stopLoading = () => ({ type: ACTION_TYPES.REMOVE_LOADING_COUNT })

export const setCrispWebsiteId = (websiteId) => ({
  type: ACTION_TYPES.SET_CRISP_WEBSITE_ID,
  payload: websiteId,
})

/**
 * Set the active status for summary tab on the onboarding
 * @param {boolean} isActive tells if the tab is active or not
 */
export const setSummaryTabStatus = (isActive) => ({
  type: ACTION_TYPES.SET_SUMMARY_TAB_STATUS,
  payload: isActive,
})

// Resets the entire store
export const resetStore = () => ({ type: ACTION_TYPES.RESET_STORE })

export const getTaxFilingConfig =
  (countryCode, taxableKind) => async (dispatch) => {
    try {
      const { constants } = await import(
        `onboardingConfig/${countryCode.toLowerCase()}/${taxableKind.toLowerCase()}`
      )
      dispatch({
        type: ACTION_TYPES.SET_TAX_YEAR_CONSTANTS,
        payload: constants,
      })
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_TAX_YEAR_CONSTANTS_ERROR,
      })
    }
  }

export const cleanTaxFilingConfig = () => ({
  type: ACTION_TYPES.CLEAN_TAXFILING_CONFIG,
})
