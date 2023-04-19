import React from 'react'
import { ContainerTitle } from './style'
import Instance from '../Instance'

const Section = ({ text, children }) => {
  return (
    <div className="row center-xs">
      <ContainerTitle className="col-xs-12">
        <span>{text}</span>
      </ContainerTitle>
      {children
        .filter((instance) => instance.certificates.length > 0)
        .map((instance) => (
          <Instance key={instance.code} {...instance} />
        ))}
    </div>
  )
}

export default Section
