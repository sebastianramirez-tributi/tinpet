import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { media } from '../../styles/utils'

export const Text = styled('span')(
  (props) => css`
    color: ${props.theme.colors.white.main};
    font-weight: 600;
    margin-right: 1.06rem;
    font-size: 1rem;
    ${media.lg`
    font-size: 1.25rem;
    `};
  `
)
