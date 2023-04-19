import React, { Fragment } from 'react'
import { CheckCircleOutlined } from '@ant-design/icons'
import { Title, Text, Icon, Container } from './style'

const MessageSendEmail = () => {
  return (
    <Container>
      <Icon className="col-xs-12 col-md-12" as={CheckCircleOutlined} />
      <Title>Solicitud Enviada</Title>
      <Text>
        Por favor revisa tu <strong>correo electrónico</strong>, si ingresaste
        una cuenta de correo válida, te enviaremos un mensaje para completar el
        proceso de recuperación de tu contraseña.
      </Text>
    </Container>
  )
}

export default MessageSendEmail
