import React from 'react'
import { fireEvent, act } from '@testing-library/react'
import { ROLES } from '../../../../constants/person'
import { PAYMENT_STATUS } from '../../../../constants/payment'
import {
  mockWithProviders,
  themeProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import Footer from '../Footer'
const { ASSISTANT, TAX_FILER, ACCOUNTANT } = ROLES
const { APPROVED } = PAYMENT_STATUS

const setup = (baseProps) => {
  const props = {
    loading: false,
    handleClickFinish: jest.fn(),
    sendDocumentsToUser: jest.fn(),
    ...baseProps,
  }
  const wrapper = mockWithProviders(<Footer {...props} />, [themeProvider()])
  return { wrapper, props }
}
describe('<Footer />', () => {
  it('Should render one button if user is not assistant', () => {
    const { wrapper } = setup({ role: TAX_FILER, paymentStatus: APPROVED })
    expect(wrapper.getAllByRole('button')).toHaveLength(1)
  })

  it('Should render two buttons if user is assistant', () => {
    const { wrapper } = setup({ role: ASSISTANT, paymentStatus: APPROVED })
    const elaborateAsUserButton = wrapper.getAllByRole('button')[1]
    expect(elaborateAsUserButton.textContent).toContain(
      'Elaborar declaración como Usuario'
    )
    expect(wrapper.getAllByRole('button')).toHaveLength(2)
  })

  it('Should call handleClick finish when assistant and payment are ok', () => {
    const { wrapper, props } = setup({
      role: ASSISTANT,
      paymentStatus: APPROVED,
    })

    const { handleClickFinish } = props
    const elaborateAsUserButton = wrapper.getAllByRole('button')[1]
    act(() => {
      fireEvent.click(elaborateAsUserButton)
    })
    expect(handleClickFinish).toBeCalled()
  })

  it('Should render elaborate as accountant button if role is accountant and environment variable is false', () => {
    process.env.IS_DISABLE_ACCOUNTANT_BUTTON = 'false'
    const { wrapper } = setup({ role: ACCOUNTANT, paymentStatus: APPROVED })
    const elaborateAsAccountantButton = wrapper.getAllByRole('button')[1]
    expect(elaborateAsAccountantButton.textContent).toContain(
      'Elaborar declaración como contador'
    )
    expect(elaborateAsAccountantButton.getAttribute('disabled')).toBeNull()
  })

  it('Should render disabled elaborate as accountant button if role is accountant environment variable is true', () => {
    process.env.IS_DISABLE_ACCOUNTANT_BUTTON = 'true'
    const { wrapper } = setup({ role: ACCOUNTANT, paymentStatus: APPROVED })
    const elaborateAsAccountantButton = wrapper.getAllByRole('button')[1]
    expect(elaborateAsAccountantButton.textContent).toContain(
      'Elaborar declaración como contador'
    )
    expect(elaborateAsAccountantButton.getAttribute('disabled')).toBeDefined()
  })
})
