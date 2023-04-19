import styled from '@emotion/styled'
import { css } from '@emotion/core'

import { Button } from '@tributi-co/tributi-components'

export const HeaderWarning = styled.div(
  ({ theme }) => `
    background-color: ${theme.colors.warning.background};
    border-radius: 4px;
    border: 1px solid ${theme.colors.warning.border};
    color: ${theme.colors.black60};
    line-height: 1.5;
    margin: 2rem;
    padding: 1rem;
    position: relative;
    text-align: left;

    &:empty {
      display: none;
    }
  `
)

export const HeaderWarningTitle = styled.div(
  ({ theme }) => `
    color: ${theme.colors.black80};
    display: flex;
    font-size: 1rem;
    margin: 1.5rem 0 0 1.5rem;
  `
)

export const HeaderWarningIcon = styled.span(
  ({ theme }) => `
    color: ${theme.colors.icon.confirm};
    font-size: 1.5rem;
    margin-right: 1rem;
  `
)

export const HeaderWarningContent = styled.div(
  ({ theme }) => `
    font-size: 0.875rem;
    line-height: 1.375rem;
    margin-left: 4rem;
    margin-top: 0.25rem;

    p,
    ul {
      margin-bottom: 1rem;
    }

    ul {
      list-style: disc;
      padding-left: 40px;
    }

    a {
      color: ${theme.colors.text.link};

      &:hover {
        text-decoration: underline;
      }
    }
  `
)

export const IgnoreButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  position: relative;
  width: 100%;
`

export const IgnoreButton = styled(Button)(
  `
    margin: 0 20px;
    padding: 0.5rem;
    width: 350px;
  `,
  ({ theme, disable }) =>
    disable &&
    css`
      background: ${theme.colors.disabled.main};
    `
)

export const IgnoreButtonLabel = styled.span`
  text-transform: lowercase;

  &:first-letter {
    text-transform: uppercase;
  }
`
