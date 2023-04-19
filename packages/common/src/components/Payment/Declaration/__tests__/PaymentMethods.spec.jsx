import React from 'react'
import { fireEvent, act } from '@testing-library/react'

import {
  mockWithProviders,
  themeProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import PaymentMethods from '../PaymentMethods'

const setup = (initialProps) => {
  const props = {
    howToPayOtherMethods: 'url',
    downloadPaymentReceipt: jest.fn(),
    fetchValidDate490: jest.fn(),
    isPaymentReceiptLoading: false,
    ...initialProps,
  }
  const wrapper = mockWithProviders(<PaymentMethods {...props} />, [
    themeProvider(),
  ])

  return { props, wrapper }
}

describe('<PaymentMethods /> specs', () => {
  it('should show default view', async () => {
    const { wrapper, props } = setup()

    const dropdown = wrapper.getByTestId('dropdown')

    await act(async () => {
      fireEvent.click(dropdown)
    })

    expect(wrapper.getByText('¿Cómo pagar con otros métodos?')).toBeTruthy()
    expect(wrapper.getByText('Descargar recibo de pago')).toBeTruthy()

    const howToPayButton = wrapper.getByRole('link')

    expect(howToPayButton.getAttribute('href')).toEqual(
      props.howToPayOtherMethods
    )

    const downloadButton = wrapper.getByRole('button')
    await act(async () => {
      fireEvent.click(downloadButton)
    })
    expect(props.fetchValidDate490).toHaveBeenCalled()
  })

  fit('should call `downloadPaymentReceipt` when click on popover OK', async () => {
    const { wrapper, props } = setup()
    const dropdown = wrapper.getByTestId('dropdown')
    const propsMock = {
      ...props,
      validDate490: '12/31/2022',
    }
    await act(async () => {
      fireEvent.click(dropdown)
    })

    const downloadButton = wrapper.getByRole('button')
    await act(async () => {
      fireEvent.click(downloadButton)
      wrapper.rerender(<PaymentMethods {...propsMock} />)
    })

    expect(props.fetchValidDate490).toHaveBeenCalled()
    expect(wrapper.getByTestId('download-popover')).toBeTruthy()
    expect(
      wrapper.getByText(
        'Ten en cuenta que este recibo de pago solo te sirve para hacer el pago hasta el'
      )
    ).toBeTruthy()

    expect(wrapper.getByText('31 de diciembre del 2022')).toBeTruthy()

    const popoverButton = wrapper.getAllByRole('button')[1]
    await act(async () => {
      fireEvent.click(popoverButton)
    })

    expect(props.downloadPaymentReceipt).toHaveBeenCalled()
  })
})
