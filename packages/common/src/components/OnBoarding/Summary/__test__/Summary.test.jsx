import React from 'react'
import { act } from '@testing-library/react'

import {
  mockWithProviders,
  themeProvider,
  reduxProvider,
  routerProvider,
  rootContextProvider,
} from '../../../../helpers/__mocks__/mock-providers'

import SummaryContainer from '../index'
import { overwriteStore } from '../../../../helpers/__mocks__/mock-reducer'

jest.mock('@tributi-co/tributi-components', () => ({
  UserTranscriber: () => <div />,
  CertificateManager: () => <div />,
  Button: () => (
    <button data-testid="button-finish"> Quiero revisar mi declaración </button>
  ),
  QuestionRenderError() {
    return <div data-mocked="question-render-error" />
  },
}))
jest.mock('../../../../redux/onboarding/actions')

jest.mock('../../../../config/firebase')

const PERSONAL_INFO = {
  consumer_app: 'tributi',
  currentFiling: {
    id: 'id-mock',
  },
  first_name: 'testing',
  role: 'tax_filer',
  coupons: [
    {
      id: 'test',
      created_at: '2020-06-15T18:57:57.691238Z',
      updated_at: '2020-06-15T18:57:57.715613Z',
      description: null,
      code: null,
      shared_with: null,
      type: 'referral',
      status: 'valid',
      value: '0.20000000',
      redemption_count: 0,
      max_redemptions: 0,
      valid_from: null,
      valid_until: null,
      is_influencer: false,
      country_code: 'CO',
      user: 'test',
    },
  ],
}

const PAYMENT_REDUCER = {
  tax_engine: {
    created_at: '2022-10-06',
  },
}

const summaryReducer = {
  summaryData: [
    {
      code: '1',
      text: 'Información personal',
      type: 'tab',
      instances: [],
      id: '1',
    },
    {
      id: '1',
      code: '1.1.1',
      text: 'Información personal',
      type: 'group',
      instances: [
        {
          instance_id: 'test_id_instance',
          code: '1.1.1.1',
          certificates: [
            {
              id: '1',
              certificate_kind: 'normal',
              required_level: 2,
              code: '1.2.1.2',
              type: 'certificate',
              text: 'Información de presentación',
              values: {
                certificate_url:
                  'https://www.tributi.com/ayuda/informacio-sancion-dian',
              },
              user_certificate: {
                cert_file: null,
                read_status: null,
                code: '1.2.1.2',
                status: 'processed',
                is_automated: false,
              },
              is_oculus: false,
              ocr_status: '',
            },
          ],
        },
      ],
    },
  ],
  dianTab: '6.',
  setStart: jest.fn(),
}

const summaryReducerIncompleted = {
  summaryData: [
    {
      code: '1',
      text: 'Información personal',
      type: 'tab',
      instances: [],
      id: '1',
    },
  ],
  dianTab: '6.',
  setStart: jest.fn(),
}

const summaryReducerPartial = {
  ...summaryReducer,
  partialOnboardingData: [{ tabCode: '1.', tabName: 'Información personal' }],
}

const getUserCertificates = jest.fn()

const setup = (baseProps, newStore) => {
  const props = {
    getMultipleAnswers: jest.fn().mockResolvedValue([]),
    clearSummaryData: jest.fn(),
    markCertificateAsCancel: jest.fn(),
    sendDocumentsToUser: jest.fn(),
    ignoreEngineErrorWithInput: jest.fn(),
    goBackTo: jest.fn(),
    ignorableInputs: [],
    updateCertificatePassword: jest.fn(),
    setStart: jest.fn(),
    fillingId: 'random-id',
    personalInfoTab: '1.',
    getUserCertificates,
    ...baseProps,
  }
  const store = overwriteStore({
    paymentReducer: PAYMENT_REDUCER,
    personalInfo: PERSONAL_INFO,
    ...newStore,
  })
  window.localStorage.setItem('infoUser', '{"fillings": [{}]}')
  getUserCertificates.mockResolvedValueOnce([{ id: 'test' }])
  const wrapper = mockWithProviders(<SummaryContainer {...props} />, [
    rootContextProvider(),
    themeProvider(),
    reduxProvider(store),
    routerProvider(),
    rootContextProvider(),
  ])
  const { rerender } = wrapper
  return { props, wrapper, rerender }
}

describe('<Summary />', () => {
  it('Should mount container properly', async () => {
    await act(async () => {
      const { wrapper } = setup({}, { onboardingReducer: summaryReducer })
      const textExpected =
        'Esta es la lista de certificados que necesitamos para elaborar tu declaración según tus respuestas. Si no estás seguro cómo conseguir los certificados, recuerda que al lado de cada uno está el botón "Cómo conseguirlo" en el cual te explicamos el paso a paso para cada uno. 🎉 ¡Ya casi terminamos! 🎉'

      expect(
        wrapper.getByText('Tu lista de certificados personalizada')
      ).toBeTruthy()
      expect(wrapper.getByText(textExpected)).toBeTruthy()
      expect(wrapper.getByText('Información personal')).toBeTruthy()
      expect(wrapper.getByText('Información de presentación')).toBeTruthy()
      expect(wrapper.getByText('¿Cómo conseguirlo?')).toBeTruthy()
      expect(wrapper.getByTestId('footer')).toBeTruthy()
      const button = wrapper.getByTestId('button-finish')
      expect(button.textContent).toContain('Quiero revisar mi declaración')
    })
  })

  it('Should show alert message when DIAN information is missing', async () => {
    await act(async () => {
      const { wrapper } = setup(
        {},
        { onboardingReducer: summaryReducerIncompleted }
      )
      const alertTextExpected =
        'Para poder Elaborar tu declaración de renta, es necesario que selecciones e ingreses tu información en las pestañas de Bienes, Ingresos, Deducciones, Ahorros y préstamos'
      expect(wrapper.getByText(alertTextExpected)).toBeTruthy()
    })
  })

  it('should render PartialInformation when there is onboardingPartialData', () => {
    const EXPECTED_RENDERED_LINKS = 1
    const { wrapper } = setup({}, { onboardingReducer: summaryReducerPartial })
    expect(wrapper.getAllByRole('link')).toHaveLength(EXPECTED_RENDERED_LINKS)
    expect(
      wrapper.getByText('Tienes preguntas pendientes por responder')
    ).toBeInTheDocument()
  })
})
