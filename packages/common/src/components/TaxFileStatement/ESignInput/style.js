import { css } from '@emotion/core'
import styled from '@emotion/styled'

export const ESignatureForm = styled.form(css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 70%;
`)

export const ESignaturePasswordInput = styled.input(
  ({ theme }) => css`
    border-radius: 4px;
    border: 1px solid ${theme.colors.disabled.main};
    display: block;
    font-size: 14px;
    height: 2rem;
    padding: 0 0.75rem;
    width: 100%;

    &:hover,
    &:focus {
      border-color: ${theme.colors.primary.main};
    }

    &:focus {
      box-shadow: ${theme.colors.primary.main}45 0 0 0 1px;
    }
  `
)

export const ESignatureFeedback = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.danger.main};
  `
)
