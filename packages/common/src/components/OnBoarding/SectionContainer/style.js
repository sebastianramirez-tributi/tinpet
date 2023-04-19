import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { media } from '../../../styles/utils'
import { Button } from '@tributi-co/tributi-components'

export const Container = styled.div(
  (props) => css`
    display: flex;
    flex-direction: column;
    min-height: 55vh;
    ${media.md`
    > div {
      &:not(:first-of-type) {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  `}
  `
)

export const NextButton = styled(Button)`
  margin: 0.5rem 0.2rem;
`
