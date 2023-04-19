import React from 'react'
import Modal from 'antd/lib/modal'
import { act, fireEvent } from '@testing-library/react'

import {
  mockWithProviders,
  reduxProvider,
  rootContextProvider,
  routerProvider,
  themeProvider,
} from '../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'
import { ROLES } from '../../../constants/person'
import { FORM_CONTROLS } from '../../../components/PersonForm'
import useFilings from '../useFilings'
import Filings from '../content'

const { FORM_CONTROL_NAME } = FORM_CONTROLS

const mockFilingConfig = {
  Header: jest.fn().mockReturnValue(<div id="Header" />),
  Filters: jest.fn().mockReturnValue(<div id="Filters" />),
  Table: jest.fn().mockReturnValue(<div id="Table" />),
  Footer: jest.fn().mockReturnValue(<div id="Footer" />),
  formConfig: [],
  loadPersons: jest.fn(),
  handleFormatFilings: jest.fn(),
  handleFilterFilings: jest.fn(),
}

const mockFilingPerson = {
  formVisible: false,
  formData: null,
  onCloseForm: jest.fn(),
  onSubmitForm: jest.fn(),
  onNewPerson: jest.fn(),
  onEditPerson: jest.fn(),
  onDeletePerson: jest.fn(),
}

const mockFilings = {
  onChangePlan: jest.fn(),
  onStartFiling: jest.fn(),
  onContinueFiling: jest.fn(),
  onDeleteFiling: jest.fn(),
  onChangeSubmitStatus: jest.fn(),
}

jest.mock('antd/lib/modal')
jest.mock('../useFilingConfig', () => {
  return {
    __esModule: true,
    default: () => mockFilingConfig,
  }
})

jest.mock('../useFilingPerson', () => {
  return {
    __esModule: true,
    default: () => mockFilingPerson,
  }
})

jest.mock('../useFilings', () => {
  return {
    __esModule: true,
    // default: () => mockFilings,
    default: jest.fn(() => mockFilings),
  }
})

const setup = async (personalInfo, initialProps = {}, reduxStore = {}) => {
  const props = {
    appName: 'test',
    clearMigrateFlags: jest.fn(),
    clearPaymentOrderInfo: jest.fn(),
    ...initialProps,
  }

  const store = overwriteStore({
    ...reduxStore,
    personalInfo,
  })

  const wrapper = mockWithProviders(<Filings {...props} />, [
    reduxProvider(store),
    rootContextProvider({ MAX_TAX_YEAR: 2020 }),
    routerProvider(),
    themeProvider(),
  ])
  return { wrapper, props }
}

