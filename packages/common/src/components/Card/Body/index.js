import React from 'react'
import styled from '@emotion/styled'

const CardBody = styled('div')`
  padding: 2rem;
  @media print {
    padding: 0.6rem;
  }
`

export default ({ children }) => (
  <CardBody data-testid="card-body">{children}</CardBody>
)
