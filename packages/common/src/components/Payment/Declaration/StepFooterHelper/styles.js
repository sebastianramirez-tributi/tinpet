import { css } from '@emotion/core'
import styled from '@emotion/styled'

export const StepFooterHelperItem = styled.li`
  margin: 0.1rem 1.2rem;
`
export const StepFooterHelperLink = styled.a(
  ({ theme }) => css`
    margin-left: 0.5rem;

    &:first-of-type {
      margin-left: 0;
    }

    &,
    &:visited,
    &:hover {
      color: ${theme.colors.text.dark};
    }

    &:hover {
      text-decoration: underline;
    }
  `
)
