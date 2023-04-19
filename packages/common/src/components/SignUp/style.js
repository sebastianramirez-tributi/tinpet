import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { media } from '../../styles/utils'

import { Button } from '@tributi-co/tributi-components'

export const StyledButton = styled(Button)({
  letterSpacing: '-0.06px',
  lineHeight: 1.5,
  'margin-top': '0.5rem',
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
  `
)

export const Image = styled('img')`
  width: 5rem;
`

export const ImagenTributi = styled('img')`
  margin-top: 0.6rem;
  width: 3.5rem;
`

export const ContainerImage = styled('div')`
  display: flex;
  align-items: center;
  margin-top: -2.3rem;
`

export const ContainerGroup = styled('div')`
  display: flex;
  flex-direction: column;
  ${media.lg`
    flex-direction: row;
  `};
`

export const LinkTerm = styled('a')(
  (props) => css`
    color: ${props.theme.colors.black65};
    text-decoration: underline;
  `
)

export const ContainerCheckbox = styled('div')`
  text-align: left;
`
