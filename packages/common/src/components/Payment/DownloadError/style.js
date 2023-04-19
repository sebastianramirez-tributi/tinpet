import { css } from '@emotion/core'
import styled from '@emotion/styled'
import media from '../../../styles/utils/media'

export const Container = styled.section(
  ({ theme }) => `
    display: flex;
    flex: 0 1 auto;
    flex-direction: row;
  `
)

export const Title = styled.h3(
  ({ theme }) => css`
    color: ${theme.colors.primary.main};
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1.25rem;
    text-align: center;
  `,
  media.lg`
    margin-bottom: 3.12rem;
  `
)
export const Text = styled.p(
  ({ theme }) => css`
    color: ${theme.colors.disabled.textContrast};
    font-family: ${theme.fontFamily.body};
    font-size: 1rem;
    line-height: 1.33;
    text-align: center;
  `
)

export const Image = styled.img(
  `
  display: none;
  `,
  media.lg`
    display:block;
    width: 100%;
  `
)

export const ContainerText = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
`

export const ContainerButton = styled.section(
  `
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    flex: 1 1 auto;
  `,
  media.lg`
    margin: 1rem auto 0;
    max-width: 10rem;
  `
)
