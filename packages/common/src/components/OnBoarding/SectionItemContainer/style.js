import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { Collapsible } from '@tributi-co/tributi-components'
import { media } from '../../../styles/utils'

export const ItemsContainer = styled.section(
  `
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
`,
  media.lg`
    justify-content: flex-start;
  `
)

export const SuperGroupTitle = styled.h4(
  ({ theme }) => css`
    color: ${theme.colors.disabled.textContrast};
    font-family: ${theme.fontFamily.body};
    font-size: 18px;
    font-weight: 700;
    line-height: 1.5;
    margin: 0 0 1rem 0.5rem;
    text-align: center;
  `,
  media.lg`
    text-align: justify;
  `
)

export const StyledCollapsible = styled(Collapsible)(css`
  margin-top: 3rem;
`)

export const SuperGroupContainer = styled.section(
  css`
    &:not(:first-of-type) {
      margin-top: 2rem;
    }
  `,
  media.lg`
    padding: 0 1rem;
  `
)

export const GroupContainer = styled.section(
  css`
    &:not(:first-of-type) {
      margin-top: 2rem;
    }
  `
)
