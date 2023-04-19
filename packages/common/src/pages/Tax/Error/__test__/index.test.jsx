import React from 'react'
import {
  mockWithProviders,
  themeProvider,
  routerProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import TaxPaymentError from '../content'
import { PAYMENT_STATUS } from '../../../../constants/payment'
import { fireEvent, act } from '@testing-library/react'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const setup = (newProps = {}) => {
  const props = {
    getStatus_payment: jest.fn(),
    PaymentCancel: jest.fn(),
    createPaymentOrder: jest.fn(),
    payment_order: {
      coupon_code: null,
      status: PAYMENT_STATUS.CREATED,
      order_info: null,
    },
    ...newProps,
  }
  const wrapper = mockWithProviders(<TaxPaymentError {...props} />, [
    themeProvider(),
    routerProvider(),
  ])
  const { rerender } = wrapper
  return { wrapper, props, rerender }
}
describe('Component for error in the pay', () => {
  it('Should validate the structure of the component', () => {
    const { wrapper } = setup()
    const DIV_ELEMENTS_HTML_EXPECTED = 9
    const divElmentsHTML = wrapper.container.querySelectorAll('div')
    const divById = wrapper.getByTestId('card-body')
    const h3ElementsHTML = wrapper.getByText('¡Tu pago no ha sido exitoso!')
    expect(divElmentsHTML).toHaveLength(DIV_ELEMENTS_HTML_EXPECTED)
    expect(h3ElementsHTML).toBeTruthy()
    expect(divById).toBeTruthy()
  })
  it('Should call PaymentCancel, when the user want try new payment', async () => {
    const { wrapper, props } = setup()
    const BUTTON_ELEMENTS_EXPECTED = 2
    const buttonElements = wrapper.container.querySelectorAll('button')
    expect(buttonElements).toHaveLength(BUTTON_ELEMENTS_EXPECTED)
    const button = wrapper.getByTestId('payment')
    await act(async () => {
      await fireEvent.click(button)
    })
    expect(props.PaymentCancel).toHaveBeenCalled()
  })

  it('Validate that the cancel button redirect to payment service', async () => {
    const { wrapper } = setup()
    const button = wrapper.getByTestId('go-back')
    await act(async () => {
      await fireEvent.click(button)
    })

    expect(mockNavigate).toBeCalledWith('/services/payment')
  })
})
