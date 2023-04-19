import React from 'react'
import { mount } from 'enzyme'

import {
  MockWithProvidersLegacy,
  reduxProvider,
  themeProvider,
  rootContextProvider,
  routerProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../../helpers/__mocks__/mock-reducer'
import { getMaxTaxYear } from '../../../../helpers/collections'

import { ROLES } from '../../../../constants/person'
import { STATUS as DOCUMENT_STATUS } from '../../../../constants/documents'
import {
  TAX_YEAR_FOR_LEGACY_DOWNLOAD_PAGE,
  MAX_TAX_YEAR,
} from '../../../../constants/filings'

import { NEXT_REFRESH } from '../constants'
import DownloadPage from '../index'
import { Modal } from 'antd'

jest.useFakeTimers()

jest.mock('../DownloadPage', () => ({
  LegacyDownloadPage: () => <div id="download-page-legacy" />,
  DownloadPage: () => <div id="download-page-new" />,
}))

const setup = (baseProps = {}, baseStore = {}, contexProps = {}) => {
  const props = {
    getFile: jest.fn(),
    goBack: jest.fn(),
    syncDeclaration: jest.fn(),
    flushAranea: jest.fn(),
    getComputedTaxes: jest.fn(),
    clearComputeTaxes: jest.fn(),
    goToElaborate: jest.fn(),
    getTaxFilePayment: jest.fn(),
    clearTaxFilePayment: jest.fn(),
    downloadTaxFile: jest.fn(),
    clearOnboardingMessageToShow: jest.fn(),
    handleSendFilesToUser: jest.fn(),
    ...baseProps,
  }
  const store = overwriteStore(baseStore)
  const wrapper = MockWithProvidersLegacy(<DownloadPage {...props} />, mount, [
    routerProvider(),
    reduxProvider(store),
    themeProvider(),
    rootContextProvider(),
  ])

  return { wrapper, props }
}

describe('<DownloadPage /> specs', () => {
  let events = []

  beforeEach(() => {
    events = []
    global.BroadcastChannel = function () {
      this.addEventListener = (_name, callback) => events.push(callback)
      this.removeEventListener = jest.fn()
      this.postMessage = jest.fn()
    }
  })

  const CURRENT_FILING = {
    id: 'abcd-1234',
    due_date: '2021-01-01',
    is_validate_email: true,
    tax_year:
      getMaxTaxYear() - (MAX_TAX_YEAR - TAX_YEAR_FOR_LEGACY_DOWNLOAD_PAGE),
  }

  it('should render legacy download page if `tax_year` is lower than or equal to `TAX_YEAR_FOR_LEGACY_DOWNLOAD_PAGE` and role is `tax_filer`', () => {
    const { wrapper, props } = setup(
      {},
      {
        personalInfo: {
          role: ROLES.TAX_FILER,
          currentFiling: CURRENT_FILING,
        },
      },
      {
        isPaymentElegible: true,
      }
    )

    expect(CURRENT_FILING.tax_year).toBeLessThanOrEqual(
      TAX_YEAR_FOR_LEGACY_DOWNLOAD_PAGE
    )

    const downloadPage = wrapper.find('#download-page-legacy')
    expect(downloadPage).toHaveLength(1)

    const title = wrapper.find('Title')
    expect(title).toHaveLength(1)
    expect(title.text()).toBe(
      '¡Felicitaciones, tu declaración de renta ya está lista!'
    )

    const subtitle = wrapper.find('Subtitle')
    expect(subtitle).toHaveLength(1)
    expect(subtitle.text()).toBe(
      'Sigue los pasos a continuación para presentar tu declaración de renta:'
    )

    const button = wrapper.find('Button')
    expect(button).toHaveLength(1)
    expect(button.text()).toBe('Editar Declaración')
    button.simulate('click')
    expect(props.goBack).toHaveBeenCalled()
  })

  it('should render legacy download page if `tax_year` is lower than or equal to `TAX_YEAR_FOR_LEGACY_DOWNLOAD_PAGE` and role is `accountant`', () => {
    const { wrapper, props } = setup(
      {},
      {
        personalInfo: {
          role: ROLES.ACCOUNTANT,
          currentFiling: CURRENT_FILING,
        },
      }
    )
    expect(CURRENT_FILING.tax_year).toBeLessThanOrEqual(
      TAX_YEAR_FOR_LEGACY_DOWNLOAD_PAGE
    )
    const downloadPage = wrapper.find('#download-page-legacy')
    expect(downloadPage).toHaveLength(1)

    const title = wrapper.find('Title')
    expect(title).toHaveLength(1)
    expect(title.text()).toBe(
      '¡Felicitaciones, tu declaración de renta ya está lista!'
    )

    const subtitle = wrapper.find('Subtitle')
    expect(subtitle).toHaveLength(0)
  })

  it('should render new download page if `tax_year` is greater than `TAX_YEAR_FOR_LEGACY_DOWNLOAD_PAGE` and role is `tax_filer`', () => {
    const TAX_YEAR = getMaxTaxYear()
    const { wrapper, props } = setup(
      {},
      {
        personalInfo: {
          role: ROLES.TAX_FILER,
          currentFiling: {
            ...CURRENT_FILING,
            tax_year: getMaxTaxYear(),
          },
        },
      }
    )

    expect(TAX_YEAR).toBeGreaterThan(TAX_YEAR_FOR_LEGACY_DOWNLOAD_PAGE)
    const downloadPage = wrapper.find('#download-page-new')
    expect(downloadPage).toHaveLength(1)

    const title = wrapper.find('Title')
    expect(title).toHaveLength(1)
    expect(title.text()).toBe(
      '¡Felicitaciones, tu declaración de renta ya está lista!'
    )

    const subtitle = wrapper.find('Subtitle')
    expect(subtitle).toHaveLength(1)
    expect(subtitle.text()).toBe(
      'Sigue los pasos a continuación para presentar tu declaración de renta:'
    )

    const button = wrapper.find('Button')
    expect(button).toHaveLength(1)
    expect(button.text()).toBe('Editar Declaración')
    button.simulate('click')
    expect(props.goBack).toHaveBeenCalled()
  })

  it('should render new download page if `tax_year` is greater than `TAX_YEAR_FOR_LEGACY_DOWNLOAD_PAGE` and role is `accountant`', () => {
    const TAX_YEAR = getMaxTaxYear()
    const { wrapper } = setup(
      {},
      {
        personalInfo: {
          role: ROLES.ACCOUNTANT,
          currentFiling: {
            ...CURRENT_FILING,
            tax_year: getMaxTaxYear(),
          },
        },
      }
    )

    expect(TAX_YEAR).toBeGreaterThan(TAX_YEAR_FOR_LEGACY_DOWNLOAD_PAGE)
    const downloadPage = wrapper.find('#download-page-new')
    expect(downloadPage).toHaveLength(1)

    const title = wrapper.find('Title')
    expect(title).toHaveLength(1)
    expect(title.text()).toBe(
      '¡Felicitaciones, tu declaración de renta ya está lista!'
    )

    const subtitle = wrapper.find('Subtitle')
    expect(subtitle).toHaveLength(0)
  })

  it('should render title for role `accountant` and plan is `assisted` ', () => {
    const { wrapper } = setup(
      {},
      {
        personalInfo: {
          role: ROLES.ACCOUNTANT,
          currentFiling: {
            ...CURRENT_FILING,
            tax_year: getMaxTaxYear(),
            product_plan: {
              is_assisted: true,
              is_rush: true,
            },
          },
        },
      }
    )

    const title = wrapper.find('Title')
    expect(title).toHaveLength(1)
    expect(title.text()).toBe(
      'La declaración de renta del usuario está lista, revísala y confirma que todo esté bien para finalizar el proceso'
    )
  })

  it('should call `syncDeclaration` if `declaration` starts with `PENDING`', () => {
    const spyClearTimeout = jest.spyOn(global, 'clearTimeout')
    const { wrapper, props } = setup(
      {
        documents: {
          declaration: DOCUMENT_STATUS.PENDING + '-some-text',
        },
      },
      {
        personalInfo: {
          role: ROLES.TAX_FILER,
          currentFiling: CURRENT_FILING,
        },
      }
    )

    expect(props.syncDeclaration).not.toBeCalled()
    expect(spyClearTimeout).not.toHaveBeenCalled()
    jest.advanceTimersByTime(NEXT_REFRESH)
    expect(props.syncDeclaration).toBeCalled()
    wrapper.unmount()
    expect(spyClearTimeout).toHaveBeenCalled()
  })

  it('should show a modal if `tax_engine` change', () => {
    const spyModalInfo = jest.spyOn(Modal, 'info')
    const { wrapper } = setup(
      {
        computedTaxes: {
          tax_engine: 'original-tax-engine',
        },
      },
      {
        personalInfo: {
          role: ROLES.TAX_FILER,
          currentFiling: CURRENT_FILING,
        },
      }
    )

    expect(spyModalInfo).not.toHaveBeenCalled()
    wrapper.setProps({
      computedTaxes: {
        tax_engine: 'new-tax-engine',
      },
    })
    expect(spyModalInfo).toHaveBeenCalled()
  })

  it('should call `getComputedTaxes` when mounts and `clearComputeTaxes` when unmounts', () => {
    const { wrapper, props } = setup(
      {},
      {
        personalInfo: {
          role: ROLES.TAX_FILER,
          currentFiling: CURRENT_FILING,
        },
      }
    )
    expect(props.getComputedTaxes).toHaveBeenCalled()
    wrapper.unmount()
    expect(props.clearComputeTaxes).toHaveBeenCalled()
  })
})
