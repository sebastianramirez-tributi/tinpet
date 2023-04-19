import React from 'react'

import {
  mockWithProviders,
  themeProvider,
  reduxProvider,
  rootContextProvider,
} from '../../../helpers/__mocks__/mock-providers'

import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'
import FilingTable from '../FilingTable'
import { ROLES } from '../../../constants/person'

jest.mock('../../../helpers/hooks', () => ({
  ...jest.requireActual('../../../helpers/hooks'),
  useConfig: jest
    .fn()
    .mockReturnValue({ denyAddPersons: false, MAX_TAX_YEAR: 2020 }),
}))
const propsMock = {
  onDelete: jest.fn(),
  onContinue: jest.fn(),
  onChangePlan: jest.fn(),
  onChangeYear: jest.fn(),
  year: 2020,
}
const setup = (baseProps, newStore) => {
  const props = { ...propsMock, ...baseProps }
  const store = overwriteStore(newStore)
  const contextProps = {
    isEnableRemoveFiling: false,
  }
  const wrapper = mockWithProviders(<FilingTable {...props} />, [
    themeProvider(),
    reduxProvider(store),
    rootContextProvider(contextProps),
  ])
  const { rerender } = wrapper
  return { props, wrapper, rerender }
}

describe('FilingTable spec', () => {
  const PERSONAL_INFO = { role: ROLES.TAX_FILER }

  it('should render filing table', () => {
    const SPAN_ELEMENTS_EXPECT_HTML = 5
    const PATH_ELEMENTS_EXPECT_HTML = 1
    const DIV_ELEMENTS_EXPECT_HTML = 9

    const { wrapper } = setup(undefined, { personalInfo: PERSONAL_INFO })

    const divElementsHTML = wrapper.container.querySelectorAll('div')
    const spanElementsHTML = wrapper.container.querySelectorAll('span')
    const svgElementsHTML = wrapper.container.querySelector('svg')

    expect(wrapper.getByText('Año:')).toBeInTheDocument()

    expect(
      wrapper.getByRole('combobox', {
        'aria-haspopup': 'listbox',
        unselectable: 'on',
      })
    ).toBeTruthy()

    expect(wrapper.getByText('2020')).toBeInTheDocument()

    expect(spanElementsHTML).toHaveLength(SPAN_ELEMENTS_EXPECT_HTML)
    expect(spanElementsHTML[2].getAttribute('title')).toEqual('2020')
    expect(spanElementsHTML[3].getAttribute('aria-hidden')).toEqual('true')

    expect(svgElementsHTML.getAttribute('aria-hidden')).toEqual('true')
    expect(wrapper.container.querySelectorAll('path')).toHaveLength(
      PATH_ELEMENTS_EXPECT_HTML
    )
    expect(divElementsHTML).toHaveLength(DIV_ELEMENTS_EXPECT_HTML)

    expect(wrapper.getByText('Año Gravable')).toBeInTheDocument()
    expect(wrapper.getByText('Fecha de vencimiento')).toBeInTheDocument()
    expect(wrapper.getByText('Plan')).toBeInTheDocument()
    expect(wrapper.getByText('Acciones')).toBeInTheDocument()
  })

  it('should render component correctly', () => {
    const BUTTON_ELEMENTS_EXPECT_HTML = 2
    const DIV_ELEMENTS_EXPECT_HTML = 19

    const { wrapper } = setup(
      {
        filings: [{ id: 1 }, { id: 2 }],
      },
      { personalInfo: PERSONAL_INFO }
    )
    const divElementsHTML = wrapper.container.querySelectorAll('div')
    const buttons = wrapper.getAllByRole('button')

    expect(divElementsHTML).toHaveLength(DIV_ELEMENTS_EXPECT_HTML)
    expect(divElementsHTML[9].getAttribute('data-testid')).toEqual('filing-1')
    expect(divElementsHTML[14].getAttribute('data-testid')).toEqual('filing-2')

    expect(buttons).toHaveLength(BUTTON_ELEMENTS_EXPECT_HTML)
    expect(wrapper.getAllByText('Comenzar')).toHaveLength(2)
  })
})
