import React from 'react'
import Icon from 'antd/lib/icon'
import { Container, ContainerInfo, ContainerIcon, Text, Title } from './style'

const DeclareSura = (props) => {
  const { title, detail, big, classIcon, icon, column } = props
  return (
    <Container border={column} big={big}>
      <ContainerInfo>
        <ContainerIcon big={big}>
          <Icon className={classIcon} type={icon} theme="filled" />
        </ContainerIcon>
        {!big && <Title>{title}</Title>}
      </ContainerInfo>
      <Text>{detail}</Text>
    </Container>
  )
}

export default DeclareSura
