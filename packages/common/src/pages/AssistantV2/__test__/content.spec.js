import React from 'react'
import { mount } from 'enzyme'
import { Modal, Select } from 'antd'
import { act, waitFor } from '@testing-library/react'

import {
  MockWithProvidersLegacy,
  themeProvider,
  routerProvider,
  reduxProvider,
  MockWithReduxProvider,
} from '../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'
import AssistantV2 from '..'
import { FormRecoverPassword } from '../../../components/RecoverPassword'
import { LocationBar } from '@tributi-co/tributi-components'
import {
  getAsistantUsers,
  getAssistantFilingsByUser,
  getAssistantPersons,
  getAssistantFilingsByPerson,
  getAssistantPaymentsByFiling,
  getAssistantDocumentsByFiling,
  getAssistantEnginesByFiling,
  changeFilingActiveStatus,
  saveAssistantUser,
  saveAssistantPerson,
  getFirebaseDocumentStatus,
  setAssistantLocalState,
  changeOrderStatus,
  assistantRefundPayment,
  getAssistantRequestRefundPayment,
} from '../../../redux/form/actions'
import { cancelFileUpload } from '../../../redux/onboarding/actions'
import {
  setCurrentFilingById,
  setCurrentFiling,
} from '../../../redux/personalInfo/actions'

import { mockDocuments } from './mockDocuments'
import { changeUserPassword } from '../../../redux/auth/actions'
import PaymentRefundForm from '../../../components/PaymentRefundForm'
import { usePersonalInfo } from '../../../helpers/hooks'

jest.mock('../../../redux/auth/actions')
jest.mock('../../../redux/form/actions')
jest.mock('../../../redux/onboarding/actions')
jest.mock('../../../redux/personalInfo/actions')

jest.mock('../../../helpers/hooks', () => {
  const actual = jest.requireActual('../../../helpers/hooks')
  return {
    ...actual,
    usePersonalInfo: jest.fn().mockImplementation(actual.usePersonalInfo),
  }
})

