import React from 'react'
import { fireEvent, act, waitFor } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import {
  mockWithProviders,
  themeProvider,
  reduxProvider,
  routerProvider,
} from '../../../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../../../helpers/__mocks__/mock-reducer'
import TaxFilePayment from '../content'

window.open = jest.fn()
jest.mock('../../../../../redux/payment/actions')

const setup = async (baseProps, newStore) => {
  const props = {
    getTaxFilePayment: jest.fn(),
    downloadTaxFile: jest.fn(),
    hiddenPaymentModal: jest.fn(),
    ...baseProps,
  }
  const store = overwriteStore({
    ...newStore,
  })

  const wrapper = mockWithProviders(<TaxFilePayment {...props} />, [
    themeProvider(),
    reduxProvider(store),
    routerProvider(),
  ])

  return wrapper
}

describe('<TaxFilePayment />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render properly the payment screen', () => {
    setup({
      taxFile490: {
        pdfBase64: '',
        numerado: 1234,
        isCurrent490: true,
        payDate: '',
        attempt: 1,
      },
      taxDue: '100.000',
    })

    const p = screen.getByText(
      /Vamos a usar el formulario de pago correspondiente a tu declaración de renta presentada para realizar el pago en el portal de pagos PSE de la DIAN/i
    )
    const title = screen.getByText(/Formulario de pago:/i)
    const link = screen.getByRole('link', {
      name: 'Descargar formulario',
    })
    const select = screen.getByText(/Seleccionar un banco/i)
    const button = screen.getByRole('button', {
      name: 'Ir a pagar',
    })

    expect(p).toBeInTheDocument()
    expect(title).toBeInTheDocument()
    expect(link).toBeInTheDocument()
    expect(select).toBeInTheDocument()
    expect(button).toBeInTheDocument()
  })

  it('should redirect to the user to DIAN URL and show payment completed view', async () => {
    const user = userEvent.setup()

    const props = {
      taxFile490: {
        pdfBase64: '',
        numerado: 1234,
        isCurrent490: true,
        payDate: '',
        attempt: 4,
      },
      taxDue: '100.000',
      paymentBankList: [
        {
          id: 'x1',
          entity_name: 'BANCO 1',
          url: 'http://banco1.com',
        },
        {
          id: 'x2',
          entity_name: 'BANCO 2',
          url: 'http://banco2.com',
        },
      ],
    }

    await act(async () => {
      await waitFor(() => setup(props))
    })

    const select =
      screen.getByTestId('select-bank').firstElementChild.firstElementChild
        .firstElementChild
    await waitFor(() => fireEvent.mouseDown(select))

    const option = screen.getByTestId('x1').firstElementChild
    fireEvent.click(option, undefined, { skipPointerEventsCheck: true })

    const button = screen.getByRole('button', { name: 'Ir a pagar' })
    await waitFor(() => user.click(button))

    const p1 = screen.getByText('!Felicidades!')
    const p2 = screen.getByText(
      /Si ya terminaste de pagar en la DIAN entonces has terminado todo tu proceso de declaración de renta/i
    )
    const p3 = screen.getByText(
      /Si deseas puedes descargar tu recibo de pago en la DIAN/i
    )
    const link = screen.getByRole('link', {
      name: '¿Cómo descargar mi recibo de pago?',
    })
    const closeButton = screen.getByRole('button', { name: 'Cerrar' })

    expect(window.open).toHaveBeenCalledTimes(1)
    expect(p1).toBeInTheDocument()
    expect(p2).toBeInTheDocument()
    expect(p3).toBeInTheDocument()
    expect(link).toBeInTheDocument()
    expect(closeButton).toBeInTheDocument()
  })

  it('should redirect to the user to DIAN URL with param in URL', async () => {
    const user = userEvent.setup()

    const props = {
      taxFile490: {
        pdfBase64: '',
        numerado: 1234,
        isCurrent490: true,
        payDate: '',
        attempt: 4,
      },
      taxDue: '100.000',
      paymentBankList: [
        {
          id: 'x1',
          entity_name: 'BANCO 1',
          url: 'http://banco1.com?BANCO=xxx',
        },
        {
          id: 'x2',
          entity_name: 'BANCO 2',
          url: 'http://banco2.com',
        },
      ],
    }

    await act(async () => {
      await waitFor(() => setup(props))
    })

    const select =
      screen.getByTestId('select-bank').firstElementChild.firstElementChild
        .firstElementChild
    await waitFor(() => fireEvent.mouseDown(select))

    const option = screen.getByTestId('x1').firstElementChild
    fireEvent.click(option, undefined, { skipPointerEventsCheck: true })

    const button = screen.getByRole('button', { name: 'Ir a pagar' })
    await waitFor(() => user.click(button))

    expect(window.open).toHaveBeenCalledTimes(1)
  })

  it('should render progress status to generate tax file properly', async () => {
    const props = {
      taxFile490: {
        pdfBase64: '',
        numerado: 1234,
        isCurrent490: false,
        payDate: '',
        attempt: 2,
      },
      taxDue: '100.000',
    }

    await act(async () => {
      await setup(props)
    })

    const progressText = screen.getByText(
      /Estamos generando el formulario de pago/i
    )

    expect(progressText).toBeInTheDocument()
  })

  it('should try to generate tax file', async () => {
    const user = userEvent.setup()

    const props = {
      taxFile490: {
        pdfBase64: '',
        numerado: 1234,
        isCurrent490: true,
        payDate: '2022-09-09',
        attempt: 4,
      },
      taxDue: '100.000',
      getTaxFilePayment: jest.fn(),
    }

    await act(async () => {
      await waitFor(() => setup(props))
    })

    const button = screen.getByRole('button', { name: 'Ir a pagar' })
    await waitFor(() => user.click(button))

    expect(props.getTaxFilePayment).toHaveBeenCalled()
  })

  it('should call to download tax file', async () => {
    const user = userEvent.setup()

    const props = {
      taxFile490: {
        pdfBase64: '',
        numerado: 1234,
        isCurrent490: true,
        payDate: '2022-09-09',
        attempt: 4,
      },
      taxDue: '100.000',
      downloadTaxFile: jest.fn(),
    }

    await act(async () => {
      await waitFor(() => setup(props))
    })

    const link = screen.getByRole('link', { name: 'Descargar formulario' })
    await waitFor(() => user.click(link))

    expect(props.downloadTaxFile).toHaveBeenCalled()
  })

  it('should show error to get payment document', () => {
    setup()
    const title = screen.getByText(/Lo sentimos/i)
    const p1 = screen.getByText(/No fue posible generar el formulario de pago/i)
    const p2 = screen.getByText(
      /Se presentaron fallas técnicas con el formulario de la DIAN/i
    )
    const p3 = screen.getByText(/Por favor intenta nuevamente/i)
    const button = screen.getByRole('button', { name: 'Entendido' })

    expect(title).toBeInTheDocument()
    expect(p1).toBeInTheDocument()
    expect(p2).toBeInTheDocument()
    expect(p3).toBeInTheDocument()
    expect(button).toBeInTheDocument()
  })
})
