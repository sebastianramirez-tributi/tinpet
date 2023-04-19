import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { Select } from 'antd'
import { Button } from '@tributi-co/tributi-components'

import media from '../../../../styles/utils/media'

export const Container = styled.div(
  ({ theme }) => css`
    align-items: center;
    counter-reset: item;
    display: flex;
    flex-direction: column;
    font-family: ${theme.fontFamily.body};
    font-size: 1rem;
    min-height: 30rem;
    text-align: center;
    transform: scale(0.9);
  `,
  media.lg`
    max-height: 33.5rem;
    padding: 0 1.5rem;
    text-align: left;
  `
)

export const Image = styled.img(
  css`
    display: block;
    margin: 0 auto;
    padding: 0;
    width: 60%;
  `,
  media.laptop`
    position: relative;
    top: -2rem;
    width: 45%;
  `
)

export const BodyContainer = styled.div(
  css`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 32rem;
  `,
  media.laptop`
    position: relative;
    top: -3rem;
  `
)

export const Description = styled.p(
  css`
    padding: 1rem 0;
    text-align: center;
  `
)

export const Subtitle = styled.h2(
  css`
    font-weight: 900;
  `
)

export const Link = styled('a')(
  ({ theme }) => css`
    color: ${theme.colors.primary.main};
    display: inline;
    font-weight: 300;
    font-weight: 500;
    &,
    &:hover,
    &:visited,
    &:focus {
      color: ${theme.colors.primary.main};
      cursor: pointer;
    }
    @media print {
      font-weight: 600;
      text-decoration: none;
    }
  `
)

export const Text = styled.p(
  css`
    font-size: 1rem;
    padding-top: 1rem;
    margin-bottom: 0;
    text-align: center;
  `,
  ({ paddingless }) =>
    paddingless &&
    css`
      padding-top: 0;
    `,
  ({ marginbottom }) =>
    marginbottom &&
    css`
      margin-bottom: 1rem;
    `
)

export const TextTitle = styled.p(
  ({ theme }) => css`
    color: ${theme.colors.primary.main};
    font-size: 1.4rem;
    padding-top: 1rem;
    text-align: center;
  `
)

export const SelectStyle = styled(Select)(
  css`
    min-width: 22rem;
  `
)

export const Space = styled.div(
  css`
    margin: 0.5rem;
  `
)

export const ProgressText = styled.div(
  ({ theme }) => css`
    color: ${theme.colors.primary.main};
  `
)

export const Block = styled.div(
  css`
    display: flex;
    justify-content: center;
    width: 100%;
  `
)

export const Middle = styled.div(
  css`
    strong {
      font-weight: 600;
    }
  `
)

export const Separator = styled.div(
  css`
    margin: 0 0.5rem;
  `
)

export const LinkContainer = styled.section(
  ({ theme }) => css`
    align-items: center;
    border-radius: 4px;
    border: 1px solid ${theme.colors.gray.alto};
    display: flex;
    flex-flow: row nowrap;
    overflow: hidden;
    padding: 0.25rem;
    width: 100%;

    > div {
      overflow: hidden;
    }

    span {
      white-space: nowrap;
    }
  `
)

export const CopyClipBoardBtn = styled.button(
  ({ theme }) => css`
    background: transparent;
    border: none;
    margin-left: 0.875rem;
    outline: none;
    padding: 0.125rem;

    &:hover {
      background: ${theme.colors.gray.line};
    }
  `
)

export const SubmitButton = styled(Button)(css`
  margin-top: 1rem;
`)

export const LinkTitle = styled.p(css`
  font-size: 1.3rem;
  margin-top: 2rem;
`)

export const LinkLabel = styled.p(css`
  align-self: flex-start;
  font-weight: 600;
  margin: 2rem 0 1rem;
`)