describe('<Filing /> component specs', () => {
  const PERSONAL_INFO = { id: 'test-person', role: ROLES.TAX_FILER }

  describe('with coming season', () => {
    const env = process.env

    beforeEach(() => {
      process.env.HAS_COMING_SEASON = 'true'
      process.env.SHOW_NEW_SEASON_MODAL = 'true'
    })

    afterEach(() => {
      jest.resetModules()
      process.env = env
    })

    it('should show modal awareness when comingSoon flag is enabled', async () => {
      await setup(PERSONAL_INFO)
      expect(Modal.warning).toHaveBeenCalled()
    })
  })

  describe('with useFilingConfig hook', () => {
    it('should render Header component with `onCreatePerson` prop', async () => {
      await setup(PERSONAL_INFO)
      expect(mockFilingConfig.Header).toHaveBeenCalledWith(
        {
          onCreatePerson: mockFilingPerson.onNewPerson,
        },
        expect.anything()
      )
    })

    it('should render Filters component with `taxableYearsOptions` and `onFilter` props', async () => {
      await setup(PERSONAL_INFO)
      const props = mockFilingConfig.Filters.mock.calls[0][0]
      expect(props).toHaveProperty('taxableYearsOptions')
      expect(props).toHaveProperty('onFilter')
    })

    it('should render Table component with according props', async () => {
      await setup(PERSONAL_INFO)
      const props = mockFilingConfig.Table.mock.calls[0][0]
      expect(props).toEqual(
        expect.objectContaining({
          onEditPerson: mockFilingPerson.onEditPerson,
          onDeletePerson: mockFilingPerson.onDeletePerson,
          onChangePlan: mockFilings.onChangePlan,
          onStartFiling: mockFilings.onStartFiling,
          onContinueFiling: mockFilings.onContinueFiling,
          onDeleteFiling: mockFilings.onDeleteFiling,
          onChangeSubmitStatus: mockFilings.onChangeSubmitStatus,
        })
      )
    })

    it('should render Footer component with `onCreatePerson` prop', async () => {
      await setup(PERSONAL_INFO)
      expect(mockFilingConfig.Footer).toHaveBeenCalledWith(
        expect.objectContaining({
          onCreatePerson: mockFilingPerson.onNewPerson,
        }),
        expect.anything()
      )
    })

    it('should call `loadPersons` when component renders', async () => {
      expect(mockFilingConfig.loadPersons).not.toHaveBeenCalled()
      await setup(PERSONAL_INFO)
      expect(mockFilingConfig.loadPersons).toHaveBeenCalled()
    })

    it('should not call`handleFilterFilings` when `Filters` component calls `onFilter` and `filingsFiltered` has length equals 0', async () => {
      await setup(PERSONAL_INFO, undefined, {
        filings: {
          filtered: [],
        },
      })

      const props = mockFilingConfig.Filters.mock.calls[0][0]
      await act(async () => {
        props.onFilter()
      })
      expect(mockFilingConfig.handleFilterFilings).not.toHaveBeenCalled()
    })

    it('should call `handleFilterFilings` when `Filters` component calls `onFilter` and `filingsFiltered` has length grater than 0', async () => {
      await setup(PERSONAL_INFO, undefined, {
        filings: {
          // There is no need to have an actual item mocked
          // because no one is going to need it (Table is a mocked component)
          filtered: ['mocked item'],
        },
      })
      const props = mockFilingConfig.Filters.mock.calls[0][0]

      expect(mockFilingConfig.handleFilterFilings).toHaveBeenCalledTimes(1)
      await act(async () => {
        props.onFilter()
      })
      expect(mockFilingConfig.handleFilterFilings).toHaveBeenCalledTimes(2)
    })
  })

  describe('with useFilingPerson hook', () => {
    it('should not show person form when `formVisible` is false', async () => {
      const { wrapper } = await setup(PERSONAL_INFO)
      const title = await wrapper.queryByTestId('person-form-title')
      expect(title).toBeNull()
    })

    it('should show person form when `formVisible` is true', async () => {
      mockFilingPerson.formVisible = true
      const { wrapper } = await setup(PERSONAL_INFO)
      const title = await wrapper.queryByTestId('person-form-title')
      expect(title).not.toBeNull()
    })

    it('it should show person form with data when `formData` has a value', async () => {
      const DATA = {
        first_name: 'testing name',
      }
      mockFilingPerson.formVisible = true
      mockFilingPerson.formData = DATA
      mockFilingConfig.formConfig = [FORM_CONTROL_NAME]
      const { wrapper } = await setup(PERSONAL_INFO)
      const title = await wrapper.queryByTestId('person-form-title')
      expect(title).not.toBeNull()
      const input = title.parentElement.querySelector('input#first_name')
      expect(input.value).toBe(DATA.first_name)
    })

    it('should call `onSubmitForm` when submit person form', async () => {
      const DATA = {
        first_name: 'testing name',
      }
      mockFilingPerson.formVisible = true
      mockFilingPerson.formData = DATA
      mockFilingConfig.formConfig = [FORM_CONTROL_NAME]
      const { wrapper } = await setup(PERSONAL_INFO)
      const title = await wrapper.queryByTestId('person-form-title')
      const submit = title.parentElement.querySelector('button[type="submit"]')
      await act(async () => {
        fireEvent(
          submit,
          new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
          })
        )
      })

      expect(mockFilingPerson.onSubmitForm).toHaveBeenCalled()
    })
  })

  describe('with useFilings hook', () => {
    it('should call `clearPaymentOrderInfo` and `clearMigrateFlags` when `continueFilingSideEffect` is called', async () => {
      const { props } = await setup(PERSONAL_INFO)
      const { continueFilingSideEffect } = useFilings.mock.calls[0][1]
      await act(async () => {
        continueFilingSideEffect()
      })

      expect(props.clearMigrateFlags).toHaveBeenCalled()
      expect(props.clearPaymentOrderInfo).toHaveBeenCalled()
    })
  })
})
