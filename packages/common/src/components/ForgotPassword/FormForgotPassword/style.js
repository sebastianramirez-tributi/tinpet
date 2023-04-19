import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { Button } from '@tributi-co/tributi-components'
import { media } from '../../../styles/utils'

export const StyledButton = styled(Button)(
  ({ theme }) => css`
    height: 3.75rem;
    margin-bottom: 1.5rem;
  `
)

export const Title = styled('h2')(
  {
    marginBottom: '1.25rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  (props) => css`
    color: ${props.theme.colors.disabled.textContrast};
    font-family: ${props.theme.fontFamily.body};
    font-size: 1.5rem;
    ${media.md`
      font-size: 1.5rem;
    `};
  `
)

export const Text = styled('p')(
  {
    fontSize: '1rem',
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 'normal',
    letterSpacing: 'normal',
    lineHeight: '1.33',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  (props) => css`
    color: ${props.theme.colors.disabled.textContrast};
    font-family: ${props.theme.fontFamily.body};
  `
)
