import React from 'react'
import { mount, shallow } from 'enzyme'
import { Modal } from 'antd'
import { act } from 'react-dom/test-utils'

import {
  MockWithProvidersLegacy,
  themeProvider,
  routerProvider,
  reduxProvider,
} from '../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'
import AssistantV2 from '..'
import { swapAccountFromAssistant } from '../../../redux/form/actions'
jest.mock('../../../redux/form/actions')

const setup = (baseProps, assistantState = {}, regStore = {}) => {
  const MOCK_PERSONAL_INFO = {
    first_name: 'testing',
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
          id: '13213',
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

describe('Account swap test', () => {
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

  it('should swap account ', async () => {
    const spy = jest.spyOn(Modal, 'confirm')
    let mockOnOk
    spy.mockImplementationOnce(({ onCancel, onOk }) => {
      console.log('mockOnOk ....')
      mockOnOk = onOk
    })

    const assistantState = {
      showChangePassword: false,
      showAccountSwap: true,
      showEditUser: false,
      showEditPerson: false,
      emailOrId: { param: {} },
    }

    let wrapper = {}

    act(() => {
      const { wrapper: wp } = setup({}, assistantState)
      wrapper = wp
    })

    const modalForm = wrapper.find('form').at(1)
    const inputEmail = modalForm.find('input').at(0)
    const inputDoc = modalForm.find('input').at(1)

    act(() => {
      inputEmail.props().onChange({ target: { value: 'test@test.com' } })
      inputDoc.props().onChange({ target: { value: '12345677' } })
    })
    wrapper.update()
    const button = wrapper.find('form').at(1).find('button')

    await act(async () => {
      await button.simulate('submit')
    })

    wrapper.update()
    document.querySelector('.ant-modal-confirm-btns > .ant-btn-primary').click()

    expect(swapAccountFromAssistant).toBeCalled()
    expect(swapAccountFromAssistant).toBeCalledWith(
      {
        dest_doc: 12345677,
        dest_email: 'test@test.com',
        origin_id: '13213',
      },
      { showAccountSwap: false }
    )
  })
})
