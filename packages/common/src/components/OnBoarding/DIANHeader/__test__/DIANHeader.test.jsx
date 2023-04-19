import React from 'react'
import Header from '..'

import {
  mockWithProviders,
  themeProvider,
  rootContextProvider,
} from '../../../../helpers/__mocks__/mock-providers'

const setup = (baseProps) => {
  const props = {
    iconsPath: '/icons/',
    ...baseProps,
  }
  const wrapper = mockWithProviders(<Header {...props} />, [
    themeProvider(),
    rootContextProvider(),
  ])
  const { rerender } = wrapper
  return { props, wrapper, rerender }
}
describe('<Header /> Dian', () => {
  it('Should render properly with default props', () => {
    const { wrapper } = setup()
    expect(wrapper.getByTestId('dian-header')).toBeTruthy()
    expect(wrapper.getByTestId('section-title').textContent).toContain(
      'Conecta tu cuenta de la DIAN'
    )
  })
})
