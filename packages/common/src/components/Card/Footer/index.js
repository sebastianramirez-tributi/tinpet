import { css } from '@emotion/core'
import styled from '@emotion/styled'

const displayAlign = css`
  align-items: center;
  display: flex;
  justify-content: center;
`

export default styled('div')(
  ({ theme }) => css`
    ${displayAlign}
    background-color: ${theme.colors.primary.main};
    padding: 2rem;
  `
)
