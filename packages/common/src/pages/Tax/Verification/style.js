import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { media } from '../../../styles/utils'

export const Container = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
`

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

export const ContainerText = styled('div')`
  display: flex;
  justify-content: center;
  flex-direction: column;
`

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

export const Image = styled('img')`
  display: none;
  ${media.lg`
    display:block;
    width: 100%;
  `};
`
