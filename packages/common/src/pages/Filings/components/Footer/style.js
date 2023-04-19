import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { Button } from '@tributi-co/tributi-components'

export const FooterStyled = styled.div(
  css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0rem 2rem 2rem;
  `
)

export const StyledButton = styled(Button)`
  height: 3.1rem;
  margin-top: 1.25rem;
  width: 12.5rem;
`

export const SmallText = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.gray.dusty};
    font-size: 15px;
  `
)
