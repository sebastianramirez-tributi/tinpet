import React from 'react'

import { mockWithProviders } from '../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../helpers/__mocks__/mock-reducer'
import AppShell from './AppShell'

function mockComponent(dataTestId, mockCallback) {
  function component({ children, ...props }) {
    if (mockCallback) mockCallback(props)

    return (
      <div {...props} data-testid={dataTestId}>
        {children}
      </div>
    )
  }
  return component
}

const mockStore = overwriteStore({})
let mockPersistor
jest.mock('../../redux/store/configureStore', () => {
  mockPersistor = {}
  return {
    __esModule: true,
    default: () => ({ store: mockStore, persistor: mockPersistor }),
  }
})

/**
 * We mock every provider used in AppShell component.
 *
 * And to track the props sent to those providers, we create
 * a variable to store the function mock created with `jest.fn`
 */

let mockThemeProvider
jest.mock('emotion-theming', function () {
  mockThemeProvider = jest.fn()
  return {
    ThemeProvider: mockComponent('theme-provider', mockThemeProvider),
  }
})

let mockReduxProvider
jest.mock('react-redux', function () {
  mockReduxProvider = jest.fn()
  return {
    Provider: mockComponent('redux-provider', mockReduxProvider),
  }
})

let mockPersistorProvider
jest.mock('redux-persist/integration/react', function () {
  mockPersistorProvider = jest.fn()
  return {
    PersistGate: mockComponent('persistor-provider', mockPersistorProvider),
  }
})

let mockContextProvider
jest.mock('../../context', function () {
  const actualModule = jest.requireActual('../../context')
  mockContextProvider = jest.fn()
  return {
    RootContext: {
      Provider: mockComponent('context-provider', mockContextProvider),
    },
    getContextValue: actualModule.getContextValue,
  }
})

const SimpleComponent = mockComponent('simple-component')

const setup = (ChildrenComponent, initialProps = {}) => {
  const props = {
    defaultSubdomain: 'APP',
    routes: [],
    subdomains: {},
    suffix: '',
    theme: {},
    ...initialProps,
  }
  const wrapper = mockWithProviders(
    <AppShell {...props}>
      <ChildrenComponent />
    </AppShell>
  )

  return { wrapper, props }
}

describe('AppShell specs', () => {
  beforeEach(() => {
    mockThemeProvider.mockReset()
  })

  it('should render children component', () => {
    const { wrapper } = setup(SimpleComponent)
    const child = wrapper.queryByTestId('simple-component')
    expect(child).toBeInTheDocument()
  })

  it('should render theme provider with `theme` prop', () => {
    const THEME = { theme: 'mock theme' }
    const { wrapper } = setup(SimpleComponent, { theme: THEME })
    const themeProvider = wrapper.queryByTestId('theme-provider')

    expect(themeProvider).toBeInTheDocument()
    expect(mockThemeProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        theme: THEME,
      })
    )
  })

  it('should render redux provider with `store` prop', () => {
    const { wrapper } = setup(SimpleComponent)
    const reduxProvider = wrapper.queryByTestId('redux-provider')

    expect(reduxProvider).toBeInTheDocument()
    expect(mockReduxProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        store: mockStore.store,
      })
    )
  })

  it('should render persistor provider with `persistor` prop', () => {
    const { wrapper } = setup(SimpleComponent)
    const persistorProvider = wrapper.queryByTestId('persistor-provider')

    expect(persistorProvider).toBeInTheDocument()
    expect(mockPersistorProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        persistor: mockPersistor,
      })
    )
  })

  it('should render context provider with `value` prop', () => {
    const ROUTES = []
    const SUFFIX = 'test'
    const { wrapper } = setup(SimpleComponent, {
      routes: ROUTES,
      suffix: SUFFIX,
    })
    const contextProvider = wrapper.queryByTestId('context-provider')

    expect(contextProvider).toBeInTheDocument()
    expect(mockContextProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        value: expect.objectContaining({
          routes: ROUTES,
          suffix: SUFFIX,
        }),
      })
    )
  })
})
