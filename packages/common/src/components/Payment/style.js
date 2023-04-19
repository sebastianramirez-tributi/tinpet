import { css } from '@emotion/core'
import styled from '@emotion/styled'
import Button from 'antd/lib/button'

import { media } from '../../styles/utils'

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

export const TitlePayment = styled('h2')(
  {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  (props) => css`
    color: ${props.theme.colors.disabled.textContrast};
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

export const ButtonSuccess = styled(Button)`
  border-radius: 15px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.06);
  border: solid 1px #e6e6e6;
  background-color: #ffffff;
  padding: 0;
  height: 80px;
  display: flex;
  flex-direction: row;
`

export const Price = styled('span')(
  {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontStretch: 'normal',
    fontStyle: 'normal',
    letterSpacing: 'normal',
    lineHeight: '1.5',
  },
  (props) => css`
    color: ${props.theme.colors.primary.main};
  `
)

export const Error = styled('span')(
  {
    fontStyle: 'italic',
    fontSize: '1rem',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  (props) => css`
    color: ${props.theme.colors.danger.light};
  `
)

export const Image = styled('img')`
  display: none;
  ${media.lg`
display:block
`};
`

export const ContainerImage = styled('div')`
  background-color: #1fbe92;
  border-top-left-radius: 9px;
  height: 78px;
  border-bottom-left-radius: 9px;
  align-items: center;
  justify-content: center;
  display: flex;
`
