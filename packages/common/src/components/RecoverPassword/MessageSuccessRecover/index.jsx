import React from 'react'
import { CheckCircleOutlined } from '@ant-design/icons'
import { Title, Icon, Container } from './style'

const MessageSuccessRecover = () => {
  return (
    <Container>
      <Icon className="col-xs-12 col-md-12" as={CheckCircleOutlined} />
      <Title>{'¡Tu contraseña ha sido cambiada!'}</Title>
    </Container>
  )
}

export default MessageSuccessRecover
