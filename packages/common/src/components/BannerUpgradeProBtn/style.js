import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { media } from '../../styles/utils'

export const Container = styled.div`
  display: flex;
  align-items: center;
`

export const Image = styled.img(
  css`
    margin-left: -10px;
    z-index: 1;
    display: none;
  `,
  media.lg`
    display: flex;
  `,
  ({ isMenuBtn }) =>
    isMenuBtn &&
    media.lg`
      display: none;
    `
)
