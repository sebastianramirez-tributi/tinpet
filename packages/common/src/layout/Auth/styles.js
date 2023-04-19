import styled from '@emotion/styled'
import { css } from '@emotion/core'

import media from '../../styles/utils/media'

export const Root = styled.div(({ bgImage, size, theme }) => [
  css`
    overflow-x: hidden;
  `,
  css`
    background-image: url(${bgImage});
    background-color: ${theme.colors.gray.athens};
    background-position-y: 2rem;
    background-position: top;
    background-repeat: no-repeat;
    background-size: contain;
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  `,
  size &&
    media.md`
    background-size: 90%;
  `,
])

export const Main = styled.main`
  align-items: center;
  display: flex;
  flex: auto;
  overflow-x: hidden;
`
