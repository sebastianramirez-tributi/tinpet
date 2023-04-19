import styled from '@emotion/styled'

import { media } from '../../../styles/utils'

export const Wrapper = styled.div(
  `
    display: flex;
    flex-direction: column;
    gap: 2rem;
    height: 100%;
  `,
  media.md`
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    height: 100%;
    padding: 0;
  `,
  ({ theme, show }) =>
    show &&
    media.md`
    background-color: ${theme.colors.white.main};
    border-radius: 29px;
    border: solid 1px ${theme.colors.white.main};
    box-shadow: 0 2px 40px 0 rgba(0, 0, 0, 0.06);
  `,
  ({ show }) =>
    !show &&
    media.md`
      gap: 1rem;
      padding: 0 1rem;
  `
)
