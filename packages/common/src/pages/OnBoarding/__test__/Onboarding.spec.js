/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { Modal } from 'antd'
import { ScriptLoader } from '@tributi-co/core-fe'
import {
  MockWithProvidersLegacy,
  themeProvider,
  routerProvider,
  rootContextProvider,
  reduxProvider,
} from '../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'
import {
  WarningModal,
  Welcome,
  ModalMigrate,
} from '../../../components/OnBoarding'
import { config } from './__mocks__/onboarding-config'
import { ROLES } from '../../../constants/person'
import { MAX_TAX_YEAR } from '../../../constants/filings'
import * as personalInfoActions from '../../../redux/personalInfo/actions'
import Onboarding from '..'

jest.mock('../../../HOC/withLoader', () => ({
  __esModule: true,
  default: (Component) => (props) => <Component {...props} />,
}))

const mockBeforeTabChange = jest.fn()
const mockSetPartialInfo = jest.fn()

jest.mock('../../../redux/onboarding/actions')
jest.mock('@tributi-co/tributi-components', () => ({
  Collapsible({ children }) {
    return <div data-mocked="collapsible">{children}</div>
  },
  Tabs({ onBeforeChangeTab, setPartialInfo }) {
    mockBeforeTabChange.mockImplementation(onBeforeChangeTab)
    mockSetPartialInfo.mockImplementation(setPartialInfo)
    return <div data-mocked="tabs" />
  },
  Button() {
    return <button data-mocked="button" />
  },
  DianWidget() {
    return <div data-mocked="DianWidget" />
  },
  MathopsLoader({ children }) {
    return <div>{children}</div>
  },

  FirebaseService: {
    initialize: jest.fn().mockReturnValue({
      getCollection: jest.fn().mockReturnValue({
        collection: {},
      }),
    }),
  },
  QuestionRenderError() {
    return <div data-mocked="question-render-error" />
  },
}))

const setup = (newStore, overrideContext, baseProps) => {
  const props = {
    checkLastFiling: jest.fn(),
    cleanTaxableYearConfig: jest.fn(),
    getTaxableYearConfig: jest.fn(),
    startLoading: jest.fn(),
    stopLoading: jest.fn(),
    clearTaxEngine: jest.fn(),
    clearMigrate: jest.fn(),
    getMigrationState: jest.fn(),
    context: {
      subdomainConfig: { key: 'default' },
    },
    ...baseProps,
  }
  const actualContext = overrideContext || {
    subdomainConfig: { key: 'default' },
    MAX_TAX_YEAR: 2020,
    showWelcome: true,
  }
  const store = overwriteStore(newStore)
  const wrapper = MockWithProvidersLegacy(<Onboarding {...props} />, mount, [
    themeProvider(),
    routerProvider(),
    rootContextProvider(actualContext),
    reduxProvider(store),
  ])
  return { wrapper, props }
}

