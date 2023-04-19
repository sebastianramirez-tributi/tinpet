import React from 'react'
import { fireEvent, act } from '@testing-library/react'

import {
  mockWithProviders,
  reduxProvider,
  themeProvider,
} from '../../../helpers/__mocks__/mock-providers'
import { usePersonalInfo } from '../../../helpers/hooks'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'
import {
  saveAssistantUser,
  clearMessage,
  updateAsistantUsers,
} from '../../../redux/form/actions'
import SelectStatusUser from '../index'

jest.mock('../../../redux/form/actions')

jest.mock('../../../helpers/hooks', () => {
  const actual = jest.requireActual('../../../helpers/hooks')
  return {
    ...actual,
    usePersonalInfo: jest.fn().mockImplementation(actual.usePersonalInfo),
  }
})

const setup = (baseProps, newStore = {}) => {
  const props = {
    id: '1',
    email: 'test@email.com',
    defaultValue: true,
    ...baseProps,
  }

  const store = overwriteStore({
    registerReducer: {
      assistantLocalState: {
        currentUserToValidate: {
          email: 'test@email.com',
        },
        emailOrId: {},
      },
      ...newStore,
    },
  })
  const wrapper = mockWithProviders(<SelectStatusUser {...props} />, [
    reduxProvider(store),
    themeProvider(),
  ])
  return { wrapper, props }
}

describe('SelectStatusUser spec', () => {
  const actualHooks = jest.requireActual('../../../helpers/hooks')

  beforeEach(() => {
    // sets default implementation
    usePersonalInfo.mockImplementation(() => {
      const hook = actualHooks.usePersonalInfo()
      return {
        ...hook,
        personalInfo: {
          ...hook.personalInfo,
          is_staff: true,
        },
      }
    })
  })

  it('should render component correctly', () => {
    usePersonalInfo.mockImplementation(() => {
      const hook = actualHooks.usePersonalInfo()
      return {
        ...hook,
        personalInfo: {
          ...hook.personalInfo,
          is_staff: true,
        },
      }
    })
    const { wrapper } = setup()
    expect(wrapper.getByText('Activo')).toBeTruthy()
  })

  it('should change status when changed', async () => {
    const { wrapper } = setup()
    const select = wrapper.getByRole('combobox')

    await act(async () => {
      await fireEvent.change(select, { target: { value: false } })
      await fireEvent.click(wrapper.getByTitle('Inactivo'))
    })
    expect(saveAssistantUser).toBeCalled()
  })

  it('should call to clearMessage and updateAsistantUsers', async () => {
    const reduxMessageMock = { messageToShow: 'message test', error: false }
    setup({}, reduxMessageMock)
    expect(clearMessage).toBeCalled()
    expect(updateAsistantUsers).toBeCalled()
  })

  it('should call only clearMessage', async () => {
    const reduxMessageMock = { messageToShow: 'message test', error: true }
    setup({}, reduxMessageMock)
    expect(clearMessage).toBeCalled()
    expect(updateAsistantUsers).not.toBeCalled()
  })
})
