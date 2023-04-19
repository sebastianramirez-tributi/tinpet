import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from 'emotion-theming'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { RootContext, getContextValue } from '../../context'
import configureStore from '../../redux/store/configureStore'
import { ROLES } from '../../constants/person'

const { store, persistor } = configureStore()

function AppShell({ children, defaultSubdomain, subdomains, theme, ...props }) {
  const contextValue = useMemo(
    () => ({
      ...getContextValue(defaultSubdomain, subdomains),
      ...props,
      persistor,
    }),
    [defaultSubdomain, subdomains, props]
  )

  return (
    <ThemeProvider theme={theme}>
      <ReduxProvider store={store}>
        <PersistGate persistor={persistor}>
          <RootContext.Provider value={contextValue}>
            {children}
          </RootContext.Provider>
        </PersistGate>
      </ReduxProvider>
    </ThemeProvider>
  )
}

AppShell.propTypes = {
  children: PropTypes.node.isRequired,
  defaultSubdomain: PropTypes.string.isRequired,
  subdomains: PropTypes.object,
  redirectOnPartner: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      layout: PropTypes.func,
      exact: PropTypes.bool,
      assistable: PropTypes.bool,
      path: PropTypes.string,
      component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    }).isRequired
  ),
  suffix: PropTypes.string,
  isEnableRemoveFiling: PropTypes.bool,
  isPaymentElegible: PropTypes.bool,
  showWelcome: PropTypes.bool,
  appRole: PropTypes.oneOf(Object.values(ROLES)).isRequired,
  isEnableMigration: PropTypes.bool,
  isAccountantApp: PropTypes.bool,
  isTaxPlanningApp: PropTypes.bool,
  showAuth0: PropTypes.bool,
  assets: PropTypes.object,
  knownFrom: PropTypes.array,
  forumURL: PropTypes.string,
  landing: PropTypes.string,
}

AppShell.defaultProps = {
  redirectOnPartner: false,
  subdomains: {},
  suffix: '',
  isEnableRemoveFiling: false,
  isPaymentElegible: true,
  showWelcome: true,
  isEnableMigration: true,
  isAccountantApp: false,
  isTaxPlanningApp: false,
  showAuth0: true,
  assets: {},
  knownFrom: [],
  forumURL: '',
  landing: '/',
}

export default AppShell
