import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { media } from '../../styles/utils'

export const Container = styled.section(
  () => css`
    align-items: center;
    display: flex;
    flex-direction: column;
    padding: 0.625rem;
    width: 100%;
  `,
  media.md`
    margin: 2rem;
  `
)

export const Message = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.white.main};
    font-weight: 700;
  `
)

export const Text = styled.p(
  ({ theme }) => css`
    color: ${theme.colors.black85};
    font-size: 16px;
    font-weight: 500;
    margin-top: -45px;
  `,
  media.md`
    font-size: 22px;
  `,
  media.lg`
    font-size: 34px;
  `
)

export const Content = styled.div(
  `
  align-items: center;
  background-image: url(/images/404.svg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: flex;
  font-size: 18px;
  height: 15em;
  justify-content: center;
  min-width: 25rem;
`,
  media.md`
    font-size: 24px;
    height: 40vw;
    min-width: 35.5rem;
  `,
  media.lg`
    font-size: 36px;
    min-width: 53rem;
  `
)