const setup = (baseProps, assistantState = {}, regStore = {}) => {
  const MOCK_PERSONAL_INFO = {
    first_name: 'testing',
    is_staff: true,
    coupons: [
      {
        id: 'test',
        created_at: '2020-06-15T18:57:57.691238Z',
        updated_at: '2020-06-15T18:57:57.715613Z',
        description: null,
        code: 'test',
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

  const props = {
    ...baseProps,
  }

  const state = {
    personalInfo: MOCK_PERSONAL_INFO,
    registerReducer: {
      assistantLocalState: {
        currentUser: {
          first_name: 'Marcus ',
          last_name: 'Lord',
          phone: '+573216369285',
        },
        currentPerson: {
          first_name: 'Marcus ',
          last_name: 'Lord',
        },
        currentFiling: {
          tax_year: 2020,
        },
        currentLocation: {
          location: '',
          goBack: false,
        },
        ...assistantState,
      },
      ...regStore,
    },
  }
  const store = overwriteStore(state)

  const wrapper = MockWithProvidersLegacy(<AssistantV2 {...props} />, mount, [
    themeProvider(),
    routerProvider(),
    reduxProvider(store),
  ])
  return { wrapper, props, store }
}

const setupWithProvider = (baseProps, assistantState = {}, regStore = {}) => {
  const props = {
    ...baseProps,
  }
  const registerReducer = {
    assistantLocalState: {
      currentUser: {
        first_name: 'Marcus ',
        last_name: 'Lord',
        phone: '+573216369285',
      },
      currentPerson: {
        first_name: 'Marcus ',
        last_name: 'Lord',
      },
      currentFiling: {
        tax_year: 2020,
      },
      currentLocation: {
        location: '',
        goBack: false,
      },
      ...assistantState,
    },
    ...regStore,
  }
  const store = overwriteStore({ registerReducer })
  const wrapper = MockWithReduxProvider(
    <AssistantV2 {...props} store={store} />,
    mount,
    store
  )
  return { wrapper, props, store }
}

describe('<AssistantV2 /> test', () => {
  let mockGetItem

  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: (params) => mockGetItem(params),
      setItem: jest.fn(() => null),
    },
    writable: true,
  })

  beforeEach(() => {
    mockGetItem = jest
      .fn()
      .mockReturnValue(JSON.stringify({ infoUser: { is_staff: true } }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Should render properly', () => {
    it('should render main form to searching inputs and buttons', () => {
      const { wrapper } = setup()
      expect(wrapper.find('form').length).toBe(1)
      expect(wrapper.find('input').length).toBe(2)
      expect(wrapper.find('button').length).toBe(3)
      expect(wrapper.find('label').length).toBe(2)
      expect(wrapper.find('label').at(0).text()).toEqual('Email usuario')
      expect(wrapper.find('label').at(1).text()).toEqual('# de documento')
    })

    it('should render the user table properly', () => {
      const assistantState = {
        showUsers: true,
      }
      const { wrapper } = setup({}, assistantState)
      expect(wrapper.find('table').find('th')).toHaveLength(10)
    })

    it('should render the user table properly when searching is by filing', () => {
      const assistantState = {
        showUsers: true,
        showingFilings: true,
        assistantUsers: [
          {
            id: '1231290407235',
            email: 'test@test.com',
            first_name: 'Fist test',
            last_name: 'Last test',
            user_document_type: 'cedula_de_ciudadania',
            phone: '123421412',
            national_id: '4127490',
            referrals: '',
            referral_balance: '',
            is_active: true,
          },
        ],
      }
      const { wrapper } = setup({}, assistantState)
      expect(wrapper.find('table').find('th')).toHaveLength(10)
    })

    it('should render the person table properly', () => {
      const assistantState = {
        showUsers: false,
        showPersons: true,
      }
      const { wrapper } = setup({}, assistantState)
      expect(wrapper.find('table').find('th')).toHaveLength(7)
    })

    it('should render the person table properly when searching is by filing', () => {
      const assistantState = {
        showUsers: false,
        showPersons: true,
        showingFilings: true,
        assistantPersons: [
          {
            id: '1231290407235',
            email: 'test@test.com',
            user_document_type: 'cedula_de_ciudadania',
            national_id: '12312424',
            first_name: 'Name test',
            last_name: 'Last test',
            phone: '12324213532',
            referrals: '',
            referral_balance: '',
            is_active: true,
          },
        ],
      }
      const { wrapper } = setup({}, assistantState)
      expect(wrapper.find('table').find('th')).toHaveLength(7)
    })

    it('should render the filing table properly', () => {
      const assistantState = {
        showUsers: false,
        showPersons: false,
        showFilings: true,
      }
      const { wrapper } = setup({}, assistantState)
      expect(wrapper.find('table').find('th')).toHaveLength(12)
    })

    it('should render the documents table properly', () => {
      const assistantState = {
        showUsers: false,
        showPersons: false,
        showFilings: false,
        showDocuments: true,
      }
      const { wrapper } = setup({}, assistantState)
      expect(wrapper.find('table').find('th')).toHaveLength(9)
    })

    it('should render the payments table properly', () => {
      const assistantState = {
        showUsers: false,
        showPersons: false,
        showFilings: false,
        showDocuments: false,
        showPayments: true,
      }
      const { wrapper } = setup({}, assistantState)
      expect(wrapper.find('table').find('th')).toHaveLength(9)
    })

    it('should render the filings by user table properly', () => {
      const assistantState = {
        showUsers: false,
        showPersons: false,
        showFilings: false,
        showDocuments: false,
        showPayments: false,
        showFilingByUser: true,
      }
      const regStore = {
        assistantFilingsByUser: [
          {
            id: '12421412512351235',
            tax_year: '2022',
            product_plan: 'estandar',
            payment_status: 'approved',
            due_date: '2022-12-12',
            created_at: '2022-12-12t',
            updated_at: '2022-12-12',
            status: 'active',
            change_status_at: '',
            dian_credential: {
              national_id_kind: 'cedula_de_ciudadania',
              national_id: '131241',
              password: 'mocked',
            },
            owner: {
              email: 'test@email.com',
              national_id: '1212121212',
            },
            person: {
              first_name: 'mocked',
              last_name: 'mocked',
              document_id: 'some-id',
            },
            is_active: true,
          },
        ],
      }
      const { wrapper } = setup({}, assistantState, regStore)
      expect(wrapper.find('table').find('th')).toHaveLength(13)
    })

    it('should render the message when no data founded properly', () => {
      const assistantState = {
        showFilingByUser: false,
        searching: true,
        emailOrId: { tag: 'fake tag' },
      }
      const { wrapper } = setup({}, assistantState)
      expect(wrapper.find('span').text()).toContain('fake tag')
    })

    it('should render the user form edit properly', () => {
      const assistantState = {
        searching: false,
        showEditUser: true,
        currentUser: {
          email: 'test@email.com',
          user_document_type: 'cedula_de_ciudadania',
          national_id: '7238901285',
          first_name: 'Name',
          last_name: 'Last',
          phone: '3216369285',
          indicative: '+57',
        },
      }
      const { wrapper } = setup({}, assistantState)
      const modalForm = wrapper.find('form').at(1)
      const { currentUser } = assistantState
      const onlyPhone = '3216369285'
      const country = 'Colombia ( +57 )'
      expect(modalForm.find('label')).toHaveLength(7)
      expect(modalForm.find('label').at(0).text()).toEqual('Email')
      expect(modalForm.find('label').at(1).text()).toEqual('Tipo documento')
      expect(modalForm.find('label').at(2).text()).toEqual('Documento')
      expect(modalForm.find('label').at(3).text()).toEqual('Nombres')
      expect(modalForm.find('label').at(4).text()).toEqual('Apellidos')
      expect(modalForm.find('label').at(5).text()).toEqual('Indicativo')
      expect(modalForm.find('label').at(6).text()).toEqual('Telefono')

      expect(modalForm.find('input')).toHaveLength(7)
      expect(modalForm.find('input').at(0).props().value).toEqual(
        currentUser.email
      )
      expect(
        modalForm
          .find('.ant-select-selection-item')
          .at(0)
          .text()
          .normalize('NFD')
          .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, '$1$2')
      ).toEqual('Cedula de ciudadania')
      expect(modalForm.find('input').at(2).props().value).toEqual(
        currentUser.national_id
      )
      expect(modalForm.find('input').at(3).props().value).toEqual(
        currentUser.first_name
      )
      expect(modalForm.find('input').at(4).props().value).toEqual(
        currentUser.last_name
      )
      expect(
        modalForm.find('.ant-select-selection-item').at(1).props().title
      ).toEqual(country)
      expect(modalForm.find('input').at(6).props().value).toEqual(onlyPhone)
      expect(modalForm.find('button').text()).toEqual('Actualizar')
    })

    it('should render the person form edit properly', () => {
      const assistantState = {
        searching: false,
        showEditUser: false,
        showEditPerson: true,
        currentPerson: {
          first_name: 'Name',
          last_name: 'Last',
          user_document_type: 'cedula_de_ciudadania',
          document_id: '7238901285',
          relationship: 'padre',
        },
      }
      const { wrapper } = setup({}, assistantState)
      const modalForm = wrapper.find('form').at(1)
      const { currentPerson } = assistantState

      expect(modalForm.find('label')).toHaveLength(5)
      expect(modalForm.find('label').at(0).text()).toEqual('Nombres')
      expect(modalForm.find('label').at(1).text()).toEqual('Apellidos')
      expect(modalForm.find('label').at(2).text()).toEqual('Tipo documento')
      expect(modalForm.find('label').at(3).text()).toEqual('Documento')
      expect(modalForm.find('label').at(4).text()).toEqual('Relacion')

      expect(modalForm.find('input')).toHaveLength(5)
      expect(modalForm.find('input').at(0).props().value).toEqual(
        currentPerson.first_name
      )
      expect(modalForm.find('input').at(1).props().value).toEqual(
        currentPerson.last_name
      )
      expect(modalForm.find('input').at(3).props().value).toEqual(
        currentPerson.document_id
      )
      expect(
        modalForm
          .find('.ant-select-selection-item')
          .at(0)
          .text()
          .normalize('NFD')
          .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, '$1$2')
      ).toEqual('Cedula de ciudadania')
      expect(modalForm.find('.ant-select-selection-item').at(1).text()).toEqual(
        'Padre o Madre'
      )
      expect(modalForm.find('button').text()).toEqual('Actualizar')
    })

    it('should render the change password form edit properly', () => {
      const assistantState = {
        searching: false,
        showEditUser: false,
        showEditPerson: false,
        showChangePassword: true,
      }
      const { wrapper } = setup({}, assistantState)
      const modalForm = wrapper.find('form').at(1)
      expect(wrapper.find(FormRecoverPassword).find('input')).toHaveLength(2)
      expect(
        modalForm
          .find('button')
          .text()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
      ).toEqual('Actualizar Contrasena')
    })

    it('should render the acount swap form edit properly', () => {
      const assistantState = {
        showChangePassword: false,
        showAccountSwap: true,
      }
      const { wrapper } = setup({}, assistantState)
      const modalForm = wrapper.find('form').at(1)
      const labels = modalForm.find('label')

      expect(modalForm.find('input')).toHaveLength(2)
      expect(labels.at(0).text()).toEqual('Email')
      expect(labels.at(1).text()).toEqual('Documento')
      expect(modalForm.find('button').text()).toEqual('Actualizar')
    })
  })

  describe('Users table test', () => {
    it('should show the users data by email', (done) => {
      const mockUser = [
        {
          email: 'test@ttest.com',
          user_document_type: 'cedula_de_ciudadania',
          national_id: '12312424',
          first_name: 'Name test',
          last_name: 'Last test',
          phone: '12324213532',
          referrals: '',
          referral_balance: '',
          is_active: true,
        },
      ]

      getAsistantUsers.mockResolvedValue(mockUser)

      const mockLocalState = {
        currentLocation: {
          location: 'users',
        },
        emailOrId: {
          param: {
            email: 'test@test.com',
          },
          tag: 'email',
          text: 'test@test.com',
        },
        searching: true,
        showDocuments: false,
        showEngines: false,
        showFilingByUser: false,
        showFilings: false,
        showPayments: false,
        showPersons: false,
        showUsers: true,
        showingFilings: false,
        showDianCredentials: false,
        showRequestRefundPayment: false,
        currentFiling: {},
      }

      const assistantState = {
        searchUser: true,
      }
      const { wrapper } = setup({}, assistantState)
      const iputEmail = wrapper.find('input').at(0)
      iputEmail.props().onChange({ target: { value: 'test@test.com' } })
      const button = wrapper.find('button').at(0)
      wrapper.update()
      button.simulate('click')

      setTimeout(() => {
        expect(getAsistantUsers).toHaveBeenCalled()
        expect(getAsistantUsers).toHaveBeenCalledWith(
          { email: 'test@test.com' },
          mockLocalState
        )
        expect(getAsistantUsers()).resolves.toEqual(mockUser)
        done()
      }, 0)
    })

    it('should show the users data by filing', (done) => {
      const mockUser = [
        {
          email: 'test@ttest.com',
          user_document_type: 'cedula_de_ciudadania',
          national_id: '12312424',
          first_name: 'Name test',
          last_name: 'Last test',
          phone: '12324213532',
          referrals: '',
          referral_balance: '',
          is_active: true,
        },
      ]

      getAssistantFilingsByUser.mockResolvedValue(mockUser)
      const { wrapper } = setup({})
      const iputDocument = wrapper.find('input').at(1)
      iputDocument.props().onChange({ target: { value: '21412412' } })
      const button = wrapper.find('button').at(1)

      wrapper.update()
      button.simulate('click')

      const mockLocalState = {
        emailOrId: {
          param: {
            national_id: '21412412',
          },
          tag: 'documento',
          text: '21412412',
        },
        location: '',
        searching: true,
        showDocuments: false,
        showEngines: false,
        showFilingByUser: true,
        showFilings: false,
        showPayments: false,
        showPersons: false,
        showUsers: false,
        showingFilings: true,
        showDianCredentials: false,
        showRequestRefundPayment: false,
        currentFiling: {},
      }
      setTimeout(() => {
        expect(getAssistantFilingsByUser).toHaveBeenCalled()
        expect(getAssistantFilingsByUser).toHaveBeenCalledWith(
          { national_id: '21412412', version: 2 },
          mockLocalState
        )
        expect(getAssistantFilingsByUser()).resolves.toEqual(mockUser)
        done()
      }, 0)
    })

    it('should change password', async () => {
      const mockUser = [
        {
          email: 'test@ttest.com',
          user_document_type: 'cedula_de_ciudadania',
          national_id: '12312424',
          first_name: 'Name test',
          last_name: 'Last test',
          phone: '12324213532',
          is_active: true,
        },
      ]

      changeUserPassword.mockResolvedValue(mockUser)

      const assistantState = {
        searching: false,
        showEditUser: false,
        showEditPerson: false,
        showChangePassword: true,
        currentUser: {
          id: '1231290407235',
          email: 'test@test.com',
          first_name: 'Fist test',
          last_name: 'Last test',
          user_document_type: 'cedula_de_ciudadania',
          phone: '123421412',
          national_id: '4127490',
          referrals: '',
          referral_balance: '',
          is_active: true,
        },
      }

      let wrapper, props
      act(() => {
        const { wrapper: wp, props: p } = setupWithProvider({}, assistantState)
        wrapper = wp
        props = p
      })

      const button = wrapper.find(FormRecoverPassword).find('button')
      const inputPassword = wrapper
        .find(FormRecoverPassword)
        .find('input')
        .at(0)
      const inputConfirm = wrapper.find(FormRecoverPassword).find('input').at(1)

      await act(async () => {
        inputPassword.props().onChange({ target: { value: '123' } })
        inputConfirm.props().onChange({ target: { value: '123' } })
        await button.simulate('submit')
      })
      wrapper.update()
      await expect(changeUserPassword).toHaveBeenCalled()
    })

    it('should show the person info when clicked on "Ver personas"', async () => {
      const mockPerson = [
        {
          email: 'test@ttest.com',
          user_document_type: 'cedula_de_ciudadania',
          national_id: '12312424',
          first_name: 'Name test',
          last_name: 'Last test',
          phone: '12324213532',
          referrals: '',
          referral_balance: '',
          is_active: true,
        },
      ]

      getAssistantPersons.mockResolvedValue(mockPerson)

      const assistantState = {
        showUsers: true,
        showingFilings: false,
      }

      const regStore = {
        assistantUsers: [
          {
            id: '1231290407235',
            email: 'test@test.com',
            first_name: 'Fist test',
            last_name: 'Last test',
            user_document_type: 'cedula_de_ciudadania',
            phone: '123421412',
            national_id: '4127490',
            referrals: '',
            referral_balance: '',
            is_active: true,
          },
        ],
      }
      const { wrapper } = setupWithProvider({}, assistantState, regStore)
      const table = wrapper.find('table')
      const button = table
        .find('tbody')
        .find('tr')
        .find('td')
        .at(0)
        .find('button')
        .at(2)
      button.simulate('click')
      await expect(getAssistantPersons()).resolves.toEqual(mockPerson)
    })

    it('should edit user when clicked on "Actualizar" button', async () => {
      const assistantState = {
        searching: false,
        showEditUser: true,
        currentUser: {
          id: '23412353125',
          email: 'test@email.com',
          user_document_type: 'cedula_de_ciudadania',
          national_id: '7238901285',
          first_name: 'Name',
          last_name: 'Last',
          phone: '3216369285',
          indicative: '+57',
        },
      }

      const { wrapper } = setupWithProvider({}, assistantState)
      const modalForm = wrapper.find('form').at(1)
      const button = modalForm.find('button')

      await act(async () => {
        await button.simulate('submit')
      })

      await waitFor(() => {
        expect(saveAssistantUser).toHaveBeenCalled()
        expect(saveAssistantUser).toHaveBeenCalledWith('23412353125', {
          email: 'test@email.com',
          user_document_type: 'cedula_de_ciudadania',
          national_id: '7238901285',
          first_name: 'Name',
          last_name: 'Last',
          indicative: '+57',
          phone: '+573216369285',
        })
      })
    })

    it('should close modal when canceled editing the user in the searching by user', (done) => {
      const assistantState = {
        searching: false,
        showEditUser: true,
        currentUser: {
          id: '23412353125',
          email: 'test@email.com',
          user_document_type: 'cedula_de_ciudadania',
          national_id: '7238901285',
          first_name: 'Name',
          last_name: 'Last',
          phone: '094712023552',
        },
        emailOrId: { param: {} },
      }
      const { wrapper } = setupWithProvider({}, assistantState)
      const buttonModalClose = wrapper
        .find(Modal)
        .at(0)
        .find('.ant-modal-close-x')
      buttonModalClose.simulate('click')
      setTimeout(() => {
        expect(getAsistantUsers).toHaveBeenCalled()
        done()
      }, 0)
    })

    it('should close modal when canceled editing the user in the searching by filing', (done) => {
      const assistantState = {
        searching: false,
        showingFilings: true,
        showEditUser: true,
        currentUser: {
          id: '23412353125',
          email: 'test@email.com',
          user_document_type: 'cedula_de_ciudadania',
          national_id: '7238901285',
          first_name: 'Name',
          last_name: 'Last',
          phone: '094712023552',
        },
        emailOrId: { param: {} },
      }
      const { wrapper } = setup({}, assistantState)
      const buttonModalClose = wrapper
        .find(Modal)
        .at(0)
        .find('.ant-modal-close-x')
      buttonModalClose.simulate('click')
      setTimeout(() => {
        expect(getAssistantFilingsByUser).toHaveBeenCalled()
        done()
      }, 0)
    })

    it('should active/inactive user', async () => {
      const actualHooks = jest.requireActual('../../../helpers/hooks')

      usePersonalInfo.mockImplementation(() => {
        const hook = actualHooks.usePersonalInfo()
        return {
          ...hook,
          personalInfo: {
            ...hook.personalInfo,
            is_staff: true,
          },
        }
      })
      const mockUser = [
        {
          email: 'test@ttest.com',
          user_document_type: 'cedula_de_ciudadania',
          national_id: '12312424',
          first_name: 'Name test',
          last_name: 'Last test',
          phone: '12324213532',
          is_active: true,
        },
      ]

      saveAssistantUser.mockResolvedValue(mockUser)

      const assistantState = {
        showUsers: true,
        showingFilings: false,
      }

      const regStore = {
        assistantUsers: [
          {
            id: '1231290407235',
            email: 'test@test.com',
            first_name: 'Fist test',
            last_name: 'Last test',
            user_document_type: 'cedula_de_ciudadania',
            phone: '123421412',
            national_id: '4127490',
            referrals: '',
            referral_balance: '',
            is_active: true,
          },
        ],
      }
      const { wrapper } = setupWithProvider({}, assistantState, regStore)

      const table = wrapper.find('table')
      const row = table.find('tbody').find('tr').find('td').at(9)

      const select = row.find(Select)

      select.props().onChange({ target: { value: 'test@test.com' } })
      wrapper.update()
      await expect(saveAssistantUser()).resolves.toEqual(mockUser)
    })
  })

  describe('Persons table test', () => {
    it('should edit person when clicked on "Actualizar" button', (done) => {
      const assistantState = {
        searching: false,
        showEditUser: false,
        showEditPerson: true,
        currentPerson: {
          id: '1231290407235',
          document_id: '22222222',
          user_document_type: 'cedula_de_ciudadania',
          national_id: '12312424',
          first_name: 'Name test',
          last_name: 'Last test',
          relationship: 'padre',
          status: '',
        },
      }
      const { wrapper } = setupWithProvider({}, assistantState)
      const modalForm = wrapper.find('form').at(1)
      const button = modalForm.find('button')
      button.simulate('submit')
      setTimeout(() => {
        expect(saveAssistantPerson).toHaveBeenCalled()
        expect(saveAssistantPerson).toHaveBeenCalledWith('1231290407235', {
          document_id: '22222222',
          first_name: 'Name test',
          last_name: 'Last test',
          relationship: 'padre',
          user_document_type: 'cedula_de_ciudadania',
        })
        done()
      }, 0)
    })

    it('should show the filings when clicked on "Ver filings"', async () => {
      const mockFiling = [
        {
          id: '12421412512351235',
          tax_year: '2022',
          product_plan: 'estandar',
          payment_status: 'approved',
          due_date: '2022-12-12',
          created_at: '2022-12-12t',
          updated_at: '2022-12-12',
          status: 'active',
          change_status_at: '',
          dian_credential: {
            national_id_kind: 'cedula_de_ciudadania',
            national_id: '131241',
            password: 'mocked',
          },
        },
      ]

      getAssistantFilingsByPerson.mockResolvedValue(mockFiling)

      const assistantState = {
        showUsers: false,
        showPersons: true,
        showingFilings: false,
      }

      const regStore = {
        assistantPersons: [
          {
            id: '1231290407235',
            email: 'test@test.com',
            user_document_type: 'cedula_de_ciudadania',
            national_id: '12312424',
            first_name: 'Name test',
            last_name: 'Last test',
            phone: '12324213532',
            referrals: '',
            referral_balance: '',
            is_active: true,
          },
        ],
      }
      const { wrapper } = setup({}, assistantState, regStore)
      const table = wrapper.find('table')
      const button = table
        .find('tbody')
        .find('tr')
        .find('td')
        .at(0)
        .find('button')
        .at(1)
      button.simulate('click')
      await expect(getAssistantFilingsByPerson()).resolves.toEqual(mockFiling)
    })

    it('should close modal when canceled editing the person in the searching by user', (done) => {
      const assistantState = {
        searching: false,
        showEditUser: false,
        showEditPerson: true,
        currentPerson: {
          first_name: 'Name',
          last_name: 'Last',
          user_document_type: 'cedula_de_ciudadania',
          document_id: '7238901285',
          relationship: 'padre',
        },
        emailOrId: { param: {} },
      }
      const { wrapper } = setup({}, assistantState)

      const buttonModalClose = wrapper
        .find(Modal)
        .at(1)
        .find('.ant-modal-close-x')
      buttonModalClose.simulate('click')
      setTimeout(() => {
        expect(getAssistantPersons).toHaveBeenCalled()
        done()
      }, 0)
    })

    it('should close modal when canceled editing the person in the searching by filing', (done) => {
      const assistantState = {
        searching: false,
        showEditUser: false,
        showEditPerson: true,
        showingFilings: true,
        currentPerson: {
          first_name: 'Name',
          last_name: 'Last',
          user_document_type: 'cedula_de_ciudadania',
          document_id: '7238901285',
          relationship: 'padre',
        },
        emailOrId: { param: {} },
      }
      const { wrapper } = setup({}, assistantState)
      const buttonModalClose = wrapper
        .find(Modal)
        .at(1)
        .find('.ant-modal-close-x')
      buttonModalClose.simulate('click')
      setTimeout(() => {
        expect(getAssistantFilingsByUser).toHaveBeenCalled()
        done()
      }, 0)
    })
  })

  describe('Filings table test', () => {
    it('should disabled the document clicked on "Deshabilitar"', (done) => {
      const assistantState = {
        showUsers: false,
        showPersons: false,
        showFilings: true,
        showingFilings: false,
        emailOrId: { param: '' },
      }

      const regStore = {
        assistantFilingsByPerson: [
          {
            id: '12421412512351235',
            tax_year: '2022',
            product_plan: 'estandar',
            payment_status: 'approved',
            due_date: '2022-12-12',
            created_at: '2022-12-12',
            updated_at: '2022-12-12',
            is_active: true,
            change_status_at: '',
            dian_credential: {
              national_id_kind: 'cedula_de_ciudadania',
              national_id: '131241',
              password: 'djalskfj',
            },
          },
        ],
      }
      const { wrapper } = setup({}, assistantState, regStore)
      const table = wrapper.find('table')
      const button = table
        .find('tbody')
        .find('tr')
        .find('td')
        .at(0)
        .find('button')
        .at(1)
      button.simulate('click')
      setTimeout(() => {
        expect(changeFilingActiveStatus).toHaveBeenCalled()
        expect(changeFilingActiveStatus).toHaveBeenCalledWith(
          '12421412512351235',
          false
        )
        expect(getAssistantFilingsByPerson).toHaveBeenCalled()
        done()
      }, 0)
    })

    it('should ability the document clicked on "Habilitar"', (done) => {
      const assistantState = {
        showUsers: false,
        showPersons: false,
        showFilings: true,
        showingFilings: false,
        emailOrId: { param: '' },
      }

      const regStore = {
        assistantFilingsByPerson: [
          {
            id: '12421412512351235',
            tax_year: '2022',
            product_plan: 'estandar',
            payment_status: 'approved',
            due_date: '2022-12-12',
            created_at: '2022-12-12',
            updated_at: '2022-12-12',
            is_active: false,
            change_status_at: '',
            dian_credential: {
              national_id_kind: 'cedula_de_ciudadania',
              national_id: '131241',
              password: 'djalskfj',
            },
          },
        ],
      }
      const { wrapper } = setup({}, assistantState, regStore)
      const table = wrapper.find('table')
      const button = table
        .find('tbody')
        .find('tr')
        .find('td')
        .at(0)
        .find('button')
        .at(0)
      button.simulate('click')
      setTimeout(() => {
        expect(changeFilingActiveStatus).toHaveBeenCalled()
        expect(changeFilingActiveStatus).toHaveBeenCalledWith(
          '12421412512351235',
          true
        )
        expect(getAssistantFilingsByPerson).toHaveBeenCalled()
        done()
      }, 0)
    })

    it('should update list of filings when searching is by filing and clicked on "Habilitar"', (done) => {
      const assistantState = {
        showUsers: false,
        showPersons: false,
        showFilings: true,
        showingFilings: false,
        showingFilings: true,
        emailOrId: { param: '' },
      }

      const regStore = {
        assistantFilingsByPerson: [
          {
            id: '12421412512351235',
            tax_year: '2022',
            product_plan: 'estandar',
            payment_status: 'approved',
            due_date: '2022-12-12',
            created_at: '2022-12-12',
            updated_at: '2022-12-12',
            is_active: false,
            change_status_at: '',
            dian_credential: {
              national_id_kind: 'cedula_de_ciudadania',
              national_id: '131241',
              password: 'djalskfj',
            },
          },
        ],
      }
      const { wrapper } = setup({}, assistantState, regStore)
      const table = wrapper.find('table')
      const button = table
        .find('tbody')
        .find('tr')
        .find('td')
        .at(0)
        .find('button')
        .at(0)
      button.simulate('click')
      setTimeout(() => {
        expect(changeFilingActiveStatus).toHaveBeenCalled()
        expect(changeFilingActiveStatus).toHaveBeenCalledWith(
          '12421412512351235',
          true
        )
        expect(getAssistantFilingsByUser).toHaveBeenCalled()
        done()
      }, 0)
    })

    it('should show the documents when clicked on "Ver documentos"', (done) => {
      const mockDocuments = [
        {
          id: '12421412512351235',
          document_description: 'Rut',
          created_at: '2022-12-12',
          status: 'approved',
          firebase_status: 'approved',
          read_status: 'aprobado',
          desactivated_at: '2022-12-12',
          cert_file: 'link',
        },
      ]

      getAssistantDocumentsByFiling.mockResolvedValue(mockDocuments)

      const assistantState = {
        showUsers: false,
        showPersons: false,
        showFilings: true,
        showingFilings: false,
      }

      const regStore = {
        assistantFilingsByPerson: [
          {
            id: '12421412512351235',
            tax_year: '2022',
            product_plan: 'estandar',
            payment_status: 'approved',
            due_date: '2022-12-12',
            created_at: '2022-12-12',
            updated_at: '2022-12-12',
            is_active: true,
            change_status_at: '',
            dian_credential: {
              national_id_kind: 'cedula_de_ciudadania',
              national_id: '131241',
              password: 'djalskfj',
            },
          },
        ],
      }
      const { wrapper } = setup({}, assistantState, regStore)
      const table = wrapper.find('table')
      const button = table
        .find('tbody')
        .find('tr')
        .find('td')
        .at(0)
        .find('button')
        .at(2)
      button.simulate('click')
      setTimeout(() => {
        expect(getAssistantDocumentsByFiling).toHaveBeenCalled()
        expect(getAssistantDocumentsByFiling()).resolves.toEqual(mockDocuments)
        done()
      }, 0)
    })

    it('should show the engines when clicked on "Ver motores"', (done) => {
      const mockEngines = [
        {
          id: '12421412512351235',
          status_engine: 'Rut',
          author: 'Author',
          is_assistant: 'false',
          created_at: '2022-12-12',
          max_delivery_date: '2022-12-12',
          completed_at: '2022-12-12',
          pdf_outputs: [],
          how_to_file_link: '',
          financial_status: '',
          template_book_url: '',
          status_code: '',
          status_message: '',
        },
      ]

      getAssistantEnginesByFiling.mockResolvedValue(mockEngines)

      const assistantState = {
        showUsers: false,
        showPersons: false,
        showFilings: true,
        showingFilings: false,
      }

      const regStore = {
        assistantFilingsByPerson: [
          {
            id: '12421412512351235',
            tax_year: '2022',
            product_plan: 'estandar',
            payment_status: 'approved',
            due_date: '2022-12-12',
            created_at: '2022-12-12',
            updated_at: '2022-12-12',
            is_active: true,
            change_status_at: '',
            dian_credential: {
              national_id_kind: 'cedula_de_ciudadania',
              national_id: '131241',
              password: 'djalskfj',
            },
          },
        ],
      }
      const { wrapper } = setup({}, assistantState, regStore)
      const table = wrapper.find('table')
      const button = table
        .find('tbody')
        .find('tr')
        .find('td')
        .at(0)
        .find('button')
        .at(3)
      button.simulate('click')
      setTimeout(() => {
        expect(getAssistantEnginesByFiling).toHaveBeenCalled()
        expect(getAssistantEnginesByFiling()).resolves.toEqual(mockEngines)
        done()
      }, 0)
    })

    it('should show the payments when clicked on "Ver filings" button', (done) => {
      const mockPayments = [
        {
          id: '12421412512351235',
          tax_year: '2022',
          product_plan: 'estandar',
          payment_status: 'approved',
          due_date: '2022-12-12',
          created_at: '2022-12-12t',
          updated_at: '2022-12-12',
          status: 'active',
          change_status_at: '',
        },
      ]

      getAssistantPaymentsByFiling.mockResolvedValue(mockPayments)

      const assistantState = {
        showUsers: false,
        showPersons: false,
        showFilings: true,
        showingFilings: false,
      }

      const regStore = {
        assistantFilingsByPerson: [
          {
            id: '12421412512351235',
            tax_year: '2022',
            product_plan: 'estandar',
            payment_status: 'approved',
            due_date: '2022-12-12',
            created_at: '2022-12-12',
            updated_at: '2022-12-12',
            is_active: true,
            dian_credential: {
              national_id_kind: 'cedula_de_ciudadania',
              national_id: '131241',
              password: 'mocked',
            },
          },
        ],
      }
      const { wrapper } = setup({}, assistantState, regStore)
      const table = wrapper.find('table')
      const button = table
        .find('tbody')
        .find('tr')
        .find('td')
        .at(0)
        .find('button')
        .at(4)
      button.simulate('click')
      setTimeout(() => {
        expect(getAssistantPaymentsByFiling).toHaveBeenCalled()
        expect(getAssistantPaymentsByFiling()).resolves.toEqual(mockPayments)
        done()
      }, 0)
    })

    it('should open filing in onboarding when clicked on "Editar" button', (done) => {
      const assistantState = {
        showUsers: false,
        showPersons: false,
        showFilings: true,
        showingFilings: false,
      }

      const regStore = {
        assistantFilingsByPerson: [
          {
            id: '12421412512351235',
            tax_year: '2022',
            product_plan: 'estandar',
            payment_status: 'approved',
            due_date: '2022-12-12',
            created_at: '2022-12-12',
            updated_at: '2022-12-12',
            is_active: true,
            change_status_at: '',
            dian_credential: {
              national_id_kind: 'cedula_de_ciudadania',
              national_id: '131241',
              password: 'mocked',
            },
            owner: {
              email: 'mock.doe@test.com',
            },
          },
        ],
      }
      const { wrapper } = setup({}, assistantState, regStore)
      const table = wrapper.find('table')
      const button = table
        .find('tbody')
        .find('tr')
        .find('td')
        .at(0)
        .find('button')
        .at(0)
      button.simulate('click')
      setTimeout(() => {
        expect(setCurrentFilingById).toHaveBeenCalled()
        expect(setCurrentFilingById).toHaveBeenCalledWith(
          regStore.assistantFilingsByPerson[0].id,
          false,
          true
        )
        done()
      }, 0)
    })
  })

  describe('Documents table test', () => {
    it('should get firebase status document when clicked on "Consultar estado en navegador"', async () => {
      const mockDocs = [
        {
          id: '12421412512351235',
          document_description: 'Rut',
          created_at: '2022-12-12',
          status: 'approved',
          firebase_status: 'approved',
          read_status: 'aprobado',
          desactivated_at: '2022-12-12',
          cert_file: 'link',
        },
      ]

      getFirebaseDocumentStatus.mockResolvedValue(mockDocs)

      const assistantState = {
        showUsers: false,
        showPersons: false,
        showFilings: false,
        showDocuments: true,
        showingFilings: false,
      }

      const regStore = {
        assistantDocumentsByFiling: mockDocuments,
      }

      const { wrapper } = setup({}, assistantState, regStore)
      const buttonFirebase = wrapper
        .find('table')
        .find('tbody')
        .find('tr')
        .at(1)
        .find('td')
        .at(1)
        .find('button')
      buttonFirebase.simulate('click')

      await expect(getFirebaseDocumentStatus()).resolves.toEqual(mockDocs)
    })

    it('should expand and collapse document rows when clicked on button to expand and collapse row', () => {
      const assistantState = {
        showUsers: false,
        showPersons: false,
        showFilings: false,
        showDocuments: true,
        showingFilings: false,
      }

      const regStore = {
        assistantDocumentsByFiling: mockDocuments,
      }

      const { wrapper } = setup({}, assistantState, regStore)

      // Initial state of rows
      const buttonExpandable = wrapper
        .find('table')
        .find('tbody')
        .find('tr')
        .at(1)
        .find('td')
        .at(0)
        .find('button')
      expect(wrapper.find('table').find('tbody').find('tr')).toHaveLength(4)
      buttonExpandable.simulate('click')
      wrapper.update()

      // should expanded one row
      expect(wrapper.find('table').find('tbody').find('tr')).toHaveLength(5)

      // Collapse
      const buttonCollapse = wrapper
        .find('table')
        .find('tbody')
        .find('tr')
        .at(1)
        .find('td')
        .at(0)
        .find('button')
      buttonCollapse.simulate('click')
      wrapper.update()
      // shoul collapsed one row
      expect(wrapper.find('table').find('tbody').find('tr')).toHaveLength(4)
    })

    it('should download document"', async () => {
      const assistantState = {
        showUsers: false,
        showPersons: false,
        showFilings: false,
        showDocuments: true,
        showingFilings: false,
      }

      const regStore = {
        assistantDocumentsByFiling: mockDocuments,
      }

      const { wrapper } = setup({}, assistantState, regStore)
      const link = wrapper
        .find('table')
        .find('tbody')
        .find('tr')
        .at(1)
        .find('td')
        .at(8)
        .find('a')

      const windowSpy = jest
        .spyOn(window, 'addEventListener')
        .mockImplementation(() => {})
      link.simulate('click')
      expect(windowSpy).toBeCalled()
    })

    it('should cancel document load when clicked on "Cancelar carga"', async () => {
      const idDocMock = '12421412512351235'
      cancelFileUpload.mockResolvedValue(idDocMock)

      const assistantState = {
        showUsers: false,
        showPersons: false,
        showFilings: false,
        showDocuments: true,
        showingFilings: false,
      }

      const regStore = {
        assistantDocumentsByFiling: mockDocuments,
      }

      const { wrapper } = setup({}, assistantState, regStore)
      const buttonFirebase = wrapper
        .find('table')
        .find('tbody')
        .find('tr')
        .at(0)
        .find('td')
        .at(1)
        .find('button')
        .at(0)
      buttonFirebase.simulate('click')

      await expect(cancelFileUpload()).resolves.toEqual(idDocMock)
    })
  })

  /**
   * TODO: fill payment-ref to get validate with changeOrderStatus action.
   * Now; the modal.confirm have a form with an input ref. but this is mounted in the document.body.
   * for that it's difficult fill the input to pass forms validations for the submit action
   *  */
  describe('Payments Table test', () => {
    it('should approve/cancel payments', async () => {
      const mockPayments = [
        {
          id: '12421412512351235',
          status: 'created',
          payment_method: '',
          coupon_code: '2022',
          coupon_percent: '10',
          discount_by_referrals: '',
          due_date: '2022-12-12',
          amount: '100000',
        },
      ]

      setAssistantLocalState.mockResolvedValue(mockPayments)

      const assistantState = {
        showUsers: false,
        showPersons: false,
        showFilings: false,
        showingFilings: false,
        showDocuments: false,
        showPayments: true,
      }

      const regStore = {
        assistantPaymentsByFiling: [
          {
            id: '12421412512351235',
            status: 'created',
            payment_method: '',
            coupon_code: '2022',
            coupon_percent: '10',
            discount_by_referrals: '',
            due_date: '2022-12-12',
            amount: '100000',
          },
        ],
      }

      let wrapper
      await act(async () => {
        const { wrapper: wp } = setup({}, assistantState, regStore)
        wrapper = wp
      })

      const button = wrapper
        .find('table')
        .find('tbody')
        .find('tr')
        .find('td')
        .at(0)
        .find('button')

      await act(async () => {
        await button.simulate('click')
      })
      wrapper.update()

      document.querySelector(
        '.ant-form-item-control-input-content span'
      ).firstChild.value = '12345'

      expect(
        document.querySelector('.ant-form-item-control-input-content span')
          .firstChild.value
      ).toBe('12345')
      document
        .querySelector('.ant-modal-confirm-btns > .ant-btn-primary')
        .click()
      expect(setAssistantLocalState).toBeCalled()
    })
  })

  describe('Filings by user table test', () => {
    it('should show users table when clicked on "Usuario" button', async () => {
      const mockLocalState = {
        assistantUsers: [
          {
            email: 'test@email.com',
            national_id: '1212121212',
          },
        ],
        currentLocation: {},
        currentUser: {
          email: 'test@email.com',
          national_id: '1212121212',
        },
        searching: true,
        showDocuments: false,
        showEngines: false,
        showFilingByUser: false,
        showFilings: false,
        showPayments: false,
        showPersons: false,
        showUsers: true,
      }

      const localState = {
        showFilingByUser: true,
      }

      const regStore = {
        assistantFilingsByUser: [
          {
            id: '12421412512351235',
            tax_year: '2022',
            product_plan: 'estandar',
            payment_status: 'approved',
            due_date: '2022-12-12',
            created_at: '2022-12-12t',
            updated_at: '2022-12-12',
            status: 'active',
            change_status_at: '',
            dian_credential: {
              national_id_kind: 'cedula_de_ciudadania',
              national_id: '131241',
              password: 'mocked',
            },
            owner: {
              email: 'test@email.com',
              national_id: '1212121212',
            },
            person: {
              first_name: 'mocked',
              last_name: 'mocked',
              document_id: 'some-id',
            },
          },
        ],
      }

      const { wrapper } = setup({}, localState, regStore)
      const buttonPerson = wrapper
        .find('table')
        .find('tbody')
        .find('tr')
        .find('td')
        .at(1)
        .find('button')
        .at(0)
      buttonPerson.simulate('click')

      await expect(setAssistantLocalState).toHaveBeenCalled()
      await expect(setAssistantLocalState).toHaveBeenCalledWith(mockLocalState)
    })

    it('should show persons table when clicked on "Persona" button', async () => {
      const mockLocalState = {
        assistantPersons: [
          {
            document_id: 'some-id',
            first_name: 'mocked',
            last_name: 'mocked',
          },
        ],
        currentUser: {
          email: 'test@email.com',
          national_id: '1212121212',
        },
        showFilingByUser: false,
        showFilings: false,
        showPersons: true,
        showPersonsFromFiling: true,
        showUsers: false,
        showingFilings: true,
      }

      const localState = {
        showFilingByUser: true,
      }

      const regStore = {
        assistantFilingsByUser: [
          {
            id: '12421412512351235',
            tax_year: '2022',
            product_plan: 'estandar',
            payment_status: 'approved',
            due_date: '2022-12-12',
            created_at: '2022-12-12t',
            updated_at: '2022-12-12',
            status: 'active',
            change_status_at: '',
            dian_credential: {
              national_id_kind: 'cedula_de_ciudadania',
              national_id: '131241',
              password: 'mocked',
            },
            owner: {
              email: 'test@email.com',
              national_id: '1212121212',
            },
            person: {
              first_name: 'mocked',
              last_name: 'mocked',
              document_id: 'some-id',
            },
          },
        ],
      }

      const { wrapper } = setup({}, localState, regStore)
      const buttonPerson = wrapper
        .find('table')
        .find('tbody')
        .find('tr')
        .find('td')
        .at(1)
        .find('button')
        .at(1)
      buttonPerson.simulate('click')

      await expect(setAssistantLocalState).toHaveBeenCalled()
      await expect(setAssistantLocalState).toHaveBeenCalledWith(mockLocalState)
    })
  })

  describe('<LocationBar> tests', () => {
    it('should render properly the <LocationBar/>', () => {
      const assistantState = {
        location: 'users',
        showUsers: true,
        currentUsers: [
          {
            id: '12321312312',
            first_name: 'maria',
          },
        ],
        currentLocation: { location: 'users' },
      }
      const { wrapper } = setupWithProvider({}, assistantState)
      expect(wrapper.find(LocationBar)).toBeDefined()
    })

    it('should change path of LocationBar when search person', () => {
      const assistantState = {
        location: 'Usuarios',
        showUsers: true,
        currentUser: {
          first_name: 'Name',
          last_name: 'Last',
          phone: '+573216369285',
        },
        currentLocation: { location: 'persons', goBack: false },
        emailOrId: { param: 'email', text: 'test@test.com' },
      }
      const { wrapper } = setupWithProvider({}, assistantState)
      expect(wrapper.find(LocationBar)).toBeDefined()
    })

    it('should change path of LocationBar when go back search person', () => {
      const assistantState = {
        location: 'Usuarios',
        showUsers: true,
        currentUser: {
          first_name: 'Name',
          last_name: 'Last',
          phone: '+573216369285',
        },
        currentLocation: { location: 'persons', goBack: true },
        emailOrId: { param: 'email', text: 'test@test.com' },
      }
      const { wrapper } = setupWithProvider({}, assistantState)
      expect(wrapper.find(LocationBar)).toBeDefined()
    })

    it('should change path of LocationBar when search filing', () => {
      const assistantState = {
        location: 'Usuarios',
        showUsers: true,
        currentUser: {
          first_name: 'Name',
          last_name: 'Last',
          phone: '+573216369285',
        },
        currentLocation: { location: 'filings', goBack: false },
        emailOrId: { param: 'email', text: 'test@test.com' },
      }
      const { wrapper } = setupWithProvider({}, assistantState)
      expect(wrapper.find(LocationBar)).toBeDefined()
    })

    it('should change path of LocationBar when go back search filing', () => {
      const assistantState = {
        location: 'Usuarios',
        showUsers: true,
        currentUser: {
          first_name: 'Name',
          last_name: 'Last',
          phone: '+573216369285',
        },
        currentLocation: { location: 'filings', goBack: true },
        emailOrId: { param: 'email', text: 'test@test.com' },
      }
      const { wrapper } = setupWithProvider({}, assistantState)
      expect(wrapper.find(LocationBar)).toBeDefined()
    })

    it('should change path of LocationBar when search engines', () => {
      const assistantState = {
        location: 'Usuarios',
        showUsers: true,
        currentUser: {
          first_name: 'Name',
          last_name: 'Last',
          phone: '+573216369285',
        },
        currentLocation: { location: 'engines', goBack: false },
        emailOrId: { param: 'email', text: 'test@test.com' },
      }
      const { wrapper } = setupWithProvider({}, assistantState)
      expect(wrapper.find(LocationBar)).toBeDefined()
    })
  })

  describe('Dian credentials table test', () => {
    it('should render properly', () => {
      const localState = {
        showDianCredentials: true,
      }

      const regStore = {
        assistantDianCredentials: [
          {
            id: '2022-02-03T05:13:36.934022Z',
            created_at: '2022-02-03T05:13:36.934022Z',
            aranea_status: 'failed',
            credential_status: null,
            dian_credential: {
              national_id: '1128472540',
              national_id_kind: 1,
              password: 'Maria123',
            },
            dian_files: null,
            deleted: '2022-02-03T05:14:39.844754Z',
          },
        ],
      }
      const { wrapper } = setup({}, localState, regStore)
      const table = wrapper.find('table')
      expect(table.find('th')).toHaveLength(5)
      expect(table.find('tbody').find('tr')).toHaveLength(1)
      expect(table.find('tbody').find('tr').find('td')).toHaveLength(5)
    })

    it('should download file', () => {
      const localState = {
        showDianCredentials: true,
      }

      const regStore = {
        assistantDianCredentials: [
          {
            id: '2022-02-03T05:13:36.934022Z',
            created_at: '2022-02-03T05:13:36.934022Z',
            aranea_status: 'failed',
            credential_status: null,
            dian_credential: {
              national_id: '1128472540',
              national_id_kind: 1,
              password: 'Maria123',
            },
            dian_files: 'https://files.zip',
            deleted: '2022-02-03T05:14:39.844754Z',
          },
        ],
      }
      const { wrapper } = setup({}, localState, regStore)
      const link = wrapper
        .find('table')
        .find('tbody')
        .find('tr')
        .find('td')
        .at(4)
        .find('a')

      const windowSpy = jest.spyOn(window, 'open').mockImplementation(() => {})
      link.simulate('click')
      expect(windowSpy).toBeCalled()
    })
  })

  describe('Payment refund table test', () => {
    it('should show the button to payment refund when payment order status has approved', () => {
      const localState = {
        showPayments: true,
      }

      const regStore = {
        assistantPaymentsByFiling: [
          {
            id: '12421412512351235',
            status: 'approved',
            payment_method: '',
            coupon_code: '2022',
            coupon_percent: '10',
            discount_by_referrals: '',
            due_date: '2022-12-12',
            amount: '100000',
          },
        ],
      }

      const { wrapper } = setup({}, localState, regStore)
      expect(
        wrapper
          .find('table')
          .find('tbody')
          .find('tr')
          .find('td')
          .at(0)
          .find('button')
          .at(0)
          .text()
      ).toBe('Reembolsar')
    })

    it('should show form when clicked on "Reembolsar" button', async () => {
      const localState = {
        showPayments: true,
      }

      const regStore = {
        assistantPaymentsByFiling: [
          {
            id: '12421412512351235',
            status: 'approved',
            payment_method: '',
            coupon_code: '2022',
            coupon_percent: '10',
            discount_by_referrals: '',
            due_date: '2022-12-12',
            amount: '100000',
          },
        ],
      }

      let wrapper
      await act(async () => {
        const { wrapper: wp } = await setup({}, localState, regStore)
        wrapper = wp
      })
      wrapper.update()

      const button = wrapper
        .find('table')
        .find('tbody')
        .find('tr')
        .find('td')
        .at(0)
        .find('button')
        .at(0)

      act(() => {
        button.simulate('click')
      })
      wrapper.update()

      expect(setAssistantLocalState).toBeCalled()
      expect(setAssistantLocalState).toBeCalledWith({
        currentPaymentOrder: {
          id: '12421412512351235',
          status: 'approved',
          payment_method: '',
          coupon_code: '2022',
          coupon_percent: '10',
          discount_by_referrals: '',
          due_date: '2022-12-12',
          amount: '100000',
        },
        showPaymentRefund: true,
      })
      expect(wrapper.find(PaymentRefundForm)).toBeDefined()
    })

    it('should call to payment refund action when submit form payment refund', async () => {
      const localState = {
        currentPaymentOrder: {
          id: '12421412512351235',
          status: 'approved',
          payment_method: '',
          coupon_code: '2022',
          coupon_percent: '10',
          discount_by_referrals: '',
          due_date: '2022-12-12',
          amount: '100000',
        },
        showPaymentRefund: true,
        currentFiling: {
          id: '123214125135135',
        },
      }

      let wrapper
      await act(async () => {
        const { wrapper: wp } = await setup({}, localState)
        wrapper = wp
      })
      wrapper.update()

      const select = wrapper.find(PaymentRefundForm).find(Select)
      const buttonSubmit = wrapper.find(PaymentRefundForm).find('button').at(1)

      select.props().onChange({ target: { value: 1 } })
      wrapper.update()

      await act(async () => {
        await buttonSubmit.simulate('submit')
      })
      wrapper.update()

      expect(wrapper.find(PaymentRefundForm).find(Select).text()).toBe(
        'Inconformidad con la plataforma'
      )
      expect(assistantRefundPayment).toBeCalled()
      expect(assistantRefundPayment).toBeCalledWith(
        '12421412512351235',
        { details: 'Inconformidad con la plataforma' },
        '123214125135135'
      )
    })

    it('should show the payment refund table clicked on "Ver solicitud de reembolso" button', async () => {
      const localState = {
        showPayments: true,
        showRequestRefundPayment: true,
      }

      const regStore = {
        assistantPaymentsByFiling: [
          {
            id: '12421412512351235',
            status: 'cancelled',
            payment_method: '',
            coupon_code: '2022',
            coupon_percent: '10',
            discount_by_referrals: '',
            due_date: '2022-12-12',
            amount: '100000',
            refund_id: '123124',
          },
        ],
        assistantRequestRefundPayments: [
          {
            id: '12421412512351235',
            created_at: '2022-12-12',
            details: 'Detail of payment refund',
            status: 'pending',
            updated_at: '2022-12-12',
          },
        ],
      }

      let wrapper
      await act(async () => {
        const { wrapper: wp } = await setup({}, localState, regStore)
        wrapper = wp
      })
      wrapper.update()

      const button = wrapper
        .find('table')
        .find('tbody')
        .find('tr')
        .find('td')
        .at(0)
        .find('button')

      await act(async () => {
        await button.simulate('click')
      })
      wrapper.update()

      expect(getAssistantRequestRefundPayment).toBeCalled()
      expect(getAssistantRequestRefundPayment).toBeCalledWith('123124', {
        currentLocation: { goBack: false, location: 'refund' },
        showPayments: false,
        showRequestRefundPayment: true,
      })
      expect(
        wrapper.find('table').at(1).find('tbody').find('tr').find('td')
      ).toHaveLength(4)
    })
  })
})
