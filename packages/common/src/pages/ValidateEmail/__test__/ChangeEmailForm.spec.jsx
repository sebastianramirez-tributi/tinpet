import React from 'react'
import { act, fireEvent, waitFor } from '@testing-library/react'

import {
  mockWithProviders,
  themeProvider,
} from '../../../helpers/__mocks__/mock-providers'
import ChangeEmailForm from '../ChangeEmailForm'

const setup = () => {
  const props = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
  }

  const wrapper = mockWithProviders(<ChangeEmailForm {...props} />, [
    themeProvider(),
  ])

  const getAlerts = () => wrapper.queryAllByRole('alert')

  return { wrapper, props, getAlerts }
}

describe('<ChangeEmailForm /> specs', () => {
  it('should show error when email inputs are not email-like', async () => {
    const { wrapper, getAlerts } = setup()
    const email = wrapper.getByPlaceholderText('Ingresar email')
    const confirm = wrapper.getByPlaceholderText('Confirmar email')

    await act(async () => {
      fireEvent.change(email, { target: { value: 'not email' } })
      fireEvent.blur(email)
      fireEvent.change(confirm, { target: { value: 'not email' } })
      fireEvent.blur(confirm)
    })

    await waitFor(() => expect(getAlerts()).toHaveLength(2))
    const alerts = getAlerts()
    expect(alerts[0].textContent).toBe(
      'Por favor ingresa un formato válido de email'
    )
    expect(alerts[1].textContent).toBe(
      'Por favor ingresa un formato válido de email'
    )
  })

  it('should show error on confirmEmail input when does not match with email input value', async () => {
    const { wrapper, getAlerts } = setup()
    const email = wrapper.getByPlaceholderText('Ingresar email')
    const confirm = wrapper.getByPlaceholderText('Confirmar email')

    await act(async () => {
      fireEvent.change(email, { target: { value: 'email@tributi.com' } })
      fireEvent.blur(email)
      fireEvent.change(confirm, {
        target: { value: 'another_email@tributi.com' },
      })
      fireEvent.blur(confirm)
    })

    await waitFor(() => expect(getAlerts()).toHaveLength(1))
    const alerts = getAlerts()
    expect(alerts[0].textContent).toBe(
      'Las direcciones de email que ingresaste no coinciden'
    )
  })

  it('should show error for required inputs when submit and inputs are empty', async () => {
    const { wrapper, getAlerts } = setup()
    const submit = wrapper.getByTestId('changeEmail-update-button')
    await act(async () => {
      fireEvent.click(submit)
    })
    await waitFor(() => expect(getAlerts()).toHaveLength(2))
    const alerts = getAlerts()
    expect(alerts[0].textContent).toBe('Este campo es obligatorio')
    expect(alerts[1].textContent).toBe('Este campo es obligatorio')
  })

  it('should call `onSubmit` when there is no form errors and click on update button', async () => {
    const EMAIL = 'test@tributi.com'
    const { wrapper, props } = setup()
    const email = wrapper.getByPlaceholderText('Ingresar email')
    const confirm = wrapper.getByPlaceholderText('Confirmar email')
    const submit = wrapper.getByTestId('changeEmail-update-button')

    await act(async () => {
      fireEvent.change(email, { target: { value: EMAIL } })
      fireEvent.blur(email)
      fireEvent.change(confirm, { target: { value: EMAIL } })
      fireEvent.blur(confirm)
      fireEvent.click(submit)
    })

    expect(props.onSubmit).toHaveBeenCalledWith({
      email: EMAIL,
      confirmEmail: EMAIL,
    })
  })

  it('should call `onCancel` when click on back button', async () => {
    const { wrapper, props } = setup()
    const back = wrapper.getByTestId('changeEmail-back-button')

    await act(async () => {
      fireEvent.click(back)
    })

    expect(props.onCancel).toHaveBeenCalled()
  })
})
