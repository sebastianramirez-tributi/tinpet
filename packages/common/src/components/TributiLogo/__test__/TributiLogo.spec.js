import React from 'react'
import {
  mockWithProviders,
  rootContextProvider,
  themeProvider,
} from '../../../helpers/__mocks__/mock-providers'
import TributiLogo from '..'

const setup = (initialProps) => {
  const props = {
    card: true,
    ...initialProps,
  }
  const wrapper = mockWithProviders(<TributiLogo {...props} />, [
    themeProvider(),
    rootContextProvider(),
  ])
  return { props, wrapper }
}

describe('<TributiLogo/>', () => {
  it('should render with default props logo alone', () => {
    const { wrapper } = setup()
    const EXPECTED_IMG = 1
    const expectedLogoUrl =
      'https://' + process.env.CDN_BASE_URL + '/img/customer/logo-tributi.svg'
    expect(wrapper.getAllByRole('img')).toHaveLength(EXPECTED_IMG)
    expect(wrapper.getByAltText('Logo Tributi')).toHaveProperty(
      'src',
      expectedLogoUrl
    )
  })
  it('should render two images when cobrandingImage is provided', () => {
    const DATA = {
      cobrandingImage: 'urlImage',
      cobrandingKey: 'app',
    }
    const { wrapper } = setup(DATA)
    const EXPECTED_IMG = 2
    expect(wrapper.getAllByRole('img')).toHaveLength(EXPECTED_IMG)
    const cobrandingImg = wrapper.getByAltText(`Logo ${DATA.cobrandingKey}`)
    expect(cobrandingImg).toBeInTheDocument()
    expect(cobrandingImg.src).toContain(DATA.cobrandingImage)
  })
})
