import styled from '@emotion/styled'

export const Link = styled.a(
  ({ theme }) => `
    background: ${theme.colors.primary.main};
    border-radius: 0.4rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    bottom: 0;
    font-size: 0.875rem;
    font-weight: bold;
    left: 2rem;
    padding: 0.625rem 1.25rem;
    position: sticky;
    width: fit-content;
    z-index: 1000;

    &, &:visited, &:active {
      color: ${theme.colors.white.main};
    }
  `
)
