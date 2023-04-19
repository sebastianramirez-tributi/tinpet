import React from 'react'
import { fireEvent, act } from '@testing-library/react'
import {
  mockWithProviders,
  reduxProvider,
  themeProvider,
} from '../../../helpers/__mocks__/mock-providers'
import PlanCard from '../PlanCard'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'

const setup = (initialProps = {}) => {
  const props = {
    onSelect: jest.fn(),
    details: [],
    disabled: false,
    hidePayLater: false,
    id: null,
    is_popular: false,
    name: null,
    oldPrice: null,
    price: null,
    partner_plan: null,
    coupon: {
      code: null,
    },
    unavailableWhenDisabled: false,
    hasReferralBalance: false,
    referralBalance: null,
    explanatoryVideo: null,
    showCalendlyModal: false,
    ...initialProps,
  }

  const store = overwriteStore({})

  const wrapper = mockWithProviders(<PlanCard {...props} />, [
    themeProvider(),
    reduxProvider(store),
  ])

  return { wrapper, props }
}

describe('<PlanCard /> specs', () => {
  it('should render basic props properly', () => {
    const { wrapper, props } = setup({
      id: 'test-1',
      name: 'Test One',
      price: 1000,
    })
    expect(wrapper.getByText(props.name)).toBeTruthy()
    expect(wrapper.getByTestId('price').textContent).toContain('1,000')
  })

  it('should have popular badge if `is_popular` is set', () => {
    const { wrapper } = setup({
      id: 'test-1',
      name: 'Test One',
      price: 1000,
      is_popular: true,
    })
    expect(wrapper.getByText('Popular')).toBeTruthy()
  })

  it('should show referral message if `hasReferralBalance` is `true`', () => {
    const { wrapper } = setup({
      id: 'test-1',
      name: 'Test One',
      price: 1000,
      hasReferralBalance: true,
      referralBalance: 1000,
    })
    expect(wrapper.getByTestId('referral-caveat').textContent).toContain(
      'Te aplicamos $1,000 de créditos por tus referidos'
    )
  })

  it('should render a list of details', () => {
    const DETAILS = ['fast', 'secure', 'testing']
    const { wrapper } = setup({
      id: 'test-1',
      name: 'Test One',
      price: 1000,
      details: DETAILS,
    })
    expect(wrapper.getByTestId('plan-card-details')).toBeTruthy()

    const items = wrapper.getAllByRole('listitem')
    items.forEach((item, index) => {
      expect(item.textContent).toContain(DETAILS[index])
    })
  })

  it('should render a button with text `Seleccionar plan` if `disabled` is `false`', () => {
    const NAME = 'Test One'
    const { wrapper } = setup({
      id: 'test-1',
      name: NAME,
      price: 1000,
      disabled: false,
    })
    const button = wrapper.getAllByRole('button')[0]
    expect(button.textContent).toContain(`Seleccionar plan ${NAME}`)
  })

  it('should render a disabled button with `Plan no disponible` if `disabled` is `true` and `unavailableWhenDisabled` is `true`', () => {
    const { wrapper } = setup({
      id: 'test-1',
      name: 'Test One',
      price: 1000,
      disabled: true,
      unavailableWhenDisabled: true,
    })
    const button = wrapper.getAllByRole('button')[0]
    expect(button.textContent).toContain('Plan no disponible')
  })

  it('should render a disabled button with `Plan adquirido` if `disabled` is `true` and `unavailableWhenDisabled` is `false`', () => {
    const { wrapper } = setup({
      id: 'test-1',
      name: 'Test One',
      price: 1000,
      disabled: true,
      unavailableWhenDisabled: false,
    })

    const button = wrapper.getAllByRole('button')[0]
    expect(button.textContent).toContain('Plan adquirido')
  })

  it('should call onSelect with first param as true when `pay now` button is clicked', async () => {
    const NAME = 'Test One'

    const { wrapper, props } = setup({
      id: 'test-1',
      name: NAME,
      price: 1000,
    })

    const button = wrapper.getAllByRole('button')[0]
    expect(button.textContent).toContain(`Seleccionar plan ${NAME}`)

    await act(async () => {
      await fireEvent.click(button)
    })

    expect(props.onSelect).toHaveBeenCalledWith(true, props.id, false)
  })

  it('should call onSelect with first param as true and last param the same as `showCalendlyModal` when `pay now` button is clicked', async () => {
    const { wrapper, props } = setup({
      id: 'test-1',
      name: 'Test One',
      price: 1000,
      showCalendlyModal: true,
    })

    const button = wrapper.getAllByRole('button')[0]

    await act(async () => {
      await fireEvent.click(button)
    })

    expect(props.onSelect).toHaveBeenCalledWith(
      true,
      props.id,
      props.showCalendlyModal
    )
  })

  it('should call onSelect with first param as false when `pay later` button is clicked', async () => {
    const { wrapper, props } = setup({
      id: 'test-1',
      name: 'Test One',
      price: 1000,
    })

    const payLaterButton = wrapper.getAllByRole('button')[1]
    expect(payLaterButton.textContent).toContain(
      'Quiero este plan, pero prefiero pagar al final'
    )

    await act(async () => {
      await fireEvent.click(payLaterButton)
    })

    expect(props.onSelect).toHaveBeenCalledWith(false, props.id, false)
  })
  it('should show button `pay later` when `hidePayLater` is `false`', () => {
    const { wrapper } = setup({
      id: 'test-1',
      name: 'Test One',
      price: 1000,
      hidePayLater: false,
    })
    // pay later button
    expect(wrapper.getAllByRole('button')[1]).toBeTruthy()
  })

  it('should hide button `pay later` when `hidePayLater` is `true`', () => {
    const { wrapper } = setup({
      id: 'test-1',
      name: 'Test One',
      price: 1000,
      hidePayLater: true,
    })
    // pay later button
    expect(wrapper.getAllByRole('button')[1]).toBeUndefined()
  })

  it('should render a list of details with 48 hours', () => {
    const DETAILS = ['fast', 'secure', 'testing', 'Elaborada en 48 horas']
    const { wrapper } = setup({
      id: 'test-1',
      name: 'Test One',
      price: 1000,
      details: DETAILS,
    })
    expect(wrapper.getByTestId('plan-card-details')).toBeTruthy()

    const items = wrapper.getAllByRole('listitem')
    items.forEach((item, index) => {
      expect(item.textContent).toContain(DETAILS[index])
    })
  })

  it('should render a list of details with 2 hours', () => {
    const DETAILS = ['fast', 'secure', 'testing', 'Elaborada en 2 horas']
    const { wrapper } = setup({
      id: 'test-1',
      name: 'Test One',
      price: 1000,
      details: DETAILS,
    })
    expect(wrapper.getByTestId('plan-card-details')).toBeTruthy()

    const items = wrapper.getAllByRole('listitem')

    items.forEach((item, index) => {
      expect(item.textContent).toContain(DETAILS[index])
    })
  })
})
