import { css } from '@emotion/core'
import styled from '@emotion/styled'

export const ButtonContainer = styled.section(
  css`
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
  `,
  ({ expanded }) =>
    expanded &&
    css`
      flex-direction: row;
      gap: 0.5rem;
      margin-top: 0;
    `
)

export const FileManualContainer = styled.section(
  ({ theme }) => css`
    align-items: center;
    border-top: 1px solid ${theme.colors.gray.gallery};
    display: flex;
    flex-direction: column;
    width: 100%;
  `
)

export const FileManuallyDek = styled.p(css`
  margin: 1rem 0 0.5rem;
`)
