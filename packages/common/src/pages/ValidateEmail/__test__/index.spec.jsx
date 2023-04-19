import { act, fireEvent } from '@testing-library/react'
import React from 'react'

import {
  mockWithProviders,
  reduxProvider,
  routerProvider,
  themeProvider,
} from '../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'
import { requestEmailValidation } from '../../../redux/auth/actions'
import ValidateEmail from '../content'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

jest.mock('../../../redux/auth/actions', () => ({
  ...jest.requireActual('../../../redux/auth/actions'),
  requestEmailValidation: jest.fn(),
}))

jest.mock('antd/lib/modal', () => ({
  __esModule: true,
  default: ({ visible }) => (visible ? <div data-testid="modal" /> : null),
}))

const setup = (personalInfo = {}) => {
  const store = overwriteStore({
    personalInfo: {
      id: 'person-id-mock',
      email: 'person@email.com',
      is_validate_email: false,
      ...personalInfo,
    },
  })

  const wrapper = mockWithProviders(<ValidateEmail />, [
    themeProvider(),
    reduxProvider(store),
    routerProvider(),
  ])

  return { wrapper }
}

describe('<ValidateEmail /> spec', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    global.localStorage.clear()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should show user email', () => {
    const EMAIL = 'mock-person@email.com'
    const { wrapper } = setup({ email: EMAIL })

    const emailElement = wrapper.getByTestId('validate-email-address')
    expect(emailElement.textContent).toBe(EMAIL)
  })

  it('should show `Gmail` button if email address ends with `@gmail.com`', () => {
    const EMAIL = 'mock@gmail.com'
    const { wrapper } = setup({ email: EMAIL })
    const emailButton = wrapper.getByTestId('validate-email-gmail-button')
    expect(emailButton).not.toBeNull()
  })

  it('should hide `Gmail` button if email address does not ends with `@gmail.com`', async () => {
    const EMAIL = 'mock@not-gmail.com'
    const { wrapper } = setup({ email: EMAIL })
    const emailButton = await wrapper.queryByTestId(
      'validate-email-gmail-button'
    )
    expect(emailButton).toBeNull()
  })

  it('should navigate to `/filings` if email is already validated', () => {
    setup({ is_validate_email: true })
    expect(mockNavigate).toHaveBeenCalledWith('/filings')
  })

  it('should open `edit email` modal when click on `wrong email` button', async () => {
    const { wrapper } = setup()

    expect(wrapper.queryByTestId('modal')).toBeNull()
    const changeEmail = wrapper.getByTestId('validate-email-wrong-address')
    await act(async () => {
      fireEvent.click(changeEmail)
    })

    expect(wrapper.queryByTestId('modal')).not.toBeNull()
  })

  it('should call `requestEmailValidation`, change label and disable `resend email` button on click', () => {
    const { wrapper } = setup()
    const resendButton = wrapper.getByTestId('validate-email-resend')
    act(() => {
      fireEvent.click(resendButton)
    })
    expect(requestEmailValidation).toHaveBeenCalled()
    expect(resendButton.textContent).toBe('Reenviar en 2:00')
    expect(resendButton).toHaveAttribute('disabled')
  })

  it('should show correct time after a span of time', () => {
    const { wrapper } = setup()
    const resendButton = wrapper.getByTestId('validate-email-resend')

    act(() => {
      fireEvent.click(resendButton)
    })
    expect(resendButton.textContent).toBe('Reenviar en 2:00')
    act(() => {
      jest.advanceTimersByTime(5 * 1000)
    })

    expect(resendButton.textContent).toBe('Reenviar en 1:55')
  })

  it('should show timer if already is defined on localstorage', () => {
    const PERSON_ID = 'testing-id'
    // Now plus 1 minute
    const nextTimer = Date.now() + 60 * 1000
    global.localStorage.setItem(
      `validate-email-timeout:${PERSON_ID}`,
      nextTimer
    )

    const { wrapper } = setup({ id: PERSON_ID })
    const resendButton = wrapper.getByTestId('validate-email-resend')

    expect(resendButton.textContent).toBe('Reenviar en 1:00')
  })

  it('should navigate to `/` when `validate-email` broadcast event is received', () => {
    const events = []
    global.BroadcastChannel = function () {
      ;(this.addEventListener = (_name, callback) => events.push(callback)),
        (this.removeEventListener = jest.fn())
    }

    setup()
    expect(mockNavigate).not.toHaveBeenCalled()

    act(() => {
      events.forEach((event) => event({ data: true }))
    })

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
