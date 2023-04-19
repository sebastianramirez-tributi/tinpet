import styled from '@emotion/styled'
import { media, maxMedia } from '../../../styles/utils'
import { css } from '@emotion/core'
import {
  Button,
  QuestionRenderError as QuestionRenderErrorBase,
} from '@tributi-co/tributi-components'

export const AddButton = styled(Button)(
  ({ theme }) => css`
    margin-left: 20px;
    margin-top: 7px;
    padding: 1rem;
    width: 90%;
    span {
      margin-left: 0.4rem;
    }
    ${maxMedia.lg`
      margin: 0.5rem auto;
      display: block;
  `}
  `
)

export const ItemWrapper = styled.div(
  (props) => css`
  display: flex;
  flex-direction: row;
  width: 100%;
  aside {
    flex-basis: 40%:
  }
  main {
    flex-basis: 60%:
  }
  ${maxMedia.lg`
    flex-direction: column;
    padding: 0 0.5rem;
  `}
  ${asideContainer(props)}
`
)

export const QRCContainer = styled.div(
  (props) => css`
    background: ${props.theme.colors.white.main};
    border-radius: 10px;
    border: solid 2px ${props.theme.colors.gray.line};
    box-shadow: 0 2px 20px 0 ${props.theme.colors.black06};
    min-height: 100%;
    padding: 0 1rem;

    .ant-form-item {
      flex-wrap: nowrap;

      .ant-col {
        width: auto;
      }

      label {
        height: 100%;
      }
    }
  `
)

const asideHeaderMobile = (props) => css`
  ${maxMedia.lg`
    aside {
      flex: auto !important;
      max-width: 100% !important;
      min-width: 100% !important;
      width: 100% !important;
      .ant-menu-item {
        border-radius: 10px;
        border-right: solid 2px ${props.theme.colors.gray.line};
      }
      .ant-menu {
        padding: 0 0.5rem;
      }
    }
  `}
`

const asideContainer = (props) => css`
  ${asideHeaderMobile(props)}

  .ant-layout-sider {
    background: transparent;
  }

  .ant-layout-sider-children {
    background: ${props.theme.colors.white.main};
  }

  .ant-menu {
    border: none;
    margin-top: 1rem;
    &:not(.ant-menu-horizontal) {
      .ant-menu-item-selected {
        background: ${props.theme.colors.white.main};
      }
    }
  }

  .ant-menu-item {
    align-items: center;
    background: #f6f6f7;
    border-radius: 10px 0 0 10px;
    border-right: none;
    border: solid 2px ${props.theme.colors.gray.line};
    display: flex;
    min-height: 70px;
    height: max-content;
    justify-content: space-between;
    padding: 0 15px;
    &:hover {
      color: inherit;
    }

    &:after {
      border-right: 3px solid ${props.theme.colors.white.main};
    }

    .text-icon {
      align-items: center;
      display: flex;
      justify-content: center;
      max-width: 100%;
      max-height: 100%;

      img {
        display: none;
        margin: 0 10px;
        width: 40px;
      }
      img.normal {
        display: inline-block;
      }
      .icon_delete {
        margin-right: 0;
      }
    }

    .text-item-tree {
      flex: 1;
      font-size: 16px;
      font-weight: 200;
      line-height: 1;
      vertical-align: middle;
      white-space: pre-wrap;
      padding: 0.5rem 0;
    }

    .icon_delete {
      font-size: 16px !important;
      border: 1px solid ${props.theme.colors.gray.line};
      min-width: 28px;
    }

    &.ant-menu-item,
    &.ant-menu-item-selected {
      ${media.lg`
        margin-left: 1px;
        margin-top: 0;
      `}
    }

    &.ant-menu-item-selected {
      color: ${props.theme.colors.disabled.textContrast};
      .text-icon {
        img {
          display: none;
        }
        img.selected {
          display: inline-block;
        }
      }
      .text-item-tree {
        font-weight: 600;
      }
      ${media.lg`
        border-width: 2px 0 2px 2px;
      `}
    }
  }

  .circle-cont {
    background: ${props.theme.colors.white.main};
    border-radius: 50px;
    border: 1px solid ${props.theme.colors.highlight.main};
    color: ${props.theme.colors.highlight.main};
    display: inline-block;
    font-weight: 600;
    height: 25px;
    line-height: 23px;
    margin-right: 10px;
    margin: auto;
    text-align: center;
    width: 25px;

    &--complete {
      background-color: ${props.theme.colors.primary.main};
      border: 1px solid ${props.theme.colors.primary.main};
      color: ${props.theme.colors.white.main};
    }

    &--partial {
      border: solid 1px ${props.theme.colors.warning.dark};
      background-color: ${props.theme.colors.warning.dark};
      color: ${props.theme.colors.white.main};
    }
  }
  .icon-check-tree {
    color: ${props.theme.colors.primary.main};
    font-size: 23px;
    margin: 10px;
  }
`

export const DeleteButton = styled(Button)`
  span.anticon-delete {
    font-size: 16px;
    margin: 0;
    padding: 0;
  }
`

export const QuestionRenderError = styled(QuestionRenderErrorBase)(
  ({ theme }) => css`
    padding-top: 2rem;
    text-align: center;
  `
)
