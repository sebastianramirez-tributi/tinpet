import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'antd'

import { StyledInput } from './styles'

const noop = () => {}
const FormItem = Form.Item

const InputVideoValidator = ({
  form,
  inputValue,
  handleChange,
  handleInputError,
  inputName,
  placeholder,
  inputValidator,
}) => {
  const validator = useMemo(
    () => (inputValidator ? inputValidator(handleInputError, inputName) : noop),
    [inputValidator, handleInputError, inputName]
  )

  const handleChangeInput = (event) => handleChange(inputName, event)

  // Should enable the button when there is an initial value
  // Or mark as disabled if there is not
  useEffect(() => {
    handleInputError(inputName, !inputValue)
  }, [])

  return (
    <Form form={form} initialValues={{ [inputName]: inputValue }}>
      <FormItem name={inputName} rules={[validator]}>
        <StyledInput
          value={inputValue}
          onChange={handleChangeInput}
          placeholder={placeholder}
          data-testid={`input-link-${inputName}`}
        />
      </FormItem>
    </Form>
  )
}

InputVideoValidator.propTypes = {
  form: PropTypes.any,
  inputValue: PropTypes.string,
  handleChange: PropTypes.func,
  handleInputError: PropTypes.func,
  inputValidator: PropTypes.func,
  inputName: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
}

InputVideoValidator.defaultProps = {
  inputValue: '',
  handleChange: () => {},
  inputValidator: null,
}

export default InputVideoValidator
