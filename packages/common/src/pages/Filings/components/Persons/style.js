import styled from '@emotion/styled'
import { css } from '@emotion/core'

import media from '../../../../styles/utils/media'

export const ContainerPersons = styled.div(
  () => css`
    width: 100%;
    padding: 1rem;
  `,
  media.md`
    padding: 2rem 2rem 0rem;
  `
)
