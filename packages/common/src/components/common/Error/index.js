import React from 'react'
import { Content, Image, Message } from './style'

const Error = ({ message, icon }) => (
  <Content>
    <Image src={icon} />
    <Message>{message}</Message>
  </Content>
)

export default Error
