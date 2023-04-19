import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { STATUS } from '../../../constants/onboarding'

export const Item = styled.div(({ theme, status }) => [
  css`
    align-items: center;
    background-color: ${theme.colors.white.main};
    border-radius: 15px;
    border: solid 1px ${theme.colors.gray.line};
    box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.06);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    height: 10rem;
    height: 140px;
    justify-content: center;
    margin-bottom: 11px;
    margin: 0.5rem;
    position: relative;
    width: 16.45rem;

    &:hover {
      box-shadow: 0 2px 20px 0 ${theme.colors.highlight.main40};
    }
  `,
  status === STATUS.COMPLETE &&
    css`
      border: 2px solid ${theme.colors.highlight.complete};
      p {
        color: ${theme.colors.disabled.textContrast};
      }
      &:hover {
        box-shadow: 0 2px 20px 0 ${theme.colors.highlight.complete40};
      }
    `,
  status === STATUS.PARTIAL &&
    css`
      border: 2px solid ${theme.colors.highlight.partial};
      p {
        color: ${theme.colors.disabled.textContrast};
      }
      &:hover {
        box-shadow: 0 2px 20px 0 ${theme.colors.highlight.partial40};
      }
    `,
])

export const ItemContent = styled.div(
  (props) => css`
    align-items: center;
    display: flex;
    flex: 3;
    height: 100%;
    justify-content: center;
    padding: 0 0.5rem;
    width: 100%;
    ${itemHelp(props)}
  `
)

export const Image = styled('div')`
  background-position: center center;
  background-repeat: no-repeat;
  background-size: auto;
  flex: 1 1 30%;
  height: 100%;
  text-align: center;
`

export const Text = styled('p')`
  border: none;
  flex: 1 1 65%;
  font-size: 15px;
  font-weight: 400;
  overflow: hidden;
  padding-left: 0;
  text-align: left;
  text-overflow: ellipsis;
`

export const Help = styled.div(({ theme, status }) => [
  css`
    align-items: center;
    border-radius: 15px;
    border: 1px solid #ececec;
    color: ${theme.colors.black65};
    cursor: default;
    display: flex;
    font-size: 0.875rem;
    height: 30px;
    justify-content: center;
    padding: 0;
    position: absolute;
    right: 0.3rem;
    top: 0.3rem;
    width: 30px;

    &:hover {
      background: ${theme.colors.primary.main};
      border: 1px solid ${theme.colors.primary.main};
      transition: 400ms;
      .anticon {
        color: ${theme.colors.white.main};
      }
    }
  `,
  status === STATUS.COMPLETE &&
    css`
      &,
      &:hover {
        background: ${theme.colors.highlight.complete};
        border: none;
        font-size: 1rem;
        > span {
          color: ${theme.colors.white.main};
        }
      }
    `,
  status === STATUS.PARTIAL &&
    css`
      &,
      &:hover {
        background: ${theme.colors.highlight.partial};
        border: none;
        > span {
          color: ${theme.colors.white.main};
        }
      }
    `,
])

const itemHelp = ({ theme }) => css`
  .item_help {
    border: 1px solid ${theme.colors.gray.line};
    height: 24px;
    left: 220px;
    padding-top: 1px;
    top: 5px;
    width: 24px;

    &:hover {
      background: ${theme.colors.primary.main};
      border: 1px solid ${theme.colors.primary.main};
      transition: 400ms;
      .anticon {
        color: ${theme.colors.white.main};
      }
    }
    .anticon {
      color: ${theme.colors.black65};
      font-size: 16px;
    }
  }
`
