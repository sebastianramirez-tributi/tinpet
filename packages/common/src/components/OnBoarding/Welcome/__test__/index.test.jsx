import React from 'react'

import {
  mockWithProviders,
  reduxProvider,
  routerProvider,
  themeProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import Welcome from '../index'
import { overwriteStore } from '../../../../helpers/__mocks__/mock-reducer'
import { ROLES } from '../../../../constants/person'

jest.mock('../../../../redux/personalInfo/actions')

const setup = (personalInfo = {}, initialProps = {}) => {
  const props = {
    letsStart: jest.fn(),
    ...initialProps,
  }

  const store = overwriteStore({
    personalInfo,
  })

  const wrapper = mockWithProviders(<Welcome {...props} />, [
    reduxProvider(store),
    routerProvider(),
    themeProvider(),
  ])

  return { props, wrapper }
}

describe('<Welcome /> spec', () => {
  it('should render regular welcome if user is not `tax_filer`', () => {
    const FILING_ID = 'testing-filing-id'
    const { wrapper } = setup({
      role: ROLES.ASSISTANT,
      currentFiling: {
        id: FILING_ID,
      },
    })
    expect(wrapper.findByText('RegularPlan')).toBeTruthy()
  })
  it('should render regular welcome if user is `tax_filer` but `scheduling` is not defined', () => {
    const FILING_ID = 'testing-filing-id'
    const { wrapper } = setup({
      role: ROLES.TAX_FILER,
      currentFiling: {
        id: FILING_ID,
        scheduling: undefined,
      },
    })
    expect(wrapper.findByText('RegularPlan')).toBeTruthy()
  })
  it('should render regular welcome if user is `tax_filer` and `scheduling` is defined but `product_plan.is_assisted` is false', () => {
    const FILING_ID = 'testing-filing-id'
    const DIV_ELEMENTS_HTML_EXPECTED = 7
    const { wrapper } = setup({
      role: ROLES.TAX_FILER,
      currentFiling: {
        id: FILING_ID,
        product_plan: {
          is_assisted: false,
        },
        scheduling: {
          meeting_url: 'testing-url',
          scheduled_at: '2022-01-01T00:00:00Z',
        },
      },
    })
    const divElementsHTML = wrapper.container.querySelectorAll('div')
    expect(divElementsHTML).toHaveLength(DIV_ELEMENTS_HTML_EXPECTED)
    expect(wrapper.findByText('RegularPlan')).toBeTruthy()
  })
  it('should render assisted welcome if user is `tax_filer`, `product_plan.is_assisted` is True and `scheduling` is defined', () => {
    const FILING_ID = 'testing-filing-id'
    const DIV_ELEMENTS_HTML_EXPECTED = 7
    const H3_ELEMENTS_HTML_EXPECTED = 1
    const { wrapper } = setup({
      role: ROLES.TAX_FILER,
      currentFiling: {
        id: FILING_ID,
        product_plan: {
          is_assisted: true,
        },
        scheduling: {
          meeting_url: 'testing-url',
          scheduled_at: '2022-01-01T00:00:00Z',
        },
      },
    })
    const divElementsHTML = wrapper.container.querySelectorAll('div')
    const h3ElementsHTML = wrapper.container.querySelectorAll('h3')
    expect(divElementsHTML).toHaveLength(DIV_ELEMENTS_HTML_EXPECTED)
    expect(h3ElementsHTML).toHaveLength(H3_ELEMENTS_HTML_EXPECTED)
    expect(wrapper.findByText('AssistedPlan')).toBeTruthy()
  })
})
