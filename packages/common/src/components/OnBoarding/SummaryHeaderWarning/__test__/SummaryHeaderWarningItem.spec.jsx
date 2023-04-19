import React from 'react'
import { act, fireEvent, waitFor } from '@testing-library/react'

import {
  mockWithProviders,
  themeProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import SummaryHeaderWarningItem from '../SummaryHeaderWarningItem'

const setup = (initialProps = {}) => {
  const props = {
    onIgnoreError: jest.fn(),
    ...initialProps,
  }
  const wrapper = mockWithProviders(<SummaryHeaderWarningItem {...props} />, [
    themeProvider(),
  ])

  return { props, wrapper }
}

describe('<SummaryHeaderWarningItem /> specs', () => {
  it('should not render children if there is no error', () => {
    const { wrapper } = setup({
      code: '1.9',
      engineErrorCode: 1,
      engineErrorHtml: 'error',
      errorCodes: [99],
      isIgnored: false,
      label: 'test label',
      taxEngineDate: 'test-date',
    })

    expect(wrapper.container).toBeEmptyDOMElement()
  })

  it('should render children if there is an error', () => {
    const ERROR_CODE = 1
    const { wrapper } = setup({
      code: '1.9',
      engineErrorCode: ERROR_CODE,
      engineErrorHtml: 'error',
      errorCodes: [ERROR_CODE],
      isIgnored: false,
      label: 'test label',
      taxEngineDate: 'test-date',
    })

    expect(wrapper.container).not.toBeEmptyDOMElement()
  })

  it('should show title with `taxEngineDate` on it when `isIgnored` is false', () => {
    const TEST_DATE = 'test-date'
    const { wrapper } = setup({
      code: '1.9',
      engineErrorCode: 1,
      engineErrorHtml: 'error',
      errorCodes: [1],
      isIgnored: false,
      label: 'test label',
      taxEngineDate: TEST_DATE,
    })

    const title = wrapper.getByText(
      `Encontramos un error en la declaración ${TEST_DATE}`
    )
    expect(title).toBeInTheDocument()
  })

  it('should show when `engineErrorCode` is included on `errorCodes` and `isIgnored` is false', () => {
    const CODE = 1
    const ERROR_CODES = [CODE, 2]
    const TEST_DATE = 'test-date'
    const ERROR_HTML = 'error html'
    const { wrapper } = setup({
      code: '1.0',
      engineErrorCode: CODE,
      engineErrorHtml: ERROR_HTML,
      errorCodes: ERROR_CODES,
      isIgnored: false,
      label: 'test',
      taxEngineDate: TEST_DATE,
    })

    const title = wrapper.getByText(
      `Encontramos un error en la declaración ${TEST_DATE}`
    )
    const error = wrapper.getByText(ERROR_HTML)
    expect(title).toBeInTheDocument()
    expect(error).toBeInTheDocument()
  })

  it('should show when `isIgnored` is true and `engineErrorCode` is not included on `errorCodes`', () => {
    const CODE = 1
    const ERROR_CODES = [99]
    const LABEL = 'testing label'
    const ERROR_HTML = 'error html'
    const { wrapper } = setup({
      code: '1.0',
      engineErrorCode: CODE,
      engineErrorHtml: ERROR_HTML,
      errorCodes: ERROR_CODES,
      isIgnored: true,
      label: LABEL,
      taxEngineDate: 'test-date',
    })

    const title = wrapper.getByText(`Previamente ignoraste tu ${LABEL}`)
    const error = wrapper.queryByText(ERROR_HTML)
    expect(title).toBeInTheDocument()
    expect(error).not.toBeInTheDocument()
  })

  it('should show ignoreButton with `label` value and "no" if `isIgnored` is true', () => {
    const LABEL = 'testing label'
    const { wrapper, props } = setup({
      code: '1.0',
      engineErrorCode: 1,
      engineErrorHtml: 'error',
      errorCodes: [1],
      isIgnored: false,
      label: LABEL,
      taxEngineDate: 'test-date',
    })

    const ignorableButton = wrapper.queryByText(`ignorar ${LABEL}`)
    expect(ignorableButton).toBeInTheDocument()

    wrapper.rerender(<SummaryHeaderWarningItem {...props} isIgnored />)

    const unIgnorableButton = wrapper.queryByText(`no ignorar ${LABEL}`)
    expect(unIgnorableButton).toBeInTheDocument()
  })

  it('should handle `onIgnoreError` with second parameter in false when `isIgnored` is true', async () => {
    const CODE = '1.0'
    const IGNORED = true
    const LABEL = 'testing label'
    const { wrapper, props } = setup({
      code: CODE,
      engineErrorCode: 1,
      engineErrorHtml: 'error',
      errorCodes: [1],
      isIgnored: IGNORED,
      label: LABEL,
      taxEngineDate: 'test-date',
    })

    await act(async () => {
      const button = wrapper.getByText(`no ignorar ${LABEL}`)
      fireEvent.click(button)
    })
    expect(props.onIgnoreError).toHaveBeenCalledWith(CODE, !IGNORED)
  })

  it('should handle `onIgnoreError` with second parameter in true when `isIgnored` is false', async () => {
    const CODE = '1.0'
    const IGNORED = false
    const LABEL = 'testing label'
    const { wrapper, props } = setup({
      code: CODE,
      engineErrorCode: 1,
      engineErrorHtml: 'error',
      errorCodes: [1],
      isIgnored: IGNORED,
      label: LABEL,
      taxEngineDate: 'test-date',
    })

    await act(async () => {
      const button = wrapper.getByText(`ignorar ${LABEL}`)
      fireEvent.click(button)
    })
    expect(props.onIgnoreError).toHaveBeenCalledWith(CODE, !IGNORED)
  })
})
