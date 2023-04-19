import React from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'

const displayAlign = css`
  align-items: center;
  display: flex;
  justify-content: center;
`

export const CardHeader = styled('div')(
  ({ theme }) => css`
    ${displayAlign}
    border-bottom: 1px solid ${theme.colors.gray.line};
    padding: 1rem 2rem;
  `
)

export default CardHeader
