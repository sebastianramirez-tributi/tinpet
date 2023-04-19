import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { Button } from '@tributi-co/tributi-components'

import { media } from '../../../styles/utils'

export const Title = styled('h3')(
  {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  (props) => css`
    color: ${props.theme.colors.primary.main};
    margin-bottom: 1.25rem;
    ${media.lg`
      margin-bottom: 3.12rem;
    `};
  `
)

export const Text = styled('p')(
  {
    fontSize: '1rem',
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: '1.5em',
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

export const StyledButton = styled(Button)`
  margin-top: 1.5rem;
  margin-left: 0;
  ${media.lg`
  margin-left: 1rem;
  max-width: ${(1 / 4) * 100}%;
  `};
`

export const ContainerText = styled('div')`
  display: flex;
  justify-content: center;
  flex-direction: column;
`

export const ContainerButton = styled('div')`
  flex-wrap: wrap-reverse;
  ${media.lg`
    margin-top: 1rem;
  `};
`
