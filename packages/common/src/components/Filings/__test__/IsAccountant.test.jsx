import React from 'react'

import {
  mockWithProviders,
  reduxProvider,
} from '../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'
import { ROLES } from '../../../constants/person'
import IsAccountant from '../IsAccountant'

const ChildComponent = () => <div>Child Content</div>

const setup = (props = {}, newStore) => {
  const store = overwriteStore(newStore)
  const wrapper = mockWithProviders(
    <IsAccountant {...props}>
      <ChildComponent />
    </IsAccountant>,
    [reduxProvider(store)]
  )

  return { wrapper, props }
}

describe('IsAccountant spec', () => {
  describe('with role Accountant', () => {
    const PERSONAL_INFO = { role: ROLES.ACCOUNTANT }

    it('should render the component if the prop hide is not set', () => {
      const { wrapper } = setup(undefined, { personalInfo: PERSONAL_INFO })
      expect(wrapper.getByText('Child Content')).toBeTruthy()
    })

    it('should not render the component if the prop hide is set', () => {
      const { wrapper } = setup({ hide: true }, { personalInfo: PERSONAL_INFO })
      expect(wrapper.queryByText('Child Content')).toBeNull()
    })
  })

  describe('with role Tax Filer', () => {
    const PERSONAL_INFO = { role: ROLES.TAX_FILER }

    it('should not render the component if the prop hide is not set', () => {
      const { wrapper } = setup(undefined, { personalInfo: PERSONAL_INFO })
      expect(wrapper.queryByText('Child Content')).toBeNull()
    })

    it('should render the component if the prop hide is set', () => {
      const { wrapper } = setup({ hide: true }, { personalInfo: PERSONAL_INFO })
      expect(wrapper.getByText('Child Content')).toBeTruthy()
    })
  })
})
