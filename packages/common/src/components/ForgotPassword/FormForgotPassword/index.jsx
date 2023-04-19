import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Form, Input } from 'antd'
import { Title, Text, StyledButton } from './style'

const FormItem = Form.Item

const FormForgotPassword = ({ handleSubmit }) => {
  return (
    <Fragment>
      <Form onFinish={handleSubmit}>
        <Title>{'Recuperar Contraseña'}</Title>
        <Text>
          Por favor ingresa tu <strong>correo electrónico</strong> y te
          enviaremos un mensaje con las instrucciones
        </Text>
        <FormItem
          name="email"
          validateTrigger="onBlur"
          rules={[
            {
              type: 'email',
              message: 'Por favor ingresa un formato válido de email',
            },
            {
              required: true,
              message: 'Por favor ingresa tu correo electrónico',
            },
          ]}
        >
          <Input size={'large'} placeholder={'Correo Electrónico'} />
        </FormItem>
        <StyledButton fullWidth size="lg" type="submit">
          Recuperar contraseña
        </StyledButton>
      </Form>
    </Fragment>
  )
}

FormForgotPassword.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
}

export default FormForgotPassword
