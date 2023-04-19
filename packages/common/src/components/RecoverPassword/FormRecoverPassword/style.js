import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { Button } from '@tributi-co/tributi-components'
import { media } from '../../../styles/utils'

export const StyledButton = styled(Button)({
  letterSpacing: '-0.06px',
  lineHeight: 1.5,
})

export const Title = styled('h2')(
  {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1.25rem',
  },
  (props) => css`
    font-family: ${props.theme.fontFamily.body};
    color: ${props.theme.colors.disabled.textContrast};
    font-size: 1.5rem;
    ${media.md`
    font-size: 1.5rem;
    `};
  `
)

export const Text = styled('p')(
  {
    fontSize: '1rem',
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontStretch: 'normal',
    fontStyle: 'normal',
    letterSpacing: 'normal',
    lineHeight: '1.33',
  },
  (props) => css`
    font-family: ${props.theme.fontFamily.body};
    color: ${props.theme.colors.disabled.textContrast};
  `
)
