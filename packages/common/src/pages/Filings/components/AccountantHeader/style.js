import styled from '@emotion/styled'
import { Button as BaseButton } from '@tributi-co/tributi-components'

import media from '../../../../styles/utils/media'

export const Button = styled(BaseButton)(
  `
    width: 100%;
  `,
  media.sm`
    width: 12.5rem;
  `
)

export const Container = styled.div(
  `
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem 0;
    padding: 0.5rem 2rem;
    width: 100%;
  `,
  media.sm`
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
  `
)

export const Title = styled.h1(
  ({ theme }) => `
    color: ${theme.colors.primary.main};
    font-size: 1.25rem;
    font-weight: bold;
  `
)
