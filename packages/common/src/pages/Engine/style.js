import { css } from '@emotion/core'
import styled from '@emotion/styled'
import Steps from 'antd/lib/steps'
import { Button } from '@tributi-co/tributi-components'
import { media } from '../../styles/utils'

export const Container = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;
`

export const Header = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

export const ContainerText = styled('div')`
  display: flex;
  justify-content: center;
  flex-direction: column;
`

export const Title = styled('h3')(
  {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1.25rem',
  },
  (props) => css`
    font-family: ${props.theme.fontFamily.body};
    color: ${props.theme.colors.primary.main};
  `
)

export const ContainerEngine = styled('div')(
  (props) => css`
    border-radius: 0.9rem;
    box-shadow: 0 2px 10px ${props.theme.colors.black06};
    border: 1px solid ${props.theme.colors.gray.line};
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    ${media.lg`
      margin-top: 1.5rem;
    `};
    p {
      padding: 0.5rem;
    }
  `
)

export const ImageCalendar = styled('img')(
  (props) => css`
    display: none;
    ${media.lg`
      display:block;
      background-color: ${props.theme.colors.primary.main};
      display: flex;
      height: 7.25rem;
      justify-content: center;
      border-radius: 14px 14px 0 0;
      padding: 1.65rem;
    `};
  `
)

export const Text = styled('p')(
  {
    fontSize: '0.9rem',
    fontWeight: 'normal',
    textAlign: 'left',
    margin: '0.5rem',
    fontStretch: 'normal',
    fontStyle: 'normal',
    letterSpacing: 'normal',
    lineHeight: '1.33',
  },
  (props) => css`
    font-family: ${props.theme.fontFamily.body};
    color: ${props.theme.colors.disabled.textContrast};
    ${media.lg`
      font-size: 1rem;
    `};
  `
)

export const StyledButton = styled(Button)`
  margin-top: 0;
  ${media.lg`
    margin-top: 1.5rem;
    max-width: ${(5 / 12) * 100}%;
  `};
`

export const ContainerSteps = styled('div')(
  (props) => css`
    margin-top: 1.5rem;
    margin-bottom: 1.25rem;
    ${media.lg`
      border-radius: 0.9rem;
      box-shadow: 0 2px 10px 0 ${props.theme.colors.black06};
      border: solid 1px ${props.theme.colors.gray.line};
      padding-top: 1.25rem;
      padding-bottom: 1.25rem;
    `}
    p {
      text-align: center;
      font-weight: bold;
    }
  `
)

export const StepsC = styled(Steps)(
  (props) => css`
    &.ant-steps-horizontal,
    .ant-steps-label-horizontal {
      display: block;

      div.ant-steps-item {
        display: block;
        overflow: visible;
        padding: 0;
      }
      div.ant-steps-item-tail {
        display: block;
        position: absolute;
        top: 0;
        left: 16px;
        width: 1px;
        height: 100%;
        padding: 38px 0 6px;
        &::after {
          width: 1px;
          height: 100%;
        }
      }

      div.ant-steps-item-icon {
        float: left;
        margin-right: 1rem;
      }
      div.ant-steps-item-content {
        display: block;
        min-height: 3rem;
        overflow: hidden;
        .ant-steps-item-title::after {
          content: none;
        }
      }
    }

    div.ant-steps-item.ant-steps-item-finish,
    div.ant-steps-item.ant-steps-item-wait,
    div.ant-steps-item.ant-steps-item-process {
      margin-right: 0;
    }

    .ant-steps-item-finish {
      .ant-steps-item-container {
        .ant-steps-item-tail {
          &::after {
            background-color: ${props.theme.colors.primary.main};
          }
        }
        .ant-steps-item-icon {
          border: 1px solid ${props.theme.colors.primary.main};
          .ant-steps-icon {
            color: ${props.theme.colors.primary.main};
          }
        }
        .ant-steps-item-content .ant-steps-item-title {
          color: ${props.theme.colors.black65};
        }
      }
    }

    .ant-steps-item-process {
      .ant-steps-item-container {
        .ant-steps-item-icon {
          background-color: ${props.theme.colors.primary.main};
          width: 2rem;
          height: 2rem;
          border-radius: 2rem;
          .ant-steps-icon {
            color: ${props.theme.colors.white.main};
          }
        }
      }
    }

    .ant-steps-item-wait {
      .ant-steps-item-title {
        color: ${props.theme.colors.gray.ghost};
      }
    }

    .ant-steps-item-container {
      .ant-steps-item-content {
        text-align: left;
      }
    }

    ${media.lg`
      &.ant-steps-horizontal,
      .ant-steps-label-horizontal {
        display: flex;
        justify-content: space-around;
        div.ant-steps-item {
          margin-right: 0;
        }
        div.ant-steps-item-tail {
          display: none;
        }
      }

      .ant-steps-item {
        flex: none;

        &:first-of-type {
          &:before {
            content:none;
          }
        }

        &:last-child {
          &:after {
            content:none;
          }
        }

        &:after {
          content: "";
          width: 20%;
          background: ${props.theme.colors.gray.ghost};
          height: 1px;
          position: absolute;
          right: 0;
          top: 0;
          bottom: 1.9rem;
          margin: auto;
        }

        &:before {
          content: "";
          width: 20%;
          background: ${props.theme.colors.gray.ghost};
          height: 1px;
          position: absolute;
          left: 0;
          top: 0;
          bottom: 1.9rem;
          margin: auto;
        }
      }

      .ant-steps-item-finish {
        &:before {
          background: ${props.theme.colors.primary.main};
        }
        &:after {
          background: ${props.theme.colors.primary.main};
        }
      }

      .ant-steps-item-process {
        &:before {
          background: ${props.theme.colors.primary.main};
        }
      }

      .ant-steps-item-container {
        outline: none;
        align-items: center;
        display: flex;
        flex-direction: column;
        width: 10.9rem;
      }

      .ant-steps-item-title {
        padding-right: 0px;
        &::after {
          content: none;
        }
      }
    `};
  `
)

export const ClipboardDek = styled.span(
  ({ theme }) => css`
    border-radius: 8px 0 0 8px;
    border: 1px solid ${theme.colors.black15};
  `
)

// TODO Port this component apart in future implementations and refactor here
export const CopyClipboardBtn = styled.button(
  ({ theme }) => css`
    border-radius: 0 8px 8px 0;
    border: 1px solid ${theme.colors.black15};
    padding: 1px 5px 0;

    &:hover {
      background: ${theme.colors.black15};
    }
  `
)
