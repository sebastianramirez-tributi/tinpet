import React from 'react'
import { fireEvent, act } from '@testing-library/react'
import ItemsSummary from '../ItemsSummary'

import {
  mockWithProviders,
  reduxProvider,
  rootContextProvider,
  themeProvider,
} from '../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'
import { ROLES } from '../../../constants/person'
import {
  mockItemsNoCertificate,
  mockItemsWithCertificates,
} from './mockData/ItemsSummary'
jest.mock('../Upload')

const setup = (baseProps) => {
  const props = {
    fillingId: 'test-filing',
    handleClickDontHave: jest.fn(),
    instanceRowClick: jest.fn(),
    personalInfoTab: '1.1',
    removeCertificates: jest.fn(),
    removeInstance: jest.fn(),
    setRefListGroup: jest.fn(),
    syncInstanceCertificates: jest.fn(),
    updateCertificatePassword: jest.fn(),
    notifyLoading: jest.fn(),
    loadSummary: jest.fn(),
    markCertificateAsCancel: jest.fn(),
    ...baseProps,
  }
  const storeProps = {
    general: {
      loadingCount: 0,
    },
  }
  const store = overwriteStore(storeProps)
  const wrapper = mockWithProviders(<ItemsSummary {...props} />, [
    reduxProvider(store),
    themeProvider(),
    rootContextProvider(),
  ])
  return { wrapper, props }
}

describe('<ItemsSummary />', () => {
  describe('tax_filer ItemsSummary', () => {
    it('Should render properly with empty items', () => {
      const { wrapper } = setup()
      expect(wrapper.getByRole('alert')).toBeTruthy()
    })

    it('Should not render <Certificates /> with item and has no certificate', () => {
      const { wrapper } = setup({ items: mockItemsNoCertificate })
      expect(wrapper.getByRole('alert')).toBeTruthy()
    })

    it('Should render <Certificate /> with item and certificates in it', () => {
      const { wrapper } = setup({ items: mockItemsWithCertificates })
      expect(wrapper.getAllByTestId('instance-row').length).toBeGreaterThan(0)
    })
  })

  describe('assistant ItemsSummary', () => {
    it('Should render <Certificates /> with item and has no certificate', async () => {
      const { wrapper, props } = setup({
        items: mockItemsNoCertificate,
        role: ROLES.ASSISTANT,
      })
      const { instanceRowClick } = props

      const instanceDiv = wrapper.getAllByTestId('instance-row')[0]
      await act(async () => {
        fireEvent.click(instanceDiv)
      })

      expect(instanceRowClick).toBeCalled()
    })
  })
})
