import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { YoutubeOutlined as YoutubeOutlinedBase } from '@ant-design/icons'

import { media } from '../../../styles/utils'

export const SummaryHeader = styled.div(
  (props) => css`
    text-align: center;
    border-bottom: 1px solid ${props.theme.colors.gray.line};

    ${media.md`
    padding: 0 0 0.7rem 0;
  `};

    .title {
      color: ${props.theme.colors.disabled.textContrast};
      font-size: 24px;
      font-weight: 700;
      line-height: 1.5;
      margin-bottom: 1rem;

      > span {
        margin-right: 0.5rem;
      }
    }

    .subtitle__container {
      padding: 0 1rem 1rem;
    }

    ${media.md`
    .subtitle__container {
      padding: 0 113px;
    }
  `}

    .subtitle {
      font-size: 1rem;
      font-weight: 300;
      line-height: 1.44;
      color: ${props.theme.colors.disabled.textContrast};
    }
  `
)

export const SummaryFooter = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    text-align: center;
  `,
  media.sm`
    flex-direction: row;
  `
)

export const SummaryFooterDisclaimer = styled.p(
  ({ theme }) => `
    color: ${theme.colors.text.questionRender.label};
    font-size: 0.9rem;
    margin: 0.1rem 0;
    width: 100%;
  `
)

export const OutlineButton = styled.button(
  (props) => css`
    margin: 1rem 0;
    ${media.sm`
    margin: 0 1rem;
  `}
  `
)

export const ButtonImage = styled.img(
  (props) => css`
    margin-right: 0.5rem;
    vertical-align: middle;
    width: 29px;
  `
)

export const Container = styled.div`
  min-height: 55vh;
  display: flex;
  flex-direction: column;
  .ant-spin {
    margin: 0.5rem;
  }
`

export const BoldText = styled.b`
  font-weight: bold;
`

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

export const ChildrenContainer = styled.div`
  &:not(:empty) + section {
    display: none;
  }
`

export const PartialList = styled.ul(
  css`
    list-style: disc;
    padding-left: 2rem;
    text-align: left;
  `,
  media.lg`
    padding-left: 3rem;
  `
)
