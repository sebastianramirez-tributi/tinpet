import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { media } from '../../styles/utils'

export const Container = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;
`

export const Body = styled('div')(
  (props) => css`
    border-radius: 1rem;
    ${media.md`
      margin: 2rem 0;
    `}
    @media print {
      @media print width: 100%;
      border-radius: 0;
      box-shadow: none;
    }
  `
)
