import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { Button } from '@tributi-co/tributi-components'

import { media } from '../../../styles/utils'

import BaseActionButton from '../ActionButton'

export const ActionButton = styled(BaseActionButton)(
  `
    white-space: nowrap;
  `,
  ({ disabledStyle, theme }) =>
    disabledStyle &&
    css`
      background: ${theme.colors.black20};

      &.danger:hover {
        background: ${theme.colors.black10};
      }

      &.icon:hover .anticon {
        color: ${theme.colors.text.dark};
      }
    `
)

export const Body = styled('div')(
  (props) => css`
    display: flex;
    flex-direction: column;
    border-left: 1px solid ${props.theme.colors.gray.line};
    width: 100%;
    div {
      align-items: center;
      border-bottom: 1px solid ${props.theme.colors.gray.line};
      color: ${props.theme.colors.black65};
      flex: 1 1 100%;
      font-size: 0.7rem;
      font-stretch: normal;
      font-style: normal;
      font-weight: normal;
      letter-spacing: normal;
      line-height: 1.33;
      min-height: 31px;
      padding: 0.5rem;
      text-align: left;
      &:empty {
        &:after {
          content: ' ';
          padding: 0.5rem;
        }
      }
    }
    ${media.md`
    flex-direction: row;
    border-left: none;
    div {
      width: 25%;
      font-size: 0.8rem;
      display: flex;
    }
  `};
    ${media.lg`
    div {
      padding: 0.7rem;
    }
  `}
    div[data-testid="due-date"] {
      display: flex;
      align-items: center;
    }
  `
)

export const Plan = styled.div(
  css`
    display: flex;
    min-height: 31px;

    button {
      display: none;
    }
  `,
  media.md`
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;

    button {
      display: block;
    }
    `,
  media.lg`
    align-items: center;
    flex-direction: row;
    justify-content: space-between;

    button {
      margin-left: .5rem;
    }
  `
)

export const PlanName = styled.span`
  &:empty {
    height: 0.9rem;
  }
`

export const Year = styled('div')`
  align-items: center;
  display: none;
  > span {
    margin-right: 0.4rem;
  }

  ${media.md`
    display: block;
  `}
`

export const ContainerButtons = styled('div')`
  display: flex;
  items-align: center;
  justify-content: space-around;
  padding: 0.29rem;
  button {
    max-width: 50%;
  }
  ${media.md`
    button {
      max-width: 100%;
      &:nth-of-type(2){
        display: none;
      }
    }
  `}
`

export const DesktopDeleteButton = styled(Button)(
  ({ theme, disabledstyle }) =>
    disabledstyle &&
    css`
      background: ${theme.colors.black20};
    `
)
