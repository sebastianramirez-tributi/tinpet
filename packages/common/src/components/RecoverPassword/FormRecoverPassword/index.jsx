import React, { Fragment, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'
import { Title, Text, StyledButton } from './style'
const SIZE_TRANSFORM = {
  large: 'lg',
  default: 'md',
  small: 'sm',
}

const FormItem = Form.Item
const { Password } = Input

const FormRecoverPassword = ({
  submitDisabled,
  handleSubmit,
  comparePassword,
  size,
  shouldConfirm,
  showHeader,
}) => {
  const transformedSize = useMemo(() => SIZE_TRANSFORM[size], [size])
  return (
    <Fragment>
      <Form onFinish={handleSubmit}>
        {showHeader && (
          <Fragment>
            <Title>{'Recuperar Contraseña'}</Title>
            <Text>{'Por favor ingresa tu nueva contraseña'}</Text>
          </Fragment>
        )}
        <FormItem
          name="password"
          rules={[
            {
              required: true,
              message: 'Por favor ingresa tu contraseña',
            },
          ]}
        >
          <Password size={size} placeholder="Contraseña nueva" />
        </FormItem>
        {shouldConfirm && (
          <FormItem
            dependencies={['password']}
            name="confirm"
            rules={[
              {
                required: true,
                message: 'Por favor ingresa tu contraseña',
              },
              comparePassword,
            ]}
          >
            <Password size={size} placeholder="Confirmar contraseña" />
          </FormItem>
        )}
        <StyledButton
          loading={submitDisabled}
          spin={submitDisabled}
          fullWidth
          size={transformedSize}
          type="submit"
        >
          Actualizar Contraseña
        </StyledButton>
      </Form>
    </Fragment>
  )
}

FormRecoverPassword.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  shouldConfirm: PropTypes.bool,
  showHeader: PropTypes.bool,
  submitDisabled: PropTypes.bool,
  comparePassword: PropTypes.func,
  size: PropTypes.string,
}

FormRecoverPassword.defaultProps = {
  shouldConfirm: false,
  showHeader: true,
  size: 'large',
}

export default FormRecoverPassword
