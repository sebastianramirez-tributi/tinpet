import { css } from '@emotion/core'
import styled from '@emotion/styled'

export const Root = styled('div')(
  (props) => css`
    background-image: ${`url(${props.bgImage})`};
    background-position-y: 2rem;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 90%;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  `
)

export const Main = styled('main')`
  flex: auto;
`
