import { css } from '@emotion/core'
import styled from '@emotion/styled'

import { Button } from '@tributi-co/tributi-components'

export const StyledButton = styled(Button)(
  ({ theme }) => css`
    margin-bottom: 1.5rem;
  `
)

export const ForgotPassword = styled('div')(
  (props) => css`
    text-align: center;

    a {
      color: ${props.theme.colors.primary.main};
      font-family: ${props.theme.fontFamily.body};
      font-size: 1.12rem;
      font-stretch: normal;
      font-style: normal;
      font-weight: normal;
      letter-spacing: normal;
      line-height: 1.33;
      text-decoration: none;
      transition: 400ms;
      &:hover {
        text-decoration: underline;
      }
    }
  `
)

export const Title = styled('h2')(
  {
    fontWeight: 'bold',
    marginBottom: '1.25rem',
    textAlign: 'center',
  },
  (props) => css`
    color: ${props.theme.colors.disabled.textContrast};
    font-family: ${props.theme.fontFamily.body};
    font-size: 1.5rem;
  `
)
