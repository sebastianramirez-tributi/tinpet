import React from 'react'
import { fireEvent, act } from '@testing-library/react'

import Engine from '../content'
import {
  mockWithProviders,
  themeProvider,
  rootContextProvider,
  routerProvider,
} from '../../../helpers/__mocks__/mock-providers'
import { PLANS } from '../../../constants/filings'
import { ENGINE_STATUS } from '../../../constants/engine'
const { DEPRECATED } = ENGINE_STATUS

const RealDate = Date.now

const setPersonPlan = (plan, role) => {
  return {
    currentFiling: {
      delivery_init_date: '2020-07-07T20:20:30Z',
      id: 'id-test-filing',
      product_plan: {
        name: plan,
      },
    },
    role,
  }
}

const setup = (baseProps = {}) => {
  const props = {
    computedTaxes: jest.fn(),
    clearEngineStatus: jest.fn(),
    getFillingState: jest.fn(),
    history: { push: jest.fn() },
    tax_engine: jest.fn(),
    tax_engine_info: {
      id: '321',
      status: 'new',
      task_id: 'abc',
      author_role: 'tax_filer',
    },
    subscribe: jest.fn().mockReturnValue(jest.fn()),
    updateStatusFilling: jest.fn(),
    updateTaxEngineId: jest.fn(),
    setCurrentFiling: jest.fn(),
    setCurrentFilingById: jest.fn(),
    navigate: jest.fn(),
    ...baseProps,
  }

  const wrapper = mockWithProviders(<Engine {...props} />, [
    themeProvider(),
    rootContextProvider(),
    routerProvider(),
  ])

  return { wrapper, props }
}

describe('<Engine />', () => {
  beforeAll(() => {
    global.Date.now = jest.fn(() => new Date('2020-07-07T20:20:30Z').getTime())
  })

  afterAll(() => {
    global.Date.now = RealDate
  })

  it('Should render container properly', () => {
    const personalInfo = setPersonPlan(PLANS.STANDARD, 'tax_filer')
    const { wrapper } = setup({
      personalInfo,
    })
    expect(wrapper.getByTestId('container')).toBeTruthy()
  })

  it('Should render properly with plan STANDARD', () => {
    const personalInfo = setPersonPlan(PLANS.STANDARD, 'tax_filer')
    const { wrapper } = setup({
      personalInfo,
    })
    const expectedCopyFirst =
      'Ya recibimos tus documentos y los estamos revisando. Tu declaración de renta estará'

    const expectedCopySecond = 'lista en un máximo de 48 horas.'
    const expectedCopyThird =
      'Puedes cerrar el navegador, no se perderá la información que ingresaste y tampoco se detendrá el proceso de elaboración. Por favor regresa para poder descargar tu declaración de renta una vez esté lista.'

    expect(wrapper.getByTestId('container-text').textContent).toContain(
      expectedCopyFirst
    )
    expect(wrapper.getByTestId('container-text').textContent).toContain(
      expectedCopySecond
    )
    expect(wrapper.getByTestId('container-text').textContent).toContain(
      expectedCopyThird
    )
  })

  it('Should render properly with plan EXPRESS', () => {
    const personalInfo = setPersonPlan(PLANS.EXPRESS, 'tax_filer')
    const { wrapper } = setup({ personalInfo })
    const expectedCopyFirst =
      'Ya recibimos tus documentos y los estamos revisando. Tu declaración de renta estará'

    const expectedCopySecond = 'lista en un máximo de 2 horas.'
    const expectedCopyThird =
      'Puedes cerrar el navegador, no se perderá la información que ingresaste y tampoco se detendrá el proceso de elaboración. Por favor regresa para poder descargar tu declaración de renta una vez esté lista.'

    expect(wrapper.getByTestId('container-text').textContent).toContain(
      expectedCopyFirst
    )
    expect(wrapper.getByTestId('container-text').textContent).toContain(
      expectedCopySecond
    )
    expect(wrapper.getByTestId('container-text').textContent).toContain(
      expectedCopyThird
    )
  })

  it('Should handle deprecated or cancelled status when the tax_engine_id is the same', () => {
    const personalInfo = setPersonPlan(PLANS.EXPRESS, 'tax_filer')
    const { wrapper, props } = setup({ personalInfo })
    const { getFillingState, updateStatusFilling, computedTaxes } = props
    computedTaxes.mockRestore()
    getFillingState.mockResolvedValue({ last_valid_engine: { id: '321' } })
    const propsMock = {
      ...props,
      tax_engine_status: { status: DEPRECATED },
    }

    wrapper.rerender(<Engine {...propsMock} />)
    expect(computedTaxes).not.toBeCalled()
    expect(updateStatusFilling).toBeCalled()
  })

  it('Should handle deprecated or cancelled status when the tax_engine_id changes', () => {
    jest.useFakeTimers()
    const newValidEngineId = '123'
    const personalInfo = setPersonPlan(PLANS.EXPRESS, 'tax_filer')
    const { wrapper, props } = setup({ personalInfo })
    const {
      updateTaxEngineId,
      getFillingState,
      tax_engine: taxEngine,
      tax_engine_info: taxEngineInfo,
      subscribe,
    } = props
    subscribe.mockClear()
    getFillingState.mockResolvedValue({
      last_valid_engine: { id: newValidEngineId },
      last_engine_id: newValidEngineId,
    })
    jest.runOnlyPendingTimers()
    const propsMockFirstMoment = {
      ...props,
      tax_engine_status: { status: DEPRECATED },
    }
    wrapper.rerender(<Engine {...propsMockFirstMoment} />)
    expect(updateTaxEngineId).toBeTruthy()
    const propsMockSecondtMoment = {
      ...props,
      tax_engine_status: { status: DEPRECATED },
      tax_engine_info: { ...taxEngineInfo, id: newValidEngineId },
    }
    wrapper.rerender(<Engine {...propsMockSecondtMoment} />)
    jest.runOnlyPendingTimers()
    expect(subscribe).toBeCalled()
  })

  it('Should render properly the assistant view', () => {
    const personalInfo = setPersonPlan(PLANS.EXPRESS, 'assistant')
    const { wrapper } = setup({ personalInfo })
    expect(wrapper.getAllByTestId('copy-clip-board-btn')).toHaveLength(3)
  })

  it('Should work properly copy text', async () => {
    global.navigator.clipboard = { writeText: jest.fn() }
    const personalInfo = setPersonPlan(PLANS.EXPRESS, 'assistant')
    const { wrapper } = setup({ personalInfo })
    const firstButton = wrapper.getAllByTestId('copy-clip-board-btn')[0]

    await act(async () => {
      fireEvent.click(firstButton, {
        currentTarget: { getAttribute: jest.fn() },
      })
    })
    expect(window.navigator.clipboard.writeText).toBeCalled()
  })

  it('Should not go back if there is and error updating the status', async () => {
    const personalInfo = setPersonPlan(PLANS.EXPRESS, 'assistant')
    const { wrapper, props } = setup({ personalInfo })
    const { updateStatusFilling } = props
    updateStatusFilling.mockRejectedValue({})

    await act(async () => {
      fireEvent.click(wrapper.getAllByTestId('cancel-btn')[0])
    })

    await expect(updateStatusFilling()).rejects.toEqual({})
    expect(
      wrapper.getByText(
        'Error al volver a la declaración, verifica tu conexión e intenta de nuevo'
      )
    ).toBeTruthy()
  })
})
