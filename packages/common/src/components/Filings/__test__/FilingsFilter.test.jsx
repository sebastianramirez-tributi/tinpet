import React from 'react'
import FilingsFilter from '../FilingsFilter'
import {
  mockWithProviders,
  themeProvider,
} from '../../../helpers/__mocks__/mock-providers'

jest.mock('../../../helpers/hooks', () => ({
  useConfig: jest
    .fn()
    .mockReturnValue({ denyAddPersons: false, MAX_TAX_YEAR: 2020 }),
}))
const setup = (baseProps) => {
  const props = {
    onChange: jest.fn(),
    ...baseProps,
  }
  const wrapper = mockWithProviders(<FilingsFilter {...props} />, [
    themeProvider(),
  ])
  const { rerender } = wrapper
  return { props, wrapper, rerender }
}

describe('FilingsFilter spec', () => {
  const DIV_ELEMENTS_HTML_EXPECTED = 2

  it('should call onChange when select an option', () => {
    const { wrapper } = setup()
    const divElementsHtml = wrapper.container.querySelectorAll('div')
    expect(divElementsHtml).toHaveLength(DIV_ELEMENTS_HTML_EXPECTED)
    expect(wrapper.getAllByTestId('filing-filter')).toHaveLength(1)
  })

  it('should render component correctly', () => {
    const SPAN_ELEMENTS_EXPECT_HTML = 4
    const { wrapper } = setup()
    const spanElementsHTML = wrapper.container.querySelectorAll('span')
    expect(wrapper.getByText('2020')).toBeInTheDocument()
    expect(spanElementsHTML).toHaveLength(SPAN_ELEMENTS_EXPECT_HTML)
    expect(spanElementsHTML[1].getAttribute('title')).toEqual('2020')
  })

  it('should render filing', () => {
    const INPUT_TEXT_EXPECTED = 1
    const { wrapper } = setup()
    const svgElementsHTML = wrapper.container.querySelector('svg')
    const textInputs = wrapper.getAllByRole('combobox')
    expect(textInputs).toHaveLength(INPUT_TEXT_EXPECTED)
    expect(svgElementsHTML.getAttribute('aria-hidden')).toEqual('true')
  })
})
