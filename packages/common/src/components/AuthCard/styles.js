import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { Button } from '@tributi-co/tributi-components'

import media from '../../styles/utils/media'

export const Container = styled.div`
  padding: 10px;
  height: 100%;
`

export const Content = styled.div(
  media.md`
    height: 100%;
    padding: 0;
  `
)

export const CardContainer = styled.div`
  position: relative;
`

export const StyledButton = styled(Button)(
  ({ theme }) => css`
    border-color: ${theme.colors.white.main};
  `
)
