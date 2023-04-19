import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { render } from '@testing-library/react'

import { mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from 'emotion-theming'
import { getContextValue, RootContext } from '../../context'
import theme from './theme'
import { createMemoryHistory } from 'history'
import assets from './assets.json'

const contextValue = getContextValue('app')

export const MockMountWithTheme = (component) => {
  return mount(<MemoryRouter keyLength={0}>{component}</MemoryRouter>, {
    wrappingComponent: ({ children }) => (
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    ),
  })
}

export const MockWithTheme = (component, fn) => {
  return fn(component, {
    wrappingComponent: ({ children }) => (
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    ),
  })
}

export const MockWithThemeAndCustomProvider = (
  component,
  fn,
  CustomContext,
  contextProps
) =>
  fn(component, {
    wrappingComponent: ({ children }) => (
      <ThemeProvider theme={theme}>
        <CustomContext.Provider value={contextProps}>
          {children}
        </CustomContext.Provider>
      </ThemeProvider>
    ),
  })

export const MockWithThemeAndRootProvider = (
  component,
  fn,
  initialEntries,
  initialIndex,
  config = {}
) =>
  fn(component, {
    wrappingComponent: ({ children }) => (
      <MemoryRouter
        keyLength={0}
        initialEntries={initialEntries}
        initialIndex={initialIndex}
      >
        <ThemeProvider theme={theme}>
          <RootContext.Provider value={{ ...contextValue, ...config }}>
            {children}
          </RootContext.Provider>
        </ThemeProvider>
      </MemoryRouter>
    ),
  })

export const MockWithRootContext = (component, config = {}) => {
  return (
    <RootContext.Provider value={{ ...contextValue, ...config }}>
      {component}
    </RootContext.Provider>
  )
}

export const MockWithReduxProvider = (component, fn, store) =>
  fn(component, {
    wrappingComponent: ({ children }) => (
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <Provider store={store}>{children}</Provider>
        </ThemeProvider>
      </MemoryRouter>
    ),
  })

export const customProvider = (Component, providerParams) => {
  return function CustomProviderComponent({ children, ...props }) {
    // Takes the props and only grab the ones that needs, and pass the rest to the children
    // This is useful in case a prop is updated in a test, but only `wrappingComponent` can receive the update
    const [componentProps, childrenProps] = Object.entries(props).reduce(
      ([parent, child], [key, value]) => [
        { ...parent, [key]: key in providerParams ? value : undefined },
        { ...child, [key]: key in providerParams ? undefined : value },
      ],
      [{}, {}]
    )
    return (
      <Component {...providerParams} {...componentProps}>
        {React.cloneElement(children, childrenProps)}
      </Component>
    )
  }
}

export const rootContextProvider = (overrideContext) =>
  customProvider(RootContext.Provider, {
    value: Object.assign({}, { assets }, overrideContext || contextValue),
  })

export const reduxPersistProvider = (persistor) =>
  customProvider(PersistGate, { persistor })

export const reduxProvider = (store) => customProvider(Provider, { store })

export const routerProvider = (
  {
    initialEntries,
    initialIndex,
    history = createMemoryHistory({ initialEntries }),
  } = {},
  routerComponent = MemoryRouter
) =>
  customProvider(routerComponent, {
    keyLength: 0,
    initialEntries,
    initialIndex,
    navigator: history,
    location: history.location,
  })

export const themeProvider = () =>
  customProvider(ThemeProvider, {
    theme,
  })

export const MockWithProvidersLegacy = (component, fn, providers = []) => {
  const wrappingComponent = function ({ children, ...props }) {
    let wrapped = children
    providers.forEach((provider) => {
      wrapped = React.createElement(provider, props, wrapped)
    })
    return wrapped
  }

  return fn(component, {
    wrappingComponent,
  })
}

// REACT TESTING LIBRARY
export const mockWithProviders = (component, providers = [], options = {}) => {
  const wrappingComponent = function ({ children, ...props }) {
    let wrapped = children
    providers.forEach((provider) => {
      wrapped = React.createElement(provider, props, wrapped)
    })
    return wrapped
  }

  return render(component, { wrapper: wrappingComponent, ...options })
}
