import styled from '@emotion/styled'
import { media } from '../../../styles/utils'
import { css } from '@emotion/core'
import { Button } from '@tributi-co/tributi-components'

export const Certificate = styled.div(
  (props) => css`
    border-bottom: 1px solid ${props.theme.colors.gray.line};
  `
)

export const CertificateContent = styled.div(({ theme }) => [
  css`
    width: 100%;
    padding: 0 1rem 0.5rem 1rem;
  `,
  ({ theme }) => css`
    .certificates__container_item {
      display: flex;
      box-sizing: border-box;
      flex-direction: column;
      margin: 0.25rem 0;
      outline-color: transparent;
      padding: 0.5rem 0;
      transition: outline-color 100ms ease;

      &--pending-highlight {
        outline: 2px solid ${theme.colors.warning.outline};
        outline-offset: 2px;
        border-radius: 0.5rem;
      }
    }
  `,
  media.md`
      .certificates__container_item {
        flex-direction: row;
        margin: 0;

        &--pending-highlight {
          outline-offset: 0px;
        }
      }
    `,
  css`
    .certificates__row {
      flex: 1;
    }

    .row__left {
      flex-direction: column;
      min-width: 50%;
      overflow: hidden;
    }

    .row__right {
      align-items: flex-start;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 50%;
      overflow: hidden;
    }

    .certificates__content_title {
      margin-top: 0.3rem;
      margin-bottom: 0.5rem;

      .certificates__title {
        color: ${theme.colors.disabled.textContrast};
        font-family: ${theme.fontFamily.body};
        font-size: 16px;
        font-weight: 700;
        letter-spacing: -0.5px;
        opacity: 0.7;
      }

      .certificates__msg {
        font-size: 13px;
        color: ${theme.colors.iconHelp.main};
      }
    }
  `,
  media.md`
      .row__right {
        padding-right: 0.25rem;
      }

      .certificates__content_title {
        margin-left: 5rem;
        padding-right: 1rem;
      }
    `,
])

export const CertificateHeader = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    padding-top: 0.5rem;
    padding-left: 1rem;
    padding-right: 1rem;

    .certificates__icon_instance {
      width: 2.1rem;
      height: 2.1rem;
      margin-right: 0.5rem;
      ${media.md`
      width: 4rem;
      height: 4rem;
      margin-right: 1rem;
    `};
    }

    .certificates__value {
      color: ${theme.colors.black65};
      font-family: ${theme.fontFamily.body};
      font-size: 1rem;
      font-weight: 700;
      word-break: break-word;
      ${media.md`
      font-size: 20px;
      width: auto;
    `};
    }

    .certificates__icon_remove {
      color: ${theme.colors.black65};
      font-size: 20px;
      margin-left: 0.5rem;

      &:hover {
        color: ${theme.colors.white.main};
      }
    }
  `
)

export const CertificateHeaderTitleContainer = styled.div`
  display: flex;
`

export const DeleteButton = styled(Button)`
  border: none;
  margin-left: 0.5rem;
  span.anticon-delete {
    font-size: 20px;
    margin: 0;
    padding: 0;
  }
`

// This is needed to show the tooltip when the button it's disabled
// https://issuehunt.io/r/ant-design/ant-design/issues/18842
DeleteButton.__ANT_BUTTON = true

export const AccountantCertificate = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 0.5rem;
`

export const AccountantCertificateIcon = styled.span(
  ({ theme }) => `
    color: ${theme.colors.warning.main};
    font-size: 1rem;
    line-height: 1.4rem;
  `
)

export const AccountantCertificateText = styled.span(
  ({ theme }) => `
    color: ${theme.colors.warning.main};
    line-height: 1.4rem;
  `
)

export const Link = styled.a(
  ({ theme }) => css`
    align-items: center;
    display: flex;
    font-weight: 700;
    line-height: 1.5rem;
    margin: 0;

    &,
    &:active,
    &:visited {
      color: ${theme.colors.disabled.textContrast};
      opacity: 0.8;
    }

    &:hover {
      color: ${theme.colors.disabled.textContrast};
      text-decoration: underline;
    }
  `
)
export const QuestionIcon = styled.svg(
  ({ theme }) => css`
    color: ${theme.colors.disabled.textContrast};
    font-size: 1.4em;
    margin-right: 0.25rem;

    & svg {
      height: 1.2rem;
      width: 1.2rem;
    }
  `
)
