import { css } from '@emotion/core'
import styled from '@emotion/styled'

import media from '../../styles/utils/media'

export const Root = styled.div(({ bgImage, size, theme }) => [
  css`
    background-color: ${theme.colors.gray.athens};
    background-image: url(${bgImage});
    background-position-y: 2rem;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  `,
  size &&
    media.md`
    background-size: 90%;
  `,
  !size &&
    css`
      background-position: top;
    `,
])

export const Main = styled.main`
  display: flex;
  flex: auto;
  overflow-x: hidden;
`
