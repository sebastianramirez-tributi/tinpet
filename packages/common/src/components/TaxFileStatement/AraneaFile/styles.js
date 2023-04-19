import { css } from '@emotion/core'
import styled from '@emotion/styled'

export const Text = styled.p(
  ({ theme }) => css`
    color: ${theme.colors.black.main};
    font-size: 16px;
    font-weight: 300;
    line-height: 1.44;
    margin: 3rem auto;
    text-align: center;
    width: 85%;
  `
)
