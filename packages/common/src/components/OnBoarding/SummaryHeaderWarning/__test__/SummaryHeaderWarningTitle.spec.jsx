import React from 'react'

import {
  mockWithProviders,
  themeProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import SummaryHeaderWarningTitle from '../SummaryHeaderWarningTitle'

const setup = (initialProps = {}) => {
  const props = {
    ...initialProps,
  }
  const wrapper = mockWithProviders(<SummaryHeaderWarningTitle {...props} />, [
    themeProvider(),
  ])

  return { props, wrapper }
}

describe('<SummaryHeaderWarningTitle /> specs', () => {
  it('should show title', () => {
    const TITLE = 'testing title'
    const { wrapper } = setup({
      title: TITLE,
    })
    const title = wrapper.getByText(TITLE)
    expect(title).toBeInTheDocument()
  })

  it('should show `errorHtml` when `showError` is true', () => {
    const TITLE = 'testing title'
    const ERROR_HTML = 'testing html <b>error</b>'
    const { wrapper } = setup({
      title: TITLE,
      errorHtml: ERROR_HTML,
      showError: true,
    })

    const error = wrapper.queryByText('testing html')
    expect(error).toBeInTheDocument()
    expect(error.textContent).toBe('testing html error')
  })

  it('should hide `errorHtml` when `showError` is false', () => {
    const TITLE = 'testing title'
    const ERROR_HTML = 'testing html <b>error</b>'
    const { wrapper } = setup({
      title: TITLE,
      errorHtml: ERROR_HTML,
      showError: false,
    })

    const error = wrapper.queryByText('testing html')
    expect(error).not.toBeInTheDocument()
  })
})
