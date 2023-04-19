import React from 'react'
import { fireEvent, act } from '@testing-library/react'
import {
  mockWithProviders,
  themeProvider,
  reduxProvider,
  routerProvider,
} from '../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'
import { PAYMENT_STATUS } from '../../../constants/payment'
import TaxPaymentList from '../content'

const setup = (newProps = {}) => {
  const props = {
    taxReceiveInfo: jest.fn(),
    createPaymentOrder: jest.fn(),
    ...newProps,
  }

  const store = overwriteStore({
    personalInfo: {
      first_name: 'Testing user',
    },
  })
  const wrapper = mockWithProviders(<TaxPaymentList {...props} />, [
    themeProvider(),
    reduxProvider(store),
    routerProvider(),
  ])
  return { props, wrapper }
}

describe('Component for the list of services by user', () => {
  it('Should find title and description text of the component', () => {
    const { wrapper } = setup()
    const DESCRIPTION_TEST_EXPECTED =
      'Testing user, no encontramos la orden de tu pago a Tributi para tus servicios. Parece que esta todavía no ha sido creada. Si crees que debería estar disponible, por favor avísanos al correo francisco@tributi.com o a nuestro chat.'

    const paragraph = wrapper.container.querySelector('p')

    expect(wrapper.getByText('No encontramos tu orden de pago')).toBeTruthy()
    expect(paragraph.textContent).toContain(DESCRIPTION_TEST_EXPECTED)
  })
  it('Should call to taxReceiveInfo, when component is rendered', () => {
    const { props } = setup()
    expect(props.taxReceiveInfo).toBeCalled()
  })

  it('Should call to createPaymentOrder, when the user want create de new order or look the payment detail', async () => {
    const { wrapper, props } = setup({
      taxInfo: [
        {
          id: 'testing-id',
          status: PAYMENT_STATUS.APPROVED,
          product: {
            name: 'Product name',
          },
        },
      ],
    })
    const button = wrapper.getByRole('button')

    await act(async () => {
      await fireEvent.click(button)
    })

    expect(props.createPaymentOrder).toBeCalled()
  })
})
