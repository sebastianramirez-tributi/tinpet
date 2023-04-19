import styled from '@emotion/styled'
import { css } from '@emotion/core'

import media from '../../../../styles/utils/media'

export const HeaderStyled = styled.div(
  (props) => css`
    padding: 1rem;
    border-bottom: solid 1px ${props.theme.colors.gray.line};
    width: 90%;

    h1 {
      font-size: 1.25rem;
      font-weight: bold;
      margin-bottom: 0.6rem;
    }
    span {
      font-size: 0.8rem;
      color: ${props.theme.colors.gray.dusty};
    }
  `,
  media.md`
    border-bottom: none;
    padding: 2rem 0rem 0rem;
    span {
      font-size: 0.9rem;
    }
  `
)
