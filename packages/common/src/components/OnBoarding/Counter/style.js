import styled from '@emotion/styled'
import { css } from '@emotion/core'

export const ButtonsWrapper = styled.div(
  (props) => css`
    border-bottom: 1px solid ${props.theme.colors.gray.line};
    border-radius: 13px;
    border-top: 1px solid ${props.theme.colors.gray.line};
  `
)
export const CounterStyle = styled.div(
  (props) => css`
    align-items: baseline;
    color: ${props.theme.colors.disabled.textContrast};
    display: flex;
    flex-direction: row;
    flex: 1;
    margin: -1rem 0 0;
    text-align: center;
    span {
      margin-right: 10px;
    }

    .btn_action {
      background: ${props.theme.colors.gray.gallery};
      border-radius: 50px;
      border: 1px solid ${props.theme.colors.gray.line};
      color: ${props.theme.colors.disabled.textContrast};
      height: 25px;
      position: relative;
      width: 25px;

      &:hover {
        background: ${props.theme.colors.primary.main};
        border: 1px solid ${props.theme.colors.primary.main};
        color: ${props.theme.colors.disabled.textContrast};
        transition: 400ms;
      }
    }

    h5 {
      color: inherit;
      display: inline;
      font-size: 14px;
      margin: 0 10px;
    }
  `
)
