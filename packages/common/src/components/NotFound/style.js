import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { media, maxMedia } from '../../styles/utils'

export const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`

export const Content = styled.div`
  align-items: center;
  background-image: url(/images/404.svg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: flex;
  height: 40vw;
  justify-content: center;
  ${maxMedia.md`
    height: 100vw;
  `}
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  ${maxMedia.sm`
    margin-top: 6rem;
  `}
`

export const Title = styled.span(
  ({ theme }) => css`
    color: ${theme.colors.white.main};
    font-family: ${theme.fontFamily.body};
    font-size: 20vw;
    font-weight: 700;
    letter-spacing: normal;
    line-height: 1;
    ${media.sm`
    font-size: 10rem;
    margin-top: -3rem;
  `}
    ${media.lg`
    font-size: 11.875rem;
    margin-top: -2rem;
  `}
  `
)

export const Message = styled.p(
  ({ theme }) => css`
    color: ${theme.colors.white.main};
    font-family: ${theme.fontFamily.body};
    font-size: 2.2rem;
    font-weight: 700;
    letter-spacing: normal;
    line-height: 0.9;
    margin-bottom: 0;
    ${maxMedia.sm`
    font-size: 5vw;
  `}
  `
)

export const Button = styled.button(
  ({ theme }) => css`
    background: ${theme.colors.white.main};
    border-radius: 8px;
    border: 1px solid ${theme.colors.primary.main};
    box-shadow: 0 2px 4px 0 ${theme.colors.black20};
    color: ${theme.colors.primary.main};
    font-size: 20px;
    font-weight: 400;
    line-height: 1.15;
    margin: 2rem auto auto;
    padding: 1rem 30px;
    ${maxMedia.sm`
    margin: 4rem auto auto;
  `}
  `
)