describe('<Onboarding />', () => {
  const obReducer = {
    onboardingReducer: {
      config,
    },
  }

  beforeAll(() => {
    jest.spyOn(ScriptLoader.prototype, 'load').mockReturnValue(1)
  })

  it('should render empty if there is no currentFiling', () => {
    const personalInfo = {
      role: ROLES.TAX_FILER,
      currentFiling: null,
    }
    const { wrapper } = setup({ personalInfo })
    expect(wrapper.html()).toBe('')
  })

  describe('tax_filer 2019', () => {
    const PERSONAL_INFO_MOCK = {
      role: ROLES.TAX_FILER,
      currentFiling: {
        tax_year: 2019,
        taxable_kind: 'CO2019_TAXFILING',
        status: 'onboarding',
        id: 'filing-id',
      },
    }

    it('should render properly', () => {
      const { wrapper } = setup({
        ...obReducer,
        personalInfo: PERSONAL_INFO_MOCK,
      })
      expect(wrapper.find(Welcome)).toHaveLength(1)
    })

    it('should start the filing', () => {
      const EXPECTED_RENDERED_TABS = 1
      const { wrapper } = setup({
        ...obReducer,
        personalInfo: PERSONAL_INFO_MOCK,
      })
      act(() => {
        wrapper.find(Welcome).prop('letsStart')()
      })
      wrapper.update()
      expect(wrapper.find('Tabs')).toHaveLength(EXPECTED_RENDERED_TABS)
    })

    it('should redirect to last tab when filing has the proper status', () => {
      const mockPerson = {
        role: ROLES.TAX_FILER,
        currentFiling: {
          tax_year: 2019,
          taxable_kind: 'CO2019_TAXFILING',
          status: 'summary',
          id: 'filing-id',
        },
      }
      const EXPECTED_LAST_TAB_INDEX = 6
      const EXPECTED_RENDERED_TABS = 1
      const { wrapper } = setup({ ...obReducer, personalInfo: mockPerson })
      const tabs = wrapper.find('Tabs')
      expect(tabs).toHaveLength(EXPECTED_RENDERED_TABS)
      expect(tabs.prop('initialTab')).toBe(EXPECTED_LAST_TAB_INDEX)
    })

    it('should render without key', () => {
      const { wrapper } = setup(
        { ...obReducer, personalInfo: PERSONAL_INFO_MOCK },
        { subdomainConfig: {}, showWelcome: true }
      )
      expect(wrapper.find(Welcome)).toHaveLength(1)
    })

    it('should disable tabs if validating personal info is missing something', async () => {
      const REF = {
        current: {
          hasPendingQuestions: jest.fn(),
        },
      }
      const { wrapper } = setup({
        ...obReducer,
        personalInfo: PERSONAL_INFO_MOCK,
      })
      act(() => {
        wrapper.find(Welcome).prop('letsStart')()
      })
      wrapper.update()
      const tabs = wrapper.find('Tabs')
      REF.current.hasPendingQuestions.mockResolvedValueOnce(true)
      await act(async () => {
        await tabs.prop('validatePersonalInfo')(REF, '1.')
      })
      wrapper.update()
      expect(wrapper.find('Tabs').prop('disabled')).toBe(true)
    })
    it('should do nothing validating personal info if the group is not personal', async () => {
      const { wrapper } = setup({
        ...obReducer,
        personalInfo: PERSONAL_INFO_MOCK,
      })
      act(() => {
        wrapper.find(Welcome).prop('letsStart')()
      })
      wrapper.update()
      const tabs = wrapper.find('Tabs')
      await act(async () => {
        await tabs.prop('validatePersonalInfo')(null, '2.')
      })
      wrapper.update()
      expect(wrapper.find('Tabs').prop('disabled')).toBe(false)
    })
  })

  describe('2018 tax_files', () => {
    const PERSONAL_INFO_MOCK = {
      role: ROLES.TAX_FILER,
      currentFiling: {
        country_code: 'CO',
        document_id: '123',
        first_name: 'John',
        last_name: 'Doe',
        person_id: 'test',
        tax_year: 2018,
        taxable_kind: 'CO2019_TAXFILING',
        status: 'onboarding',
        id: 'filing-id',
      },
    }

    it('should WarningModal be visible', () => {
      const { wrapper } = setup({
        ...obReducer,
        personalInfo: PERSONAL_INFO_MOCK,
      })
      act(() => {
        wrapper.find(Welcome).prop('letsStart')()
      })
      wrapper.update()
      expect(wrapper.find(WarningModal).prop('visible')).toBe(true)
    })

    it('should remain in the current filing if click on Keep', () => {
      const { wrapper } = setup({
        ...obReducer,
        personalInfo: PERSONAL_INFO_MOCK,
      })
      act(() => {
        wrapper.find(Welcome).prop('letsStart')()
      })
      wrapper.update()
      const modal = wrapper.find(WarningModal)
      act(() => {
        modal.prop('handleKeep')()
      })
      wrapper.update()
      expect(wrapper.find(WarningModal).prop('visible')).toBe(false)
    })

    it('should remain redirect to next filing if click on continue', async () => {
      const { wrapper, props } = setup({
        ...obReducer,
        personalInfo: PERSONAL_INFO_MOCK,
      })
      const spySetCurrentFiling = jest.spyOn(
        personalInfoActions,
        'setCurrentFiling'
      )
      const filing = {
        country_code: 'CO',
        document_id: '123',
        first_name: 'John',
        last_name: 'Doe',
        person_id: 'test',
        tax_year: MAX_TAX_YEAR,
        taxable_kind: 'CO2019_TAXFILING',
        status: 'onboarding',
        id: 'filing-id',
      }
      act(() => {
        wrapper.find(Welcome).prop('letsStart')()
      })
      const { checkLastFiling } = props
      wrapper.update()
      checkLastFiling.mockResolvedValue(filing)
      const modal = wrapper.find(WarningModal)
      await act(async () => {
        modal.prop('handleGo')()
        await expect(checkLastFiling()).resolves.toEqual(filing)
      })
      expect(checkLastFiling).toBeCalled()
      expect(checkLastFiling).toBeCalledWith({
        countryCode: filing.country_code,
        documentId: filing.document_id,
        firstName: filing.first_name,
        lastName: filing.last_name,
        personId: filing.person_id,
      })

      const updatedState = {
        ...obReducer,
        personalInfo: {
          ...PERSONAL_INFO_MOCK,
          currentFiling: filing,
        },
      }
      const updatedStore = overwriteStore(updatedState)
      wrapper.getWrappingComponent().setProps({ store: updatedStore })
      wrapper.update()

      expect(spySetCurrentFiling).toBeCalledWith(filing)
      expect(wrapper.find(WarningModal).prop('visible')).toBe(false)
      expect(wrapper.find('Tabs')).toHaveLength(0)
    })

    it('should remain not redirect if there is any error in the service', async () => {
      const { wrapper, props } = setup({
        ...obReducer,
        personalInfo: PERSONAL_INFO_MOCK,
      })
      act(() => {
        wrapper.find(Welcome).prop('letsStart')()
      })
      const { checkLastFiling } = props
      wrapper.update()
      checkLastFiling.mockRejectedValue({})
      const modal = wrapper.find(WarningModal)
      await act(async () => {
        modal.prop('handleGo')()
        await expect(checkLastFiling()).rejects.toEqual({})
      })
      wrapper.update()
      expect(wrapper.find('Tabs').key()).toBe('init')
    })
  })

  describe('assistant', () => {
    const PERSONAL_INFO_MOCK = {
      role: ROLES.ASSISTANT,
      currentFiling: {
        tax_year: 2019,
        taxable_kind: 'CO2019_TAXFILING',
        id: 'filing-id',
      },
    }

    it('should show Modal when there is no payment status', () => {
      const spy = jest.spyOn(Modal, 'info')
      const { wrapper } = setup({
        ...obReducer,
        personalInfo: PERSONAL_INFO_MOCK,
      })
      expect(wrapper.find(Welcome)).toHaveLength(1)
      expect(spy).toBeCalled()
    })
  })

  describe('tax_filer 2021', () => {
    const PERSONAL_INFO_MOCK = {
      role: ROLES.TAX_FILER,
      currentFiling: {
        country_code: 'CO',
        document_id: '123',
        first_name: 'John',
        last_name: 'Doe',
        person_id: 'test',
        tax_year: MAX_TAX_YEAR,
        taxable_kind: 'CO2021_TAXFILING',
        status: 'onboarding',
        id: 'filing-id',
      },
    }

    it('should ModalMigrate be visible', () => {
      const filingValidToMigrate = true
      const wasMigrated = null
      const migrationError = false
      const obReducer2021 = {
        onboardingReducer: {
          config,
          filingValidToMigrate,
          wasMigrated,
          migrationError,
        },
      }
      const { wrapper } = setup({
        ...obReducer2021,
        personalInfo: PERSONAL_INFO_MOCK,
      })
      act(() => {
        wrapper.find(Welcome).prop('letsStart')()
      })
      wrapper.update()
      expect(wrapper.find(ModalMigrate).prop('visible')).toBe(true)
    })

    it('should hidden ModalMigrate and start the filing', () => {
      const filingValidToMigrate = true
      const wasMigrated = null
      const migrationError = false
      const obReducer2021 = {
        onboardingReducer: {
          config,
          filingValidToMigrate,
          wasMigrated,
          migrationError,
        },
      }
      const EXPECTED_RENDERED_TABS = 1
      const { wrapper } = setup({
        ...obReducer2021,
        personalInfo: PERSONAL_INFO_MOCK,
      })
      act(() => {
        wrapper.find(Welcome).prop('letsStart')()
      })
      wrapper.update()
      const modal = wrapper.find(ModalMigrate)
      act(() => {
        modal.prop('onCancelPreload')()
      })
      wrapper.update()
      expect(wrapper.find('Tabs')).toHaveLength(EXPECTED_RENDERED_TABS)
    })

    it('should resolve if partial data is false and before change is called', async () => {
      const spy = jest.spyOn(Modal, 'warning')
      const obReducer2021 = {
        onboardingReducer: {
          config,
        },
      }
      const { wrapper } = setup({
        ...obReducer2021,
        personalInfo: PERSONAL_INFO_MOCK,
      })
      act(() => {
        wrapper.find(Welcome).prop('letsStart')()
      })
      await expect(mockBeforeTabChange()).resolves.toBeUndefined()
      expect(spy).not.toBeCalled()
    })

    it('should call Modal when before change is called and there is partial data', async () => {
      const spy = jest.spyOn(Modal, 'warning')
      const obReducer2021 = {
        onboardingReducer: {
          config,
        },
      }
      const { wrapper } = setup({
        ...obReducer2021,
        personalInfo: PERSONAL_INFO_MOCK,
      })
      act(() => {
        wrapper.find(Welcome).prop('letsStart')()
      })
      act(() => {
        mockSetPartialInfo(true)
      })
      let mockOnOk
      spy.mockImplementation(({ onOk }) => {
        mockOnOk = onOk
      })
      act(() => {
        mockBeforeTabChange()
      })
      mockOnOk(jest.fn())
      expect(spy).toBeCalled()
    })
  })
})
