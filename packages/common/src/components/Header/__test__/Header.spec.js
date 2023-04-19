import React from 'react'
import moment from 'moment'
import { act, fireEvent } from '@testing-library/react'
import {
  themeProvider,
  rootContextProvider,
  reduxProvider,
  routerProvider,
  mockWithProviders,
} from '../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'
import Header from '../Header'
import { ROLES } from '../../../constants/person'
import { DATE_FORMAT_DASHED } from '../../../constants/strings'
import {
  PLAN_STANDARD,
  TAX_YEAR_PLAN_PRO_FROM,
} from '../../../constants/general'
import { CARDIF } from '../../../constants/subdomains'
import { PersonForm } from '../../PersonForm'

const mockUseLocationValue = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
}
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockImplementation(() => {
    return mockUseLocationValue
  }),
}))

jest.mock('../../PersonForm', () => ({
  DrawerPerson: ({ children }) => children,
  PersonForm: jest.fn(() => <div data-testid="person-form" />),
  FORM_CONTROLS: {},
}))

jest.mock('../../../helpers/collections', () => {
  const actualModule = jest.requireActual('../../../helpers/collections')
  return {
    ...actualModule,
    // this mock is to bypass the `onboarding` route
    currentRoute: () => 'onboarding',
  }
})

const setup = (
  initialProps = {},
  personalInfo = {},
  contextInfo = undefined
) => {
  const props = {
    history: {
      push: jest.fn(),
      replace: jest.fn(),
    },
    isSummaryTabActive: false,
    location: { pathname: '' },
    logout: jest.fn(),
    modifyPerson: jest.fn(),
    ...initialProps,
  }

  const store = overwriteStore({
    personalInfo,
  })

  const wrapper = mockWithProviders(<Header {...props} />, [
    themeProvider(),
    rootContextProvider(contextInfo),
    reduxProvider(store),
    routerProvider(),
  ])

  const openDrawer = () => {
    const menuButton = wrapper.queryByTestId('header-menu-button')
    fireEvent.click(menuButton)
  }

  const getDrawer = () => wrapper.queryByTestId('header-drawer')

  return { wrapper, props, openDrawer, getDrawer }
}

