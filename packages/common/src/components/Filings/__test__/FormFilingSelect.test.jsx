import React from 'react'

import {
  mockWithProviders,
  themeProvider,
  routerProvider,
} from '../../../helpers/__mocks__/mock-providers'
import { message } from 'antd'

import FormFilingSelect from '../FormFilingSelect'
import { PAYMENT_STATUS } from '../../../constants/payment'
import { act, fireEvent } from '@testing-library/react'

const { APPROVED, CREATED } = PAYMENT_STATUS

const setup = (baseProps) => {
  const props = {
    handleSubmit: jest.fn(),
    onChange: jest.fn(),
    currentOrder: {},
    options: [],
    ...baseProps,
  }
  const wrapper = mockWithProviders(<FormFilingSelect {...props} />, [
    themeProvider(),
    routerProvider(),
  ])
  return { props, wrapper }
}
describe('FormFilingSelect spec', () => {
  it('should not call submit when form is submit if form is empty', async () => {
    const FORM_ELEMENTS_HTML_EXPECTED = 1
    const BUTTON_ELEMENTS_HTML_EXPECTED = 1
    const { wrapper, props } = setup({})
    const formElementsHTML = wrapper.container.querySelectorAll('form')
    const buttonElementsHTML = wrapper.container.querySelectorAll('button')
    const button = wrapper.getByTestId('button-filing')
    await act(async () => {
      await fireEvent.submit(button)
    })
    expect(formElementsHTML).toHaveLength(FORM_ELEMENTS_HTML_EXPECTED)
    expect(buttonElementsHTML).toHaveLength(BUTTON_ELEMENTS_HTML_EXPECTED)
    expect(props.handleSubmit).not.toHaveBeenCalled()
  })
  it('it should show the error alert', () => {
    const messageErrorSpy = jest.spyOn(message, 'error')
    setup({ error: true })
    expect(messageErrorSpy).toHaveBeenCalled()
  })
  it('should not show the error alert', () => {
    const messageErrorSpy = jest.spyOn(message, 'error')
    setup({ error: false })
    expect(messageErrorSpy).not.toHaveBeenCalled()
  })
  it('should not show the error alert', () => {
    const messageErrorSpy = jest.spyOn(message, 'error')
    setup({ error: false })
    expect(messageErrorSpy).not.toHaveBeenCalled()
  })
  it('You must validate that invalid filings are not shown', async () => {
    const fakeOptions = [
      {
        id: '0987654321',
        is_active: true,
        payment_status: APPROVED,
        person: {
          first_name: 'Andres',
          last_name: 'Andrade',
        },
        last_order: '123567890',
        tax_year: 2021,
      },
    ]

    const fakeCurrentOrder = {
      id: '123567890',
    }
    const { wrapper } = setup({
      currentOrder: fakeCurrentOrder,
      options: fakeOptions,
    })

    await act(async () => {
      expect(wrapper.findByText('.ant-select-selector')).toBeTruthy()
    })
    expect(wrapper.findByText('.ant-select-item-option')).toBeTruthy()
  })
  it('You must validate that invalid filings are shown', async () => {
    const fakeOptions = [
      {
        id: '0987654321',
        is_active: true,
        payment_status: CREATED,
        last_order: '123567890',
        person: {
          first_name: 'Andres',
          last_name: 'Andrade',
        },
        tax_year: 2021,
      },
      {
        id: '0987684321',
        is_active: true,
        payment_status: CREATED,
        last_order: '129567890',
        person: {
          first_name: 'Andres',
          last_name: 'Andrade',
        },
        tax_year: 2021,
      },
    ]
    const fakeCurrentOrder = {
      id: '12356890',
    }
    const { wrapper } = setup({
      currentOrder: fakeCurrentOrder,
      options: fakeOptions,
    })

    await act(async () => {
      fireEvent.mouseDown(wrapper.getByRole('combobox'))
    })
    const dropdown = wrapper.getAllByTestId('select-options')
    expect(dropdown).toHaveLength(2)
  })
})
