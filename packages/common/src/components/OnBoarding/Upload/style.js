import styled from '@emotion/styled'
import { media } from '../../../styles/utils'
import { css } from '@emotion/core'

export const UploadRow = styled.div(
  (props) => css`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    ${media.md`
    flex-direction: row;
  `};
    .upload__icon_container {
      flex: 1;
    }
    .upload__column {
      flex: 2;
    }
    .upload__buttons {
      ${uploadButtons(props)}
    }
  `
)

export const UploadColumn = styled.div`
  align-items: center;
  display: flex;
`

export const UploadButtons = styled.div(
  (props) => css`
    ${uploadButtons(props)}
  `
)

const uploadButtons = (props) => css`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 2;
  width: 100%;
  & > * {
    margin: 0.3rem 0;
  }
  .ant-upload-disabled,
  .ant-upload.ant-upload-disabled {
    cursor: default !important;
  }
  ${media.md`
    flex-direction: row;
    flex-wrap: wrap;
    & > * {
      flex: 1;
      margin: 0 0.3rem;
    }
  `};
`

export const UploadFeedback = styled.div(
  ({ theme }) => css`
    align-items: center;
    color: ${theme.colors.primary.active};
    display: flex;
    font-size: 13px;
    margin: 0.5rem 0 1rem 0;

    &:empty {
      margin: 0;
    }

    .upload__feedback_icon {
      font-size: 1.3rem;
      margin-right: 0.3rem;
    }
  `
)

export const Container = styled.div(
  ({ theme }) => css`
    color: ${theme.colors.black65};
    width: 100%;

    .upload__container {
      align-items: center;
      display: flex;

      .upload__help_icon {
        margin-right: 1rem;
      }

      .upload__icon {
        align-items: center;
        color: ${theme.colors.disabled.textContrast};
        display: flex;
        font-size: 1.3rem;
        font-weight: 300;
        margin-right: 0.3rem;
      }

      .upload__icon_checked {
        background-color: ${theme.colors.icon.done};
        border-radius: 50%;
        border: 2px solid ${theme.colors.icon.done};
        color: ${theme.colors.white.main};
        font-size: 1.4rem;
        text-align: center;
      }

      .upload__buttons_assistant {
        grid-template-columns: 1fr 1fr 1fr;
      }

      .upload__icon_container {
        padding-right: 2px;
        ${media.lg`
        min-width: 31%;
      `};
      }

      .upload__container_button_order {
        order: 1;
        ${media.md`
        margin-left: 0.5rem;
      `}
      }

      .upload__icon_text:hover {
        cursor: pointer;
        text-decoration: underline;
      }

      .upload__icon_partial {
        background-color: ${theme.colors.primary.active};
        border-radius: 50%;
        border: 1px solid ${theme.colors.primary.active};
      }

      .upload__container_button {
        display: flex;
        height: auto;
        padding: 0;

        .ant-upload {
          width: 100%;
        }

        .ant-upload {
          margin: 0;
        }
      }

      .upload__button_full_width {
        grid-template-columns: 1fr;
      }

      .upload__button_download {
        text-align: center;
        text-decoration: none;
        ${media.md`
        margin-right: 0.5rem;
      `}
      }

      .certificate-done {
        display: inline-block;
        margin: 6% 9% 0% 9%;
        i {
          background-color: ${theme.colors.icon.done};
          border-radius: 100%;
          border: 1px solid ${theme.colors.icon.done};
          color: ${theme.colors.white.main};
          display: inherit;
          display: inline-block;
          font-size: 22px;
          margin: 0px;
        }
      }
    }

    .upload__feedback_tooltip {
      max-width: 750px;
      width: 100%;

      .ant-tooltip-content .ant-tooltip-inner {
        color: ${theme.colors.black.main};
        background-color: ${theme.colors.white.main};
      }
    }
  `
)

export const MessageOcrStatus = styled.div(
  ({ theme }) => css`
    display: flex;
    margin-top: 1.25rem;
    svg {
      fill: ${theme.colors.primary.active};
      font-size: 1.2rem;
    }
  `,
  media.sm`
    font-size: 1rem;
    margin-top: 1rem;
  `
)
export const TextMessageOcrStatus = styled.p(
  ({ theme }) => css`
    color: ${theme.colors.primary.active};
    margin-left: 1rem;
  `,
  media.sm`
    display: flex;
    font-size: 0.8rem;
    margin-left: 0.5rem;
  `
)
