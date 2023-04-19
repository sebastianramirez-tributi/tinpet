import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { media } from '../../../styles/utils'
import { YoutubeOutlined as YoutubeOutlinedBase } from '@ant-design/icons'

const successTheme = ({ success, theme }) =>
  success &&
  css`
    color: ${theme.colors.primary.main} !important;
  `

const font20Theme = ({ success, font20 }) =>
  success &&
  font20 &&
  css`
    font-size: 20px !important;
  `

const successThemeText = ({ success }) =>
  success &&
  css`
    font-size: 16px !important;
  `

const MarginBottomLessText = ({ marginBottomLess }) =>
  marginBottomLess &&
  css`
    margin-bottom: 0;
  `

export const Content = styled.div(
  (props) => css`
    align-items: center;
    display: flex;
    flex-direction: column;
    font-family: ${props.theme.fontFamily.body};
    padding: 0 1rem 1rem 1rem;
    text-align: center;
  `,
  ({ borderless, theme }) =>
    !borderless &&
    css`
      border-bottom: 1px solid ${theme.colors.white.dark};
      margin-bottom: 1rem;
    `,
  MarginBottomLessText
)

export const Title = styled.h5(
  (props) => css`
    color: ${props.theme.colors.disabled.textContrast};
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.5;
    max-width: 50rem;
    ${successTheme(props)}
    ${font20Theme(props)}
  `
)

export const Text = styled.p(
  (props) => css`
    color: ${props.theme.colors.black85};
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.44;
    margin-top: 0.625rem;
    max-width: 50rem;
    padding: 0 0.5rem;
    white-space: normal;
    ${successThemeText(props)};
  `,
  media.md`
    white-space: pre-wrap;
  `
)

export const HelpLink = styled.a(
  ({ theme }) => css`
    display: inline-block;
    font-weight: 700;

    &,
    &:hover {
      color: ${theme.colors.black['65']};
    }

    &:hover {
      text-decoration: underline;
    }
  `
)
export const YoutubeOutlined = styled(YoutubeOutlinedBase)(
  ({ theme }) => css`
    color: ${theme.colors.black['65']};
    font-size: 1.25rem;
    margin-right: 0.25rem;
    vertical-align: middle;
  `
)

export const HelpLinkContainer = styled.div(`
  margin-top: 1rem;
`)
