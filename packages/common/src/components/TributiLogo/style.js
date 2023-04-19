import styled from '@emotion/styled'
import { media } from '../../styles/utils'

export const LogoWrapper = styled.div(
  () => `
    align-items: center;
    cursor: pointer;
    display: grid;
    grid-gap: 0.2rem;
    grid-template-column: 1fr;
    grid-template-rows: 1fr 0 1fr;
    padding: 0.5rem;

    &:has(> :nth-of-type(1):last-child) {
      grid-template-rows: 1fr;
    }

  `,
  media.sm`
    grid-gap: 1rem;
    grid-template-columns: 1fr 1px 1fr;
    grid-template-rows: 1fr;
    padding: 0;

    &:has(> :nth-of-type(1):last-child) {
      grid-template-columns: 1fr;
    }
  `,
  ({ inline }) =>
    inline &&
    `
      height: 100%;
      position: relative;
      display: flex;
      gap: 0.5rem;
    `
)

export const LogoSeparator = styled.span(
  ({ theme }) => `
    width: 1px;
    background: ${theme.colors.gray.line};
    height: 70%;
    align-self: center;
  `
)

export const LogoImage = styled.img(
  `
    justify-self: center;
    object-fit: contain;
    max-width: 10rem;
  `,
  media.sm`
    min-height: 60px;
    max-width: 8.5rem;
  `,
  ({ inline }) =>
    inline &&
    `
      height: 60%;
    `
)
