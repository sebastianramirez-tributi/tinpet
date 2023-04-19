import styled from '@emotion/styled'
import { media } from '../../../styles/utils'
import { css } from '@emotion/core'
import { Button } from '@tributi-co/tributi-components'

export const StyledButton = styled(Button)`
  font-size: 16px;
  padding: 1.2rem 3rem;
`
export const CancelButton = styled(StyledButton)(
  `
    margin: 0;
    margin-bottom: 1rem;
  `,
  media.md`
    margin-bottom: 0;
  `,
  ({ withMargin }) =>
    withMargin &&
    `
    margin-right: 1.5rem;
  `
)

export const ButtonsContainer = styled.div(
  css`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1rem 0;
  `,
  media.md`
    flex-direction: row;
  `
)

export const Container = styled.div`
  ${media.md`
    padding: 0 1.25rem 1rem;
  `}
`

export const InlineIcon = styled.svg(
  ({ theme }) => css`
    background-color: ${theme.colors.warning.dark};
    border-radius: 50%;
    border: solid 1px ${theme.colors.warning.dark};
    color: ${theme.colors.white.main};
    margin-right: 0.5rem;
    padding: 0.1rem;
  `
)
