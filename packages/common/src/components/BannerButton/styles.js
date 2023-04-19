import { css } from '@emotion/core'
import styled from '@emotion/styled'

import { media } from '../../styles/utils'

export const ButtonContainer = styled.button(
  ({ theme }) => css`
    align-items: center;
    border-radius: 8px;
    border: solid 1px ${theme.colors.disabled.main};
    display: none;
    gap: 0.5rem;
    height: 2rem;
    justify-content: start;
    padding: 0 0.5rem;
    position: relative;
    width: auto;
    &:hover {
      box-shadow: 0 0 10px 0 ${theme.colors.primary.main};
    }
  `,
  ({ reverse }) =>
    reverse &&
    css`
      flex-direction: row-reverse;
    `,
  ({ forceMenuBtn }) =>
    !forceMenuBtn &&
    media.lg`
      display: flex;
  `,
  ({ isMenuBtn }) =>
    isMenuBtn &&
    css`
      display: flex;
      justify-content: center;
    `,
  ({ isMenuBtn, forceMenuBtn }) =>
    isMenuBtn &&
    !forceMenuBtn &&
    media.lg`
      display: none;
  `
)

export const ButtonLabel = styled.span(
  css`
    font-family: Nunito Sans;
    font-size: 14px;
    justify-content: center;
    line-height: 14px;
    width: 100%;
  `,
  ({ isMenuBtn }) =>
    isMenuBtn &&
    css`
      font-size: 16px;
    `
)
