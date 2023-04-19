import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { media } from '../../styles/utils'

export const BaseImage = styled.img(
  media.lg`
    transform-origin: 0 100%;
    transform: rotate(-90deg);
  `
)

export const Container = styled.div(
  css`
    text-align: center;
  `,
  media.lg`
    bottom: 0;
    left: 0;
    position: absolute;
    transform: translateY(-50%);
    width: 0px;
  `,
  ({ withExtraLeft }) =>
    withExtraLeft &&
    media.lg`
      left: 56px;
    `
)

export const Supervised = styled(BaseImage)(
  css`
    width: 50%;
  `,
  media.lg`
    height: 2.5rem;
    margin-bottom: 2rem;
    width: auto;
  `
)
