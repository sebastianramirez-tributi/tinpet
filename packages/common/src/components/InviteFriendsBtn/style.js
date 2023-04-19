import { css } from '@emotion/core'
import styled from '@emotion/styled'

const ImageSmall = ({ small }) =>
  small &&
  css`
    width: 1.25rem;
  `
export const Image = styled.img(
  `
    width: 10rem;
  `,
  ImageSmall
)
