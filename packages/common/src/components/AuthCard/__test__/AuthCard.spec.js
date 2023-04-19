import React from 'react'
import {
  mockWithProviders,
  rootContextProvider,
  themeProvider,
} from '../../../helpers/__mocks__/mock-providers'
import AuthCard from '..'

const setup = (initialProps, contextProps) => {
  const props = {
    card: true,
    ...initialProps,
  }
  const rootContextProps = {
    isTributi: true,
    ...contextProps,
  }
  const wrapper = mockWithProviders(<AuthCard {...props} />, [
    themeProvider(),
    rootContextProvider(rootContextProps),
  ])
  return { props, wrapper }
}

describe('<AuthCard />', () => {
  it('should render <TributiLogo/> inside with subdomain BANCOLOMBIA', () => {
    const EXPECTED_IMG = 3
    const subdomainConfig = {
      image: 'urlImage',
      key: 'bancolombia',
    }
    const { wrapper } = setup(null, { subdomainConfig })
    expect(wrapper.getAllByRole('img')).toHaveLength(EXPECTED_IMG)
  })

  it('should render <TributiLogo/> inside with no subdomainConfig', () => {
    const EXPECTED_IMG = 2
    const { wrapper } = setup()
    expect(wrapper.getAllByRole('img')).toHaveLength(EXPECTED_IMG)
  })
})