describe('<HeaderComponent /> specs', () => {
  it('should not render header content when `isAuthenticated` and `isRegistered` are false', () => {
    const { wrapper } = setup({
      isAuthenticated: false,
      isRegistered: false,
    })

    const headerWrapper = wrapper.queryByTestId('header-wrapper')
    expect(wrapper.container.childElementCount).toBe(0)
    expect(headerWrapper).not.toBeInTheDocument()
  })

  it('should render header content when `isAuthenticated` is true', () => {
    const { wrapper } = setup({
      isAuthenticated: true,
    })

    const headerWrapper = wrapper.queryByTestId('header-wrapper')
    expect(wrapper.container.childElementCount).not.toBe(0)
    expect(headerWrapper).toBeInTheDocument()
  })

  it('should render drawer when `menu` button is clicked', () => {
    const { openDrawer, getDrawer } = setup({
      isAuthenticated: true,
    })

    expect(getDrawer()).not.toBeInTheDocument()
    openDrawer()
    expect(getDrawer()).toBeInTheDocument()
  })

  it('should render `Declaración Actual` when a filing is defined', () => {
    const mockFiling = {
      id: 'testing-id',
    }
    mockUseLocationValue.pathname = '/filings'
    const { openDrawer, wrapper } = setup(
      {
        isAuthenticated: true,
      },
      {
        role: ROLES.TAX_FILER,
        currentFiling: mockFiling,
      },
      null
    )

    openDrawer()

    mockUseLocationValue.pathname = '/'
    const currentFilingLink = wrapper.queryByText('Declaración actual')
    expect(currentFilingLink).toBeInTheDocument()
  })

  it('should not render `Declaración Actual` when a filing is not defined', () => {
    const { openDrawer, wrapper } = setup(
      {
        isAuthenticated: true,
      },
      {
        role: ROLES.TAX_FILER,
        currentFiling: null,
      },
      null
    )

    openDrawer()

    const currentFilingLink = wrapper.queryByText('Declaración actual')
    expect(currentFilingLink).not.toBeInTheDocument()
  })

  it('should render `Cerrar sesión` item', () => {
    const { openDrawer, wrapper } = setup({
      isAuthenticated: true,
    })

    openDrawer()

    const signOutLink = wrapper.queryByText('Cerrar sesión')
    expect(signOutLink).toBeInTheDocument()
  })

  describe('co-branding specs', () => {
    it('should render tributi logos only when co-branding is not in context', () => {
      const { wrapper } = setup({
        isAuthenticated: true,
      })

      const tributiLogo = wrapper.queryByAltText('Logo Tributi')
      expect(tributiLogo).toBeInTheDocument()
      expect(tributiLogo.parentElement.childElementCount).toBe(1)
    })

    it('should render logos when co-branding is in context', () => {
      const TEST_SUBDOMAIN = 'Test'
      const TEST_IMAGE = 'https://test.com/image.png'
      const { wrapper } = setup(
        {
          isAuthenticated: true,
        },
        undefined,
        {
          subdomainConfig: {
            image: TEST_IMAGE,
            key: TEST_SUBDOMAIN,
          },
        }
      )

      const tributiLogo = wrapper.queryByAltText('Logo Tributi')
      const testLogo = wrapper.queryByAltText(`Logo ${TEST_SUBDOMAIN}`)
      expect(tributiLogo).toBeInTheDocument()
      expect(testLogo).toBeInTheDocument()
      expect(testLogo).toHaveAttribute('src', TEST_IMAGE)
      // expect 3 elements, 2 images and the span separator
      expect(tributiLogo.parentElement.childElementCount).toBe(3)
    })
  })

  describe('header banner specs', () => {
    it('should not render any banner button when role is assistant', () => {
      const { wrapper } = setup(
        {
          isAuthenticated: true,
        },
        {
          role: ROLES.ASSISTANT,
        }
      )
      // should find only menu button
      const buttons = wrapper.container.querySelectorAll('button')
      expect(buttons).toHaveLength(1)
    })

    it('should not render any banner button when co-branding is cardiff', () => {
      const { wrapper } = setup(
        {
          isAuthenticated: true,
        },
        {
          role: ROLES.TAX_FILER,
        },
        {
          subdomainConfig: {
            image: 'https://cardif.com/image.png',
            key: CARDIF,
          },
        }
      )
      // should find only menu button
      const buttons = wrapper.container.querySelectorAll('button')
      expect(buttons).toHaveLength(1)
    })

    it('should render `upgrade to express` banner button when conditions are met', () => {
      const { wrapper } = setup(
        {
          isAuthenticated: true,
          isSummaryTabActive: true,
          isPaymentElegible: true,
        },
        {
          currentFiling: {
            id: 'test-id',
            due_date: moment().add(1, 'day').format(DATE_FORMAT_DASHED),
            product_plan: {
              name: PLAN_STANDARD,
            },
            tax_year: TAX_YEAR_PLAN_PRO_FROM,
          },
          role: ROLES.TAX_FILER,
        }
      )

      const buttons = wrapper.container.querySelectorAll('button')
      const upgradeExpress = wrapper.queryByText('⭐️ Cambiar Plan Exprés')
      // also includes invite friends and menu button
      expect(buttons).toHaveLength(3)
      expect(upgradeExpress).toBeInTheDocument()
    })

    it('should render `upgrade to pro` banner button when conditions are met', () => {
      const { wrapper } = setup(
        {
          isAuthenticated: true,
          isPaymentElegible: true,
        },
        {
          currentFiling: {
            id: 'test-id',
            due_date: moment().add(10, 'day').format(DATE_FORMAT_DASHED),
            product_plan: {
              name: PLAN_STANDARD,
            },
            tax_year: TAX_YEAR_PLAN_PRO_FROM,
          },
          role: ROLES.TAX_FILER,
        }
      )

      const buttons = wrapper.container.querySelectorAll('button')
      const upgradePro = wrapper.queryByText(
        '¡Ayuda! Quiero que un contador haga todo por mí'
      )
      // also includes invite friends and menu button
      expect(buttons).toHaveLength(3)
      expect(upgradePro).toBeInTheDocument()
    })

    it('should render `invite friends` banner button when there is no other banner button', () => {
      const { wrapper } = setup(
        {
          isAuthenticated: true,
          isSummaryTabActive: false,
          isPaymentElegible: true,
        },
        {
          currentFiling: {
            id: 'test-id',
            due_date: moment().add(1, 'day').format(DATE_FORMAT_DASHED),
            product_plan: {
              name: PLAN_STANDARD,
            },
            tax_year: TAX_YEAR_PLAN_PRO_FROM,
          },
          role: ROLES.TAX_FILER,
        }
      )

      const buttons = wrapper.container.querySelectorAll('button')
      const inviteFriends = wrapper.queryByText(
        'Gana $30.000 por cada referido'
      )
      // also includes menu button
      expect(buttons).toHaveLength(2)
      expect(inviteFriends).toBeInTheDocument()
    })

    it('should not render invite Friends button when isPaymentElegible is false', () => {
      const { wrapper } = setup(
        {
          isAuthenticated: true,
          isSummaryTabActive: false,
          isPaymentElegible: false,
        },
        {
          currentFiling: {
            id: 'test-id',
            due_date: moment().add(1, 'day').format(DATE_FORMAT_DASHED),
            product_plan: {
              name: PLAN_STANDARD,
            },
            tax_year: TAX_YEAR_PLAN_PRO_FROM,
          },
          role: ROLES.TAX_FILER,
        }
      )

      const buttons = wrapper.container.querySelectorAll('button')
      expect(buttons).toHaveLength(1)
      expect(wrapper.queryByText('Gana $30.000 por cada referido')).toBeNull()
    })
  })

  describe('assistant specs', () => {
    it('should render `Vista de asistentes` item', () => {
      const { openDrawer, wrapper } = setup(
        {
          isAuthenticated: true,
        },
        {
          role: ROLES.ASSISTANT,
          currentFiling: null,
        }
      )

      openDrawer()

      const assistantViewLink = wrapper.queryByText('Vista de asistentes')
      expect(assistantViewLink).toBeInTheDocument()
    })

    it('should not render `Ir a tributi.com` item', () => {
      const { openDrawer, wrapper } = setup(
        {
          isAuthenticated: true,
        },
        {
          role: ROLES.ASSISTANT,
          currentFiling: null,
        }
      )

      openDrawer()

      const gotoTributiLink = wrapper.queryByText('Ir a tributi.com')
      expect(gotoTributiLink).not.toBeInTheDocument()
    })
  })

  describe('tax filer specs', () => {
    it('should not render `Vista de asistentes` item', () => {
      const { openDrawer, wrapper } = setup(
        {
          isAuthenticated: true,
        },
        {
          role: ROLES.TAX_FILER,
          currentFiling: null,
        }
      )

      openDrawer()

      const assistantViewLink = wrapper.queryByText('Vista de asistentes')
      expect(assistantViewLink).not.toBeInTheDocument()
    })

    it('should render `Ir a tributi.com` item', () => {
      const { openDrawer, wrapper } = setup(
        {
          isAuthenticated: true,
        },
        {
          role: ROLES.TAX_FILER,
          currentFiling: null,
        }
      )

      openDrawer()

      const gotoTributiLink = wrapper.queryByText('Ir a tributi.com')
      expect(gotoTributiLink).toBeInTheDocument()
    })

    it('should not render `Mi Cuenta` item', () => {
      const { openDrawer, wrapper } = setup(
        {
          isAuthenticated: true,
        },
        {
          role: ROLES.TAX_FILER,
          currentFiling: null,
        }
      )

      openDrawer()

      const myAccount = wrapper.queryByText('Mi cuenta')
      expect(myAccount).not.toBeInTheDocument()
    })
  })

  describe('accountant specs', () => {
    it('should render `Mi cuenta` item', () => {
      const { openDrawer, wrapper } = setup(
        {
          isAuthenticated: true,
        },
        {
          role: ROLES.ACCOUNTANT,
          currentFiling: null,
        },
        {
          isAccountantApp: true,
        }
      )

      openDrawer()

      const myAccount = wrapper.queryByText('Mi cuenta')
      expect(myAccount).toBeInTheDocument()
    })

    it('should open person form when click on `Mi cuenta` item, and call `modifyPerson` on submit', async () => {
      const { openDrawer, wrapper, props } = setup(
        {
          isAuthenticated: true,
        },
        {
          role: ROLES.ACCOUNTANT,
          currentFiling: null,
        },
        {
          isAccountantApp: true,
        }
      )
      const { modifyPerson } = props
      modifyPerson.mockResolvedValue({})

      openDrawer()

      const myAccount = wrapper.queryByText('Mi cuenta')
      fireEvent.click(myAccount)

      const personForm = wrapper.queryByTestId('person-form')
      expect(personForm).toBeInTheDocument()

      const [personFormProps] = PersonForm.mock.lastCall
      const { onSubmit } = personFormProps
      await act(async () => {
        onSubmit({})
      })

      expect(modifyPerson).toHaveBeenCalled()
    })
  })
})
