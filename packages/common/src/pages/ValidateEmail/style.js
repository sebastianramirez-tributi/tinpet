import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { Button as BaseButton } from '@tributi-co/tributi-components'

const ContentCenter = css`
  align-items: center;
  display: flex;
  flex-direction: column;
  text-align: center;
`

export const Container = styled.div(
  ContentCenter,
  ({ theme }) => `
    color: ${theme.colors.text.main};
    margin: 5rem 0;
  `
)

export const Title = styled.h1`
  color: inherith;
  font-size: 2rem;
  font-weight: 700;
`

export const Subtitle = styled.h2`
  color: inherith;
  font-size: 1.125rem;
`

export const Content = styled.div`
  ${ContentCenter}
  font-size: 1.125rem;
  margin: 2rem 0;
`

export const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`

export const Button = styled(BaseButton)(
  ({ theme }) => `
    min-width: 15rem;

    &:visited:not(:hover) {
      color: ${theme.colors.white.main};
    }
  `
)
