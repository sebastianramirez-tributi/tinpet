import React from 'react'
import { act, fireEvent } from '@testing-library/react'
import {
  mockWithProviders,
  themeProvider,
} from '../../../../helpers/__mocks__/mock-providers'
import InputURLValidator from '../InputURLValidator'
import { useForm } from 'antd/lib/form/Form'
import { ruleVimeoValidator } from '../InputURLValidator/validations'

const mockInputValidator = jest.fn()

const setup = (initialProps = {}) => {
  let form
  const props = {
    inputName: 'video',
    placeholder: 'placeholder',
    handleChange: jest.fn(),
    handleInputError: jest.fn(),
    inputValidator: () => mockInputValidator,
    ...initialProps,
  }

  const Component = () => {
    const [internalForm] = useForm()
    form = internalForm

    return <InputURLValidator {...props} form={internalForm} />
  }

  const wrapper = mockWithProviders(<Component />, [themeProvider()])

  return { wrapper, props, form }
}

describe('<InputURLValidator /> specs', () => {
  beforeEach(() => {
    mockInputValidator.mockClear()
  })

  it('should call `handleChange` on input change', () => {
    const { wrapper, props } = setup()
    const input = wrapper.getByRole('textbox')
    act(() => {
      fireEvent.change(input, { target: { value: 'change' } })
    })
    expect(props.handleChange).toHaveBeenCalled()
  })

  it('should call `inputValidator` on input change', () => {
    const { wrapper } = setup()
    const input = wrapper.getByRole('textbox')
    act(() => {
      fireEvent.change(input, { target: { value: 'change' } })
    })
    expect(mockInputValidator).toHaveBeenCalled()
  })

  it('should call `handleInputError` with true value when input change to invalid value', async () => {
    const INVALID_VALUE = 'invalid value'
    const { wrapper, props, form } = setup({
      inputValidator: ruleVimeoValidator,
    })

    const input = wrapper.getByRole('textbox')
    await act(async () => {
      fireEvent.change(input, { target: { value: INVALID_VALUE } })
      await form.validateFields().catch((e) => null)
    })
    expect(props.handleInputError).toHaveBeenCalledWith(props.inputName, true)
  })

  it('should call `handleInputError` with false value when input change to valid value', async () => {
    const VALID_VALUE = 'https://www.vimeo.com/testing-url'
    const { wrapper, props, form } = setup({
      inputValidator: ruleVimeoValidator,
    })
    const input = wrapper.getByRole('textbox')
    await act(async () => {
      fireEvent.change(input, { target: { value: VALID_VALUE } })
      await form.validateFields()
    })
    expect(props.handleInputError).toHaveBeenCalledWith(props.inputName, false)
  })

  it('should call `handleInputError` with false value when video prop has a value', () => {
    const VIDEO = 'https://www.loom.com/testing-url'
    const { props } = setup({ inputValue: VIDEO })
    expect(props.handleInputError).toHaveBeenCalledWith(props.inputName, false)
  })
})
