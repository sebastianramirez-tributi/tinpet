import React from 'react'

import {
  mockWithProviders,
  themeProvider,
  reduxProvider,
  rootContextProvider,
} from '../../../helpers/__mocks__/mock-providers'

import Filing from '../Filing'
import { ROLES } from '../../../constants/person'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'
import moment from 'moment'
import { fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

const setup = (baseProps, newStore, contextProps) => {
  const props = {
    id: 100,
    onContinue: jest.fn(),
    onDelete: jest.fn(),
    ...baseProps,
  }
  const context = contextProps || { isEnableRemoveFiling: false }
  const store = overwriteStore(newStore)
  const wrapper = mockWithProviders(<Filing {...props} />, [
    themeProvider(),
    reduxProvider(store),
    rootContextProvider(context),
  ])
  const { rerender } = wrapper
  return { props, wrapper, rerender }
}

describe('Filing spec', () => {
  const PERSONAL_INFO = { role: ROLES.TAX_FILER }
  const DIV_ELEMENTS_HTML_EXPECTED = 5
  const SPAN_ELEMENTS_HTML_EXPECTED = 2

  it('should render filing component', () => {
    const { wrapper } = setup(
      { due_date: '2019-10-01' },
      { personalInfo: PERSONAL_INFO }
    )
    const divElementsHtml = wrapper.container.querySelectorAll('div')
    const spanElmentsHTML = wrapper.container.querySelectorAll('span')
    expect(spanElmentsHTML).toHaveLength(SPAN_ELEMENTS_HTML_EXPECTED)
    expect(divElementsHtml).toHaveLength(DIV_ELEMENTS_HTML_EXPECTED)
  })

  it('should render component correctly', () => {
    const props = {
      tax_year: 2018,
      due_date: '2019-10-01',
      created_at: '2019-10-01',
    }
    const { wrapper } = setup(props, { personalInfo: PERSONAL_INFO })
    expect(wrapper.getAllByTestId('tax-year')).toHaveLength(1)
    expect(wrapper.getByTestId('tax-year').textContent).toContain('2018')
    expect(wrapper.getByTestId('due-date').textContent).toContain(
      moment(props.due_date).format('DD [de] MMMM [de] YYYY')
    )
    expect(wrapper.getByTestId('filing-delete')).toBeTruthy()
  })

  it('should hide delete button when created_at is not defined', () => {
    const { props, wrapper } = setup(
      {
        tax_year: 2018,
        due_date: '2019-10-01',
      },
      { personalInfo: PERSONAL_INFO }
    )
    expect(wrapper.getByTestId(`filing-${props.id}`)).toBeTruthy()
    expect(wrapper.queryByTestId('filing-delete')).toBeNull()
  })

  it('should open confirmation dialog when delete button is clicked', () => {
    const { wrapper } = setup(
      {
        tax_year: 2018,
        created_at: '2019-10-01',
      },
      { personalInfo: PERSONAL_INFO }
    )
    const deleteButton = wrapper.getByTestId('filing-delete')
    expect(wrapper.getByTestId('filing-delete', { onDelete: jest.fn() }))
    expect(deleteButton).toBeTruthy()
    expect(wrapper.getByTestId('filing-delete').textContent).toContain('')
  })

  it('should call onContinue when click on continue button', () => {
    const { wrapper } = setup(
      {
        tax_year: 2018,
        created_at: '2019-10-01',
      },
      { personalInfo: PERSONAL_INFO }
    )
    const button = wrapper.getByTestId('filing-continue-button')
    const buttonMobile = wrapper.getByTestId('filing-delete-mobile')
    expect(button).toBeTruthy()
    expect(wrapper.getByTestId('filing-continue-button').textContent).toContain(
      'Continuar'
    )
    expect(buttonMobile).toBeTruthy()
    expect(wrapper.getByTestId('filing-delete-mobile').textContent).toContain(
      'Eliminar'
    )
  })

  it('should not enable remove filing button', () => {
    const { wrapper } = setup(
      {
        tax_year: 2018,
        created_at: '2019-10-01',
        product_plan: { name: 'Estándar' },
        payment_status: 'approved',
      },
      { personalInfo: PERSONAL_INFO },
      { isEnableRemoveFiling: false }
    )
    const buttonDeleteFiling = wrapper.getByTestId('filing-delete')
    act(() => {
      fireEvent.click(buttonDeleteFiling)
    })
    expect(
      wrapper.queryByText('¿Quieres eliminar a esta declaración?')
    ).toBeNull()
  })

  it('should enable remove filing button', () => {
    const { wrapper } = setup(
      {
        tax_year: 2018,
        created_at: '2019-10-01',
        product_plan: { name: 'Estándar' },
        payment_status: 'approved',
      },
      { personalInfo: PERSONAL_INFO },
      { isEnableRemoveFiling: true }
    )
    const buttonDeleteFiling = wrapper.getByTestId('filing-delete')
    act(() => {
      fireEvent.click(buttonDeleteFiling)
    })
    expect(
      wrapper.getByText('¿Quieres eliminar esta declaración?')
    ).toBeTruthy()
  })
})
