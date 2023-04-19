import React from 'react'
import { fireEvent, act } from '@testing-library/react'

import {
  mockWithProviders,
  themeProvider,
} from '../../../../helpers/__mocks__/mock-providers'

import { PersonForm, FORM_CONTROLS } from '../../../../components/PersonForm'

const formConfig = [
  FORM_CONTROLS.FORM_CONTROL_NAME,
  FORM_CONTROLS.FORM_CONTROL_SURNAME,
  FORM_CONTROLS.FORM_CONTROL_DOCUMENT_ID,
  FORM_CONTROLS.FORM_CONTROL_RELATIONSHIP,
  FORM_CONTROLS.FORM_CONTROL_PHONE,
]

const setup = (baseProps) => {
  const props = {
    onSubmit: jest.fn(),
    formConfig,
    ...baseProps,
  }
  const wrapper = mockWithProviders(<PersonForm {...props} />, [
    themeProvider(),
  ])
  return { props, wrapper }
}

describe('PersonForm spec', () => {
  let props = null
  let wrapper = null

  it('should render personform', () => {
    const { wrapper } = setup()
    const INPUT_TEXT_EXPECTED = 3
    const INPUT_SELECT_EXPECTED = 2

    const textInputs = wrapper.getAllByRole('textbox')
    const selectInputs = wrapper.getAllByRole('combobox')

    expect(textInputs).toHaveLength(INPUT_TEXT_EXPECTED)
    expect(selectInputs).toHaveLength(INPUT_SELECT_EXPECTED)

    expect(wrapper.getByText('Editar persona')).toBeTruthy()
    expect(wrapper.getByText('Nombres')).toBeTruthy()
    expect(wrapper.getByText('Apellidos')).toBeTruthy()
    expect(wrapper.getByText('Documento de identidad')).toBeTruthy()
    expect(wrapper.getByText('Tipo de documento')).toBeTruthy()
    expect(wrapper.getByText('Relación con la persona')).toBeTruthy()
  })

  describe('New Person Form', () => {
    beforeEach(() => {
      const component = setup({ new: true })
      props = component.props
      wrapper = component.wrapper
    })

    it('should show new title when form is for new person', () => {
      expect(wrapper.getByTestId('person-form-title').textContent).toContain(
        'Agregar nueva persona'
      )
    })

    it('should not call submit when form is submit if form is empty', async () => {
      const submit = wrapper.getByRole('button')
      await act(async () => {
        await fireEvent.click(submit)
      })
      expect(props.onSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Update Person Form', () => {
    it('should show edit title when form is for existing person', () => {
      const { wrapper } = setup({ new: false })
      expect(wrapper.getByTestId('person-form-title').textContent).toContain(
        'Editar persona'
      )
    })
  })
})
