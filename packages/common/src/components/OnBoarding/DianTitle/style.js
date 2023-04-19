import { css } from '@emotion/core'
import styled from '@emotion/styled'

const successTheme = ({ success, theme }) =>
  success &&
  css`
    color: ${theme.colors.primary.main} !important;
    font-size: 22px !important;
  `

const loadingTheme = ({ loading, theme }) =>
  loading &&
  css`
    color: ${theme.colors.primary.main} !important;
    font-size: 20px !important;
  `

const successThemeText = ({ success }) =>
  success &&
  css`
    font-size: 16px !important;
  `

export const Content = styled.div(
  (props) => css`
    font-family: ${props.theme.fontFamily.body};
    margin-bottom: 1rem;
    text-align: center;
  `
)

export const Title = styled.h5(
  (props) => css`
    color: ${props.theme.colors.disabled.textContrast};
    font-size: 18px;
    font-weight: 700;
    line-height: 1.5;
    ${successTheme(props)}
    ${loadingTheme(props)}
  `
)

export const Text = styled.p(
  (props) => css`
    color: ${props.theme.colors.black.main};
    font-size: 16px;
    font-weight: 300;
    line-height: 1.44;
    margin: 0.625rem auto;
    width: 65%;
    ${successThemeText(props)}
  `
)
