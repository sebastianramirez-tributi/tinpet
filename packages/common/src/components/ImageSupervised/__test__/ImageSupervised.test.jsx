import React from 'react'

import {
  mockWithProviders,
  themeProvider,
  rootContextProvider,
} from '../../../helpers/__mocks__/mock-providers'
import ImageSupervised from '..'

const setup = (initialProps, contextProps) => {
  const props = { withExtraLeft: true, ...initialProps }
  const wrapper = mockWithProviders(<ImageSupervised {...props} />, [
    themeProvider(),
    rootContextProvider(contextProps),
  ])
  return { props, wrapper }
}

describe('<ImageSupervised />', () => {
  it('should render supervised image with a value', () => {
    const subdomainConfig = {
      supervisedImage: 'urlImageSupervised',
    }
    const { wrapper } = setup(null, { subdomainConfig })
    expect(wrapper.getByRole('img').src).toContain(
      subdomainConfig.supervisedImage
    )
  })

  it('should render supervised image without value', () => {
    const { wrapper } = setup()
    const DIV_EXPECTED = 1
    const divHTML = wrapper.container.querySelectorAll('div')

    expect(divHTML).toHaveLength(DIV_EXPECTED)
    expect(wrapper.getByRole('img').src).toBeFalsy()
  })
})
