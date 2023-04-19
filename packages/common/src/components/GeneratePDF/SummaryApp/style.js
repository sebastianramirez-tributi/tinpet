import styled from '@emotion/styled'
import { css } from '@emotion/core'

export const Container = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
`

export const Divider = styled('div')(
  (props) => css`
    width: 100%;
    height: 1px;
    margin: 24px 0px 24px 0px;
    background: ${props.theme.colors.gray.alto};

    @media print {
      margin: 0;
    }
  `
)
