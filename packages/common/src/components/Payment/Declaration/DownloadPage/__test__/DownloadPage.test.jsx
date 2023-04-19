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
import DownloadPage from '../download-page'

window.open = jest.fn()
jest.mock('../../../../../redux/payment/actions')

const MOCK_PERSONAL_INFO = {
  id: 'testing-person',
  role: 'accountant',
  currentFiling: {
    country_code: 'CO',
    id: 'X111111',
    kind: 'test-kind',
    tax_year: 2019,
    taxable_kind: 'test',
  },
}

const setup = async (baseProps, newStore) => {
  const props = {
    getTaxFilePayment: jest.fn(),
    downloadTaxFile: jest.fn(),
    hiddenPaymentModal: jest.fn(),
    handleInputError: jest.fn(),
    ...baseProps,
  }
  const store = overwriteStore({
    personalInfo: MOCK_PERSONAL_INFO,
    ...newStore,
  })

  const wrapper = mockWithProviders(<DownloadPage {...props} />, [
    themeProvider(),
    reduxProvider(store),
    routerProvider(),
  ])

  return wrapper
}

describe('<DownloadPage />', () => {
  it('should render properly', () => {
    const storeProps = {
      general: {
        loadingCount: 0,
      },
    }

    const props = {
      taxEngine: {
        author_role: 'tax_filer',
        book_id: '1Lz0dd-EbHZZ7N74LGCRSSaRg1pn2HyIhL_J_yT2bhzc',
        created_at: '2022-07-02T02:22:44.928991Z',
        form: '210',
        how_to_file_160_link:
          'https://www.tributi.com/ayuda/formulario-160-formulario-activos-exterior-mayor-3580-uvt',
        how_to_file_link:
          'https://www.tributi.com/ayuda/1-transcripcion-presentacion-puntual-formulario-210-firma-electronica-sin-saldo-a-pagar-dian',
        id: '5df81866-b08f-47a9-9f1e-b873148d86f1',
        needs_form_160: false,
        report_id: null,
        report_status: 'valid',
        review_requested: false,
        status: 'valid',
        status_code: null,
        status_message: '',
        task_id:
          'projects/tributilabs/locations/southamerica-east1/queues/stg-default/tasks/3031179663103104205',
        tax_due: '0',
        tax_engine: '5df81866-b08f-47a9-9f1e-b873148d86f1',
        tax_refund_due: '0',
        video_explain_url: '',
      },
      documents: { summary: '' },
      getFile: jest.fn(),
      verifySanctionBeforeDownload: jest.fn(),
      flushAranea: jest.fn(),
      editFiling: jest.fn(),
      isAccountant: true,
      stepFormHasErrors: true,
    }
    setup(props, storeProps)

    const step1Text = screen.getByText(
      /Revisa que los valores usados en la declaración sean correctos y completos/g
    )
    const button1 = screen.getByText(/Revisar valores y sugerencias/g)
    const button2 = screen.getByRole('button', {
      name: 'Editar mi declaración',
    })
    const step2Text = screen.getByText(
      /Si la declaración de tu usuario está correcta haz el video con las explicacione/g
    )
    const inputVideo = screen.getByTestId('input-link-video')
    const step3Text = screen.getByText(
      /Con la seguridad de que la declaración está bien y el video de explicaciones, solamente queda enviarle el borrador de la declaración al usuario/g
    )
    const buttonSendDraft = screen.getByRole('button', {
      name: 'Enviar borrador de la declaración al usuario para su aprobación',
    })
    const step4Text = screen.getByText(
      /Presenta la declaración de renta cuando tu cliente la apruebe/g
    )
    const buttonDownloadInfo = screen.getByText(/Descargar información/g)

    expect(step1Text).toBeInTheDocument()
    expect(button1).toBeInTheDocument()
    expect(button2).toBeInTheDocument()
    expect(step2Text).toBeInTheDocument()
    expect(inputVideo).toBeInTheDocument()
    expect(step3Text).toBeInTheDocument()
    expect(step4Text).toBeInTheDocument()
    expect(buttonSendDraft).toBeDisabled()
    expect(buttonDownloadInfo).toBeInTheDocument()
  })

  it('should render properly with form 160', () => {
    const storeProps = {
      general: {
        loadingCount: 0,
      },
    }

    const props = {
      taxEngine: {
        author_role: 'tax_filer',
        book_id: '1Lz0dd-EbHZZ7N74LGCRSSaRg1pn2HyIhL_J_yT2bhzc',
        created_at: '2022-07-02T02:22:44.928991Z',
        form: '210',
        how_to_file_160_link:
          'https://www.tributi.com/ayuda/formulario-160-formulario-activos-exterior-mayor-3580-uvt',
        how_to_file_link:
          'https://www.tributi.com/ayuda/1-transcripcion-presentacion-puntual-formulario-210-firma-electronica-sin-saldo-a-pagar-dian',
        id: '5df81866-b08f-47a9-9f1e-b873148d86f1',
        needs_form_160: true,
        report_id: null,
        report_status: 'valid',
        review_requested: false,
        status: 'valid',
        status_code: null,
        status_message: '',
        task_id:
          'projects/tributilabs/locations/southamerica-east1/queues/stg-default/tasks/3031179663103104205',
        tax_due: '0',
        tax_engine: '5df81866-b08f-47a9-9f1e-b873148d86f1',
        tax_refund_due: '0',
        video_explain_url: '',
      },
      documents: { summary: '' },
      getFile: jest.fn(),
      verifySanctionBeforeDownload: jest.fn(),
      flushAranea: jest.fn(),
      editFiling: jest.fn(),
      isAccountant: true,
      loadingLithographic: false,
      needs160: true,
    }
    setup(props, storeProps)

    const assetsAbroadText = screen.getByText(
      /Reporta tus activos en el exterior/g
    )
    const button1 = screen.getByText(/Instrucciones/g)
    const button2 = screen.getByText(/Información a reportar/g)
    expect(assetsAbroadText).toBeInTheDocument()
    expect(button1).toBeInTheDocument()
  })

  it('should render properly with video Link', async () => {
    const storeProps = {
      general: {
        loadingCount: 0,
      },
    }

    const props = {
      taxEngine: {
        author_role: 'tax_filer',
        book_id: '1Lz0dd-EbHZZ7N74LGCRSSaRg1pn2HyIhL_J_yT2bhzc',
        created_at: '2022-07-02T02:22:44.928991Z',
        form: '210',
        how_to_file_160_link:
          'https://www.tributi.com/ayuda/formulario-160-formulario-activos-exterior-mayor-3580-uvt',
        how_to_file_link:
          'https://www.tributi.com/ayuda/1-transcripcion-presentacion-puntual-formulario-210-firma-electronica-sin-saldo-a-pagar-dian',
        id: '5df81866-b08f-47a9-9f1e-b873148d86f1',
        needs_form_160: true,
        report_id: null,
        report_status: 'valid',
        review_requested: false,
        status: 'valid',
        status_code: null,
        status_message: '',
        task_id:
          'projects/tributilabs/locations/southamerica-east1/queues/stg-default/tasks/3031179663103104205',
        tax_due: '0',
        tax_engine: '5df81866-b08f-47a9-9f1e-b873148d86f1',
        tax_refund_due: '0',
        video_explain_url: 'https://www.vimeo.com/video',
      },
      documents: { summary: '' },
      getFile: jest.fn(),
      verifySanctionBeforeDownload: jest.fn(),
      flushAranea: jest.fn(),
      editFiling: jest.fn(),
      isAccountant: true,
      loadingLithographic: false,
      needs160: true,
      videoExplainURL: 'https://www.vimeo.com/video',
      stepFormValue: {
        video: 'https://www.vimeo.com/video',
        videocall: 'https://www.vimeo.com/videocall',
      },
      stepFormHasErrors: false,
    }

    await act(async () => {
      await waitFor(() => setup(props, storeProps))
    })

    const inputVideo = screen.getByTestId('input-link-video')

    expect(inputVideo.value).toBe('https://www.vimeo.com/video')
  })

  it('should call handleInputError when change input video link', async () => {
    const storeProps = {
      general: {
        loadingCount: 0,
      },
    }

    const handleInputError = jest.fn()

    const props = {
      taxEngine: {
        author_role: 'tax_filer',
        book_id: '1Lz0dd-EbHZZ7N74LGCRSSaRg1pn2HyIhL_J_yT2bhzc',
        created_at: '2022-07-02T02:22:44.928991Z',
        form: '210',
        how_to_file_160_link:
          'https://www.tributi.com/ayuda/formulario-160-formulario-activos-exterior-mayor-3580-uvt',
        how_to_file_link:
          'https://www.tributi.com/ayuda/1-transcripcion-presentacion-puntual-formulario-210-firma-electronica-sin-saldo-a-pagar-dian',
        id: '5df81866-b08f-47a9-9f1e-b873148d86f1',
        needs_form_160: true,
        report_id: null,
        report_status: 'valid',
        review_requested: false,
        status: 'valid',
        status_code: null,
        status_message: '',
        task_id:
          'projects/tributilabs/locations/southamerica-east1/queues/stg-default/tasks/3031179663103104205',
        tax_due: '0',
        tax_engine: '5df81866-b08f-47a9-9f1e-b873148d86f1',
        tax_refund_due: '0',
        video_explain_url: '',
      },
      documents: { summary: '' },
      getFile: jest.fn(),
      verifySanctionBeforeDownload: jest.fn(),
      flushAranea: jest.fn(),
      editFiling: jest.fn(),
      isAccountant: true,
      loadingLithographic: false,
      needs160: true,
      videoExplainURL: '',
      stepFormValue: {
        video: '',
        videocall: '',
      },
      stepFormHasErrors: true,
      handleInputError,
    }

    await act(async () => {
      await waitFor(() => setup(props, storeProps))
    })

    const inputVideo = screen.queryByTestId('input-link-video')
    const inputVideoCall = screen.queryByTestId('input-link-videocall')

    await waitFor(() =>
      fireEvent.change(inputVideo, {
        target: { value: 'https://www.vimeo.com/video' },
      })
    )
    await waitFor(() =>
      fireEvent.change(inputVideoCall, {
        target: { value: 'https://www.vimeo.com/videocall' },
      })
    )
    // expect to execute 4 times, 2 at start and 2 at update
    expect(handleInputError).toHaveBeenCalledTimes(4)
    expect(inputVideo.value).toBe('https://www.vimeo.com/video')
  })

  it('should open expalatory video link', async () => {
    const user = userEvent.setup()
    const HREF =
      'https://sites.google.com/tributi.com/tributi-pro/servicio-al-cliente/vimeo?authuser=0'

    const storeProps = {
      general: {
        loadingCount: 0,
      },
    }

    const props = {
      taxEngine: {
        author_role: 'tax_filer',
        book_id: '1Lz0dd-EbHZZ7N74LGCRSSaRg1pn2HyIhL_J_yT2bhzc',
        created_at: '2022-07-02T02:22:44.928991Z',
        form: '210',
        how_to_file_160_link:
          'https://www.tributi.com/ayuda/formulario-160-formulario-activos-exterior-mayor-3580-uvt',
        how_to_file_link:
          'https://www.tributi.com/ayuda/1-transcripcion-presentacion-puntual-formulario-210-firma-electronica-sin-saldo-a-pagar-dian',
        id: '5df81866-b08f-47a9-9f1e-b873148d86f1',
        needs_form_160: true,
        report_id: null,
        report_status: 'valid',
        review_requested: false,
        status: 'valid',
        status_code: null,
        status_message: '',
        task_id:
          'projects/tributilabs/locations/southamerica-east1/queues/stg-default/tasks/3031179663103104205',
        tax_due: '0',
        tax_engine: '5df81866-b08f-47a9-9f1e-b873148d86f1',
        tax_refund_due: '0',
        video_explain_url: '',
      },
      documents: { summary: '' },
      getFile: jest.fn(),
      verifySanctionBeforeDownload: jest.fn(),
      flushAranea: jest.fn(),
      editFiling: jest.fn(),
      isAccountant: true,
      loadingLithographic: false,
      needs160: true,
      video: '',
    }

    await act(async () => {
      await waitFor(() => setup(props, storeProps))
    })

    const explanationLink = screen.getByRole('link', { name: 'aquí' })

    user.click(explanationLink)

    expect(explanationLink.closest('a')).toHaveAttribute('href', HREF)
  })
})
