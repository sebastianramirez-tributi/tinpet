import React from 'react'
import { fireEvent, act } from '@testing-library/react'
import {
  mockWithProviders,
  themeProvider,
  reduxProvider,
  rootContextProvider,
} from '../../../helpers/__mocks__/mock-providers'

import Person from '../Person'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'
import { ROLES } from '../../../constants/person'
jest.mock('../../../helpers/hooks', () => ({
  ...jest.requireActual('../../../helpers/hooks'),
  useConfig: jest
    .fn()
    .mockReturnValue({ denyAddPersons: false, MAX_TAX_YEAR: 2020 }),
}))

const setup = (baseProps, newStore) => {
  const props = {
    filings: [],
    isOwnPerson: false,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onChangePlan: jest.fn(),
    onContinueFiling: jest.fn(),
    onDeleteFiling: jest.fn(),
    ...baseProps,
  }
  const contextProps = {
    isEnableRemoveFiling: false,
  }
  const store = overwriteStore(newStore)
  const wrapper = mockWithProviders(<Person {...props} />, [
    themeProvider(),
    reduxProvider(store),
    rootContextProvider(contextProps),
  ])
  return { props, wrapper }
}

describe('Person spec', () => {
  const PERSONAL_INFO = { role: ROLES.TAX_FILER }

  it('should render person component', () => {
    const { wrapper } = setup(
      { id: '1', name: 'John Doe' },
      { personalInfo: PERSONAL_INFO }
    )

    expect(wrapper.getByText('John Doe')).toBeInTheDocument()
    expect(wrapper.getByText('Editar')).toBeTruthy()

    expect(wrapper.getByText('Año:')).toBeInTheDocument()
    expect(wrapper.getByText('2020')).toBeInTheDocument()
    expect(wrapper.getByText('Año Gravable')).toBeInTheDocument()
    expect(wrapper.getByText('Fecha de vencimiento')).toBeInTheDocument()
    expect(wrapper.getByText('Plan')).toBeInTheDocument()
    expect(wrapper.getByText('Acciones')).toBeInTheDocument()
  })

  it('should render person component with isOwnPerson set to true', () => {
    const { wrapper } = setup(
      { id: '1', name: 'John Doe', isOwnPerson: true },
      { personalInfo: PERSONAL_INFO }
    )

    const buttonElementsHtml = wrapper.getAllByRole('button')

    expect(wrapper.getByText('John Doe')).toBeInTheDocument()
    expect(buttonElementsHtml[0].textContent).toEqual('Editar')

    expect(wrapper.getByText('Año:')).toBeInTheDocument()
    expect(wrapper.getByText('2020')).toBeInTheDocument()
    expect(wrapper.getByText('Año Gravable')).toBeInTheDocument()
    expect(wrapper.getByText('Fecha de vencimiento')).toBeInTheDocument()
    expect(wrapper.getByText('Plan')).toBeInTheDocument()
    expect(wrapper.getByText('Acciones')).toBeInTheDocument()
  })

  it('should render component correctly', () => {
    const { props, wrapper } = setup(
      { id: '1', name: 'John Doe', filings: [{ key: '1', kind: 'some' }] },
      { personalInfo: PERSONAL_INFO }
    )

    expect(wrapper.getAllByTestId('filing-person')).toHaveLength(1)
    expect(wrapper.getAllByTestId('filing-person-name')).toHaveLength(1)
    expect(wrapper.getByTestId('filing-person-name').textContent).toEqual(
      props.name
    )
    expect(wrapper.getAllByTestId('filing-continue-button')).toHaveLength(
      props.filings.length
    )
  })

  it('should call onEdit function when click on button', async () => {
    const { props, wrapper } = setup(
      { id: '1', name: 'John Doe' },
      { personalInfo: PERSONAL_INFO }
    )
    const editButton = wrapper.getAllByTestId('filing-person-edit-button')
    expect(editButton).toHaveLength(1)
    await act(async () => {
      await fireEvent.click(editButton[0])
    })
    expect(props.onEdit).toHaveBeenCalled()
    expect(props.onEdit).toHaveBeenCalledWith(props.id)
  })

  it('should show delete button when isOwnPerson property is false', () => {
    const { wrapper } = setup(
      { id: '1', name: 'John Doe', isOwnPerson: false },
      { personalInfo: PERSONAL_INFO }
    )
    expect(wrapper.getByTestId('filing-person-delete-button')).toBeTruthy()
  })

  it('should hide delete button when isOwnPerson property is true', () => {
    const { wrapper } = setup(
      { id: '1', name: 'John Doe', isOwnPerson: true },
      { personalInfo: PERSONAL_INFO }
    )
    expect(wrapper.queryByTestId('filing-person-delete-button')).toBeFalsy()
  })

  it('should open confirmation dialog when click on delete button', async () => {
    const { wrapper } = setup(
      { id: '1', name: 'John Doe' },
      { personalInfo: PERSONAL_INFO }
    )

    const deleteButton = wrapper.getAllByTestId('filing-person-delete-button')
    expect(deleteButton).toHaveLength(1)
    await act(async () => {
      await fireEvent.click(deleteButton[0])
    })
    const buttonElementsHtml = wrapper.getAllByRole('button')

    expect(buttonElementsHtml).toHaveLength(4)
    expect(
      wrapper.getByText('¿Quieres eliminar a esta persona?')
    ).toBeInTheDocument()
    expect(buttonElementsHtml[2].textContent).toEqual('Cancelar')
    expect(buttonElementsHtml[3].textContent).toEqual('Eliminar')
  })

  it('should call onDelete when delete confirmation dialog is confirmed', async () => {
    const onDelete = jest.fn()
    const { wrapper, props } = setup(
      { id: '1', name: 'John Doe', onEdit: jest.fn(), onDelete },
      { personalInfo: PERSONAL_INFO }
    )

    const deleteButton = wrapper.getAllByTestId('filing-person-delete-button')
    expect(deleteButton).toHaveLength(1)
    await act(async () => {
      await fireEvent.click(deleteButton[0])
    })

    const buttonElementsHtml = wrapper.getAllByRole('button')

    await act(async () => {
      await fireEvent.click(buttonElementsHtml[3])
    })
    expect(onDelete).toBeCalled()
    expect(onDelete).toBeCalledWith(props.id)
  })
})
