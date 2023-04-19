import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { media } from '../../../styles/utils'

export const ContainerTitle = styled('div')(
  (props) => css`
    display: block;
    padding: 4px 24px;
    background-color: ${props.theme.colors.gray.line};
    width: 100%;

    ${media.lg`
    padding: 10px 24px;
  `};

    span {
      color: ${props.theme.colors.black85}
      font-weight: 400;
      ${media.lg`
      font-size: 1.3rem;
    `};
    }

    @media print {
      background-color: ${props.theme.colors.primary.main};
      span {
        color: ${props.theme.colors.white.main};
        font-size: 1.1rem;
      }
    }
  `
)
