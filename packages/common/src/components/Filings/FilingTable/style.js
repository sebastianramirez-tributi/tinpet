import styled from '@emotion/styled'
import { media } from '../../../styles/utils'
import { css } from '@emotion/core'

export const Filter = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  span {
    font-size: 0.7rem;
    font-weight: 500;
  }
  ${media.md`
    display: none;
 `};
`

export const Table = styled.div(
  (props) => css`
    border-top: 1px solid ${props.theme.colors.gray.line};
    display: flex;
    flex-direction: row;
    div {
      min-height: 45px;
    }
    ${media.md`
      flex-direction: column;
      border-top: none;
    `};
  `
)

export const HeaderItem = styled.div(
  (props) => css`
    border-bottom: 1px solid ${props.theme.colors.gray.line};
    padding: 0.5rem;
    font-size: 0.7rem;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    color: ${props.theme.colors.black85};
    display: flex;
    align-items: center;

    &:first-of-type {
      display: none;
    }

    ${media.sm`
      justify-content: flex-start;
    `}

    ${media.md`
      justify-content: center;
      font-size: 0.8rem;
      width: 25%;
      &:first-of-type {
        display: inherit;
      }
      &:last-of-type {
        justify-content: center;
      }
    `}

    ${media.lg`
      justify-content: flex-start;
      div {
        padding: 0.7rem;
        span {
          &:nth-of-type(1) {
            display: none;
          }
        }
      }
    `}
  `
)

export const Header = styled.div(
  (props) => css`
    display: flex;
    flex-direction: column;
    ${media.md`
      flex-direction: row;
      background-color: ${props.theme.colors.table.expand};
    `};
  `
)
