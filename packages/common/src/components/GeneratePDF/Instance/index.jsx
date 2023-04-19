import React from 'react'
import { ContainerImage, Container, ContainerInfo } from './style'
import Certificate from '../Certificate'

const Instance = ({ group_code: code, value, certificates }) => {
  return (
    <Container className="col-xs-12">
      <ContainerImage>
        <img src={`/images/icons/onboarding/${code}.svg`} alt={value} />
        <span>{value}</span>
      </ContainerImage>
      <ContainerInfo>
        {certificates.map((certificate) => (
          <Certificate key={certificate.code} {...certificate} />
        ))}
      </ContainerInfo>
    </Container>
  )
}

export default Instance
