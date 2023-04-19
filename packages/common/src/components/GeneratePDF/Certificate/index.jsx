import React from 'react'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Link, ContainerText, Help, Container } from './style'
import { REQUIREMENT_LEVEL_MESSAGE } from '../constants'

const Certificate = ({
  text,
  required_level: level,
  values: { certificate_url: url = '' } = {},
}) => (
  <Container className="row">
    <ContainerText className="col-xs-12 col-lg-6">
      <Link target="_blank" href={url}>
        {text}
      </Link>
      <span>* {REQUIREMENT_LEVEL_MESSAGE[level]}</span>
    </ContainerText>
    {url && (
      <Help className="col-xs-12 col-lg-6">
        <QuestionCircleOutlined />
        <span>{'¿Cómo conseguirlo?'}</span>
        <a target="_blank" href={url}>
          {'Click Aquí.'}
        </a>
      </Help>
    )}
  </Container>
)

export default Certificate
