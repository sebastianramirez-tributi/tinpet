import React from 'react'
import { fireEvent, act, screen } from '@testing-library/react'

import InviteFriends from '../content'
import {
  mockWithProviders,
  themeProvider,
  routerProvider,
  reduxProvider,
} from '../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'

const setup = (newProps, state) => {
  const props = {
    getUserReferals: jest.fn(),
    ...newProps,
  }

  const store = overwriteStore(state)

  const wrapper = mockWithProviders(<InviteFriends {...props} />, [
    themeProvider(),
    routerProvider(),
    reduxProvider(store),
  ])
  return { wrapper, props }
}

describe('<InviteFriends', () => {
  const COUPON_CODE = 'test-coupon-code'

  const MOCK_PERSONAL_INFO = {
    first_name: 'testing',
    coupons: [
      {
        id: 'test',
        created_at: '2020-06-15T18:57:57.691238Z',
        updated_at: '2020-06-15T18:57:57.715613Z',
        description: null,
        code: COUPON_CODE,
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

  it('Should render amounts properly', () => {
    const { wrapper } = setup(
      {
        showModal: true,
        referralCount: 1,
        filerReferredPrice: 10_000,
        referralBalance: 100_000,
      },
      { personalInfo: MOCK_PERSONAL_INFO }
    )
    expect(wrapper.getByText('Tu código es')).toBeTruthy()
    expect(wrapper.getByText('test-coupon-code')).toBeTruthy()

    expect(screen.getByTestId('share-cuopon').textContent).toContain(
      'Compártelo y gana'
    )
    expect(wrapper.getByText('$30,000')).toBeTruthy()
    expect(wrapper.getByText('descuento del 20%')).toBeTruthy()
    expect(screen.getByTestId('share-cuopon').textContent).toContain(
      'en su declaración si es la primera vez usando Tributi.'
    )
    expect(wrapper.getByText('$10.000')).toBeTruthy()
    expect(wrapper.getByText('$100.000')).toBeTruthy()
  })

  it('Should call getUserReferals', () => {
    const { props } = setup(
      { showModal: true },
      { personalInfo: MOCK_PERSONAL_INFO }
    )
    expect(props.getUserReferals).toBeCalled()
  })

  it('Should render whithout coupon', () => {
    const { wrapper } = setup({
      showModal: true,
      referralCount: 1,
      filerReferredPrice: 10_000,
      referralBalance: 100_000,
    })
    expect(wrapper.queryByText('test-coupon-code')).toBeNull()
  })

  it('Should render Modal', () => {
    const { wrapper } = setup(
      { showModal: false },
      { personalInfo: MOCK_PERSONAL_INFO }
    )

    const propsMock = {
      showModal: true,
      getUserReferals: jest.fn(),
      personalInfo: MOCK_PERSONAL_INFO,
    }
    wrapper.rerender(<InviteFriends {...propsMock} />)
    expect(
      wrapper.getByText('testing, ¡refiere a tus amigos y gana!')
    ).toBeTruthy()
  })
})
