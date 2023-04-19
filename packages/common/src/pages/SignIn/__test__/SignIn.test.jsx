import React from 'react'
import SignIn from '..'
import RedirectUser from '../../../helpers/redirect-user'

import {
  mockWithProviders,
  themeProvider,
  rootContextProvider,
  routerProvider,
  reduxProvider,
} from '../../../helpers/__mocks__/mock-providers'
import { store, overwriteStore } from '../../../helpers/__mocks__/mock-reducer'

jest.mock('../../../redux/auth/actions')

const setup = (baseProps, overwrittenStore) => {
  const props = {
    handleSSOAuth: jest.fn(),
    ...baseProps,
  }
  const actualStore = overwrittenStore || store
  const wrapper = mockWithProviders(<SignIn {...props} />, [
    routerProvider(),
    themeProvider(),
    reduxProvider(actualStore),
    rootContextProvider(),
  ])
  const { rerender } = wrapper
  return { wrapper, props, rerender }
}
const mockUser = {
  id: 'test-id',
  role: 'tax_filer',
  first_name: 'Test',
  last_name: 'Test',
  email: 'test@test.com',
  national_id: '123456789',
  phone: '+573216549898',
  tyc_has_accepted: false,
  tyc_date: '2020-07-31T00:25:34.439670Z',
  know_from: 'Google',
  fillings: [
    {
      id: 'test-id',
    },
  ],
}

describe('<SignIn />', () => {
  it('Should render properly', () => {
    const { wrapper } = setup()
    expect(wrapper.getByTestId('container')).toBeTruthy()
  })
  it('Should assign properly with params', () => {
    const token = 'foo'
    const refresh = 'bar'
    window.history.pushState({}, null, `?token=${token}&refresh=${refresh}`)
    const { props } = setup()
    const { handleSSOAuth } = props
    expect(handleSSOAuth).toBeCalled()
    expect(handleSSOAuth).toHaveBeenCalledWith(token, refresh, false)
  })
  it('Should call RedirectUser if user is being retrieved properly', () => {
    const spy = jest.spyOn(RedirectUser, 'fromSSO')
    const ssoStore = overwriteStore({
      auth: { userInfo: mockUser, isAuthenticated: true },
    })
    setup({}, ssoStore)
    expect(spy).toBeCalled()
    spy.mockRestore()
  })
  it('Should call error action when an error occurs and also img', () => {
    const MOCK_ERROR = 'error'
    const ssoStore = overwriteStore({
      auth: { error: MOCK_ERROR, isAuthenticated: false },
    })
    const { wrapper } = setup(null, ssoStore)
    expect(wrapper.getAllByRole('img')).toBeTruthy()
    expect(wrapper.getByText('error')).toBeInTheDocument()
  })
})
