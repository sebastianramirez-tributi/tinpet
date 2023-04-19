import { css } from '@emotion/core'
import styled from '@emotion/styled'

export const Content = styled.section(css`
  align-items: center;
  display: flex;
  flex-direction: column;
  min-height: 30rem;
`)

export const Logo = styled.img(css`
  width: 10rem;
`)

export const ContentImage = styled.img(
  () =>
    css`
      margin-top: 1rem;
      width: 12rem;

      &:only-of-type {
        margin: 0;
      }
    `,
  ({ long }) =>
    long &&
    css`
      width: 9rem;
    `
)

export const Title = styled.h2(css`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  line-height: 1.2;
  margin: 0.5rem 0 2rem;
  text-align: center;
`)

export const PrimaryTitle = styled(Title)(
  ({ theme }) => css`
    color: ${theme.colors.primary.main};
    margin-bottom: 1rem;
  `
)

export const Subtitle = styled.section(
  css`
    text-align: center;
    &:last-of-type {
      margin: 0.625rem 0 2rem;
    }
    &:only-of-type {
      margin: 0;
    }
    > p {
      margin-bottom: 1rem;
      text-align: justify;
    }
    > ul {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      list-style: disc;
      margin-left: 2rem;
      text-align: left;
    }
  `,
  ({ marginess }) =>
    marginess &&
    css`
      &:only-of-type {
        margin-bottom: 2rem;
      }
    `
)
