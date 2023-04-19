import React from 'react'
import { act, fireEvent } from '@testing-library/react'

import {
  mockWithProviders,
  themeProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import { AFFIRMATIVE, NEGATIVE } from '../../../../constants/strings'
import SummaryHeaderWarning from '../SummaryHeaderWarning'

jest.mock('../SummaryHeaderWarningTitle', () => ({
  __esModule: true,
  default: ({ title, errorHtml }) => <div data-title={title}>{errorHtml}</div>,
}))

jest.mock('../SummaryHeaderWarningItem', () => ({
  __esModule: true,
  default: ({ code, isIgnored, onIgnoreError }) => (
    <div data-testid={`warning-item-${code}`}>
      <span data-testid="test-label">
        {code} {isIgnored ? 'ignored' : 'not ignored'}
      </span>
      <button onClick={() => onIgnoreError(code, !isIgnored)}>
        Do the thing
      </button>
    </div>
  ),
}))

const setup = async (initialProps = {}) => {
  const props = {
    getMultipleAnswers: jest.fn().mockResolvedValue([]),
    ignoreEngineErrorWithInput: jest.fn(),
    ...initialProps,
  }

  let wrapper

  await act(async () => {
    wrapper = mockWithProviders(<SummaryHeaderWarning {...props} />, [
      themeProvider(),
    ])
  })

  return { props, wrapper }
}

const filingFactory = (errorCode, errorHtml) => ({
  id: 'test-filing-id',
  last_engine_status_code: errorCode?.toString(),
  last_engine_status_message: errorHtml,
})

describe('<SummaryHeaderWarning /> specs', () => {
  const TEST_DATE = '2022-12-01T11:59Z'

  it('should render empty if there is no error', async () => {
    const FILING = filingFactory(null, '')
    const { wrapper } = await setup({
      filing: FILING,
      taxEngineCreationDate: TEST_DATE,
      config: [],
    })

    const header = wrapper.getByTestId('summary-header-warning')
    expect(header.children).toHaveLength(0)
  })

  it('should render only title if there is a non-ignorable error', async () => {
    const ERROR_TITLE = 'non ignorable error'
    const FILING = filingFactory(99, ERROR_TITLE)
    const { wrapper } = await setup({
      filing: FILING,
      taxEngineCreationDate: TEST_DATE,
      config: [],
    })

    const header = wrapper.getByTestId('summary-header-warning')
    const title = wrapper.getByText(ERROR_TITLE)
    expect(header.children).toHaveLength(1)
    expect(title.parentElement).toBe(header)
  })

  it('should render title for non-ignorable error and one ignorable error item', async () => {
    const INPUT_CODE = '1.1.0'
    const ERROR_CODE = 9
    const ERROR_HTML = 'error title'
    const FILING = filingFactory(ERROR_CODE, ERROR_HTML)
    const CONFIG = [
      {
        code: INPUT_CODE,
        label: '1.1.0 label',
        errorCodes: [100],
      },
    ]

    const mockGetMultipleAnswers = jest.fn().mockResolvedValue([
      {
        code: INPUT_CODE,
        value: AFFIRMATIVE,
      },
    ])

    const { wrapper } = await setup({
      taxEngineCreationDate: TEST_DATE,
      filing: FILING,
      config: CONFIG,
      getMultipleAnswers: mockGetMultipleAnswers,
    })

    const header = wrapper.getByTestId('summary-header-warning')
    expect(header.children).toHaveLength(2)

    const title = header.children[0]
    expect(title.getAttribute('data-title')).toBe(
      'Encontramos un error en la declaración (11:59am 01/12/2022)'
    )
    expect(title.textContent).toBe(ERROR_HTML)

    const ignorableError = header.children[1]
    expect(ignorableError.getAttribute('data-testid')).toBe(
      `warning-item-${INPUT_CODE}`
    )
  })

  it('should call `getMultipleAnswers` and render all ignorable inputs from config', async () => {
    const ERROR_CODE = 1
    const FILING = filingFactory(ERROR_CODE, 'ignorable error')
    const CONFIG = [
      {
        code: '1.1.0',
        errorCodes: [ERROR_CODE],
        label: 'code 1.1.0',
      },
      {
        code: '1.2.0',
        errorCodes: [2],
        label: 'code 1.2.0',
      },
    ]

    const { wrapper, props } = await setup({
      filing: FILING,
      taxEngineCreationDate: TEST_DATE,
      config: CONFIG,
    })

    const header = wrapper.getByTestId('summary-header-warning')
    expect(props.getMultipleAnswers).toHaveBeenCalledWith(
      ['1.1.0', '1.2.0'],
      FILING.id
    )
    expect(header.children).toHaveLength(2)
    expect(wrapper.getByTestId('warning-item-1.1.0')).toBeInTheDocument()
    expect(wrapper.getByTestId('warning-item-1.2.0')).toBeInTheDocument()
  })

  it('should render an ignorable error', async () => {
    const INPUT_CODE = '1.1.0'
    const ERROR_CODE = 5
    const FILING = filingFactory(ERROR_CODE, 'error')
    const CONFIG = [
      {
        code: INPUT_CODE,
        label: '1.1.0 label',
        errorCodes: [ERROR_CODE],
      },
    ]
    const mockGetMultipleAnswers = jest.fn().mockResolvedValue([
      {
        code: INPUT_CODE,
        value: NEGATIVE,
      },
    ])

    const { wrapper } = await setup({
      filing: FILING,
      taxEngineCreationDate: TEST_DATE,
      config: CONFIG,
      getMultipleAnswers: mockGetMultipleAnswers,
    })

    const ignorableError = wrapper.getByTestId('warning-item-1.1.0')
    const ignorableErrorLabel = wrapper.getByTestId('test-label')
    expect(mockGetMultipleAnswers).toHaveBeenCalled()
    expect(ignorableError).toBeInTheDocument()
    expect(ignorableErrorLabel.textContent).toContain('1.1.0 not ignored')
  })

  it('should render an ignored error', async () => {
    const INPUT_CODE = '1.1.0'
    const FILING = filingFactory(1, 'error')
    const CONFIG = [
      {
        code: INPUT_CODE,
        label: '1.1.0 label',
        errorCodes: [],
      },
    ]
    const mockGetMultipleAnswers = jest.fn().mockResolvedValue([
      {
        code: INPUT_CODE,
        value: AFFIRMATIVE,
      },
    ])

    const { wrapper } = await setup({
      filing: FILING,
      taxEngineCreationDate: TEST_DATE,
      config: CONFIG,
      getMultipleAnswers: mockGetMultipleAnswers,
    })

    const ignoredError = wrapper.getByTestId('warning-item-1.1.0')
    const ignoredErrorLabel = wrapper.getByTestId('test-label')
    expect(mockGetMultipleAnswers).toHaveBeenCalled()
    expect(ignoredError).toBeInTheDocument()
    expect(ignoredErrorLabel.textContent).toBe('1.1.0 ignored')
  })

  it('should render multiple ignored errors', async () => {
    const INPUT_CODE_1 = '1.1.0'
    const INPUT_CODE_2 = '1.2.0'
    const FILING = filingFactory(1, 'error')
    const CONFIG = [
      {
        code: INPUT_CODE_1,
        label: '1.1.0 label',
        errorCodes: [],
      },
      {
        code: INPUT_CODE_2,
        label: '1.2.0 label',
        errorCodes: [],
      },
    ]

    const mockGetMultipleAnswers = jest.fn().mockResolvedValue([
      {
        code: INPUT_CODE_1,
        value: AFFIRMATIVE,
      },
      {
        code: INPUT_CODE_2,
        value: AFFIRMATIVE,
      },
    ])

    const { wrapper } = await setup({
      filing: FILING,
      taxEngineCreationDate: TEST_DATE,
      config: CONFIG,
      getMultipleAnswers: mockGetMultipleAnswers,
    })

    expect(mockGetMultipleAnswers).toHaveBeenCalled()

    CONFIG.forEach(({ code }) => {
      const ignoredError = wrapper.getByTestId(`warning-item-${code}`)
      const ignoredErrorLabel = ignoredError.querySelector(
        '[data-testid="test-label"]'
      )
      expect(ignoredError).toBeInTheDocument()
      expect(ignoredErrorLabel.textContent).toBe(`${code} ignored`)
    })
  })

  it('should render one not ignored error and one ignored error', async () => {
    const INPUT_CODE_1 = '1.1.0'
    const INPUT_CODE_2 = '1.2.0'
    const FILING = filingFactory(1, 'error')
    const CONFIG = [
      {
        code: INPUT_CODE_1,
        label: '1.1.0 label',
        errorCodes: [],
      },
      {
        code: INPUT_CODE_2,
        label: '1.2.0 label',
        errorCodes: [],
      },
    ]

    const mockGetMultipleAnswers = jest.fn().mockResolvedValue([
      {
        code: INPUT_CODE_1,
        value: AFFIRMATIVE,
      },
      {
        code: INPUT_CODE_2,
        value: NEGATIVE,
      },
    ])

    const { wrapper } = await setup({
      filing: FILING,
      taxEngineCreationDate: TEST_DATE,
      config: CONFIG,
      getMultipleAnswers: mockGetMultipleAnswers,
    })

    expect(mockGetMultipleAnswers).toHaveBeenCalled()

    const ignoredError = wrapper.getByTestId('warning-item-1.1.0')
    const ignoredErrorLabel = ignoredError.querySelector(
      '[data-testid="test-label"]'
    )
    expect(ignoredError).toBeInTheDocument()
    expect(ignoredErrorLabel.textContent).toBe('1.1.0 ignored')

    const notIgnoredError = wrapper.getByTestId('warning-item-1.2.0')
    const notIgnoredErrorLabel = notIgnoredError.querySelector(
      '[data-testid="test-label"]'
    )
    expect(notIgnoredError).toBeInTheDocument()
    expect(notIgnoredErrorLabel.textContent).toBe('1.2.0 not ignored')
  })

  it('should call `ignoreEngineErrorWithInput` when ignore an error', async () => {
    const INPUT_CODE = '1.1.0'
    const FILING = filingFactory(1, 'error')
    const CONFIG = [
      {
        code: INPUT_CODE,
        label: '1.1.0 label',
        errorCodes: [],
      },
    ]

    const { wrapper, props } = await setup({
      filing: FILING,
      taxEngineCreationDate: TEST_DATE,
      config: CONFIG,
    })

    const notIgnoredError = wrapper.getByTestId('warning-item-1.1.0')
    const ignoreButton = notIgnoredError.querySelector('button')
    expect(notIgnoredError).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(ignoreButton)
    })

    expect(props.ignoreEngineErrorWithInput).toHaveBeenCalledWith(
      FILING.id,
      INPUT_CODE,
      true
    )
  })

  it('should call `ignoreEngineErrorWithInput` when un-ignore an error', async () => {
    const INPUT_CODE = '1.1.0'
    const FILING = filingFactory(1, 'error')
    const CONFIG = [
      {
        code: INPUT_CODE,
        label: '1.1.0 label',
        errorCodes: [],
      },
    ]

    const mockGetMultipleAnswers = jest.fn().mockResolvedValue([
      {
        code: INPUT_CODE,
        value: AFFIRMATIVE,
      },
    ])

    const { wrapper, props } = await setup({
      filing: FILING,
      taxEngineCreationDate: TEST_DATE,
      config: CONFIG,
      getMultipleAnswers: mockGetMultipleAnswers,
    })

    const ignoredError = wrapper.getByTestId('warning-item-1.1.0')
    const ignoreButton = ignoredError.querySelector('button')
    expect(ignoredError).toBeInTheDocument()

    await act(async () => {
      fireEvent.click(ignoreButton)
    })

    expect(props.ignoreEngineErrorWithInput).toHaveBeenCalledWith(
      FILING.id,
      INPUT_CODE,
      false
    )
  })
})
