import { css } from '@emotion/core'
import styled from '@emotion/styled'
import AntdAlert from 'antd/lib/alert'

export const Alert = styled(AntdAlert)`
  margin: 1.25rem auto;
  max-width: 80%;
`

export const Container = styled.div(
  ({ theme }) => css`
    margin-top: 2rem;

    .ant-collapse-header {
      background-color: ${theme.colors.gray.line};
    }

    .collapse {
      margin: 1.25rem;
    }

    .panel-icon {
      background: ${theme.colors.primary.main};
      border-radius: 50%;
      color: ${theme.colors.white.main};
      font-size: 1.2rem;
      margin-right: 0.5rem;
      padding: 5px;
      svg {
        width: 16px;
        height: 16px;
      }
    }
  `
)

export const PanelTitle = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.black85};
    font-family: ${theme.fontFamily.body};
    font-size: 16px;
    font-weight: 400;
  `
)
