import React from 'react'

import {
  mockWithProviders,
  themeProvider,
} from '../../../helpers/__mocks__/mock-providers'
import PlanGroup from '../PlanGroup'

const setup = (props = {}) => {
  const wrapper = mockWithProviders(<PlanGroup {...props} />, [themeProvider()])
  return { wrapper, props }
}

describe('PlanGroup specs', () => {
  it('should render children with property `removeCard` in false', () => {
    const children = <div data-testid="children">Test</div>
    const { wrapper } = setup({
      children,
      removeCard: false,
    })
    expect(wrapper.getByTestId('wrapper-false')).toBeTruthy()
    expect(wrapper.getByTestId('children')).toBeTruthy()
  })

  it('should render children with property `removeCard` in true', () => {
    const children = <div data-testid="children">Test</div>
    const { wrapper } = setup({
      children,
      removeCard: true,
    })
    expect(wrapper.getByTestId('wrapper-true')).toBeTruthy()
    expect(wrapper.getByTestId('children')).toBeTruthy()
  })
})
