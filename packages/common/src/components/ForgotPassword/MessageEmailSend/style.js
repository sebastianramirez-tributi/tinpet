import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { media } from '../../../styles/utils'

export const Container = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
`

export const Title = styled('h2')(
  {
    fontWeight: 'bold',
    marginBottom: '1.25rem',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  ({ theme }) => css`
    color: ${theme.colors.disabled.textContrast};
    font-family: ${theme.fontFamily.body};
    font-size: 1.5rem;
  `,
  media.md`
    font-size: 1.5rem;
  `
)

export const Text = styled('p')(
  {
    fontSize: '1rem',
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 'normal',
    letterSpacing: 'normal',
    lineHeight: '1.33',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  ({ theme }) => css`
    color: ${theme.colors.disabled.textContrast};
    font-family: ${theme.fontFamily.body};
  `
)

export const Icon = styled.img(
  ({ theme }) => css`
    color: ${theme.colors.primary.main};
    font-size: 3.125rem;
    margin: 1.25rem 0;
  `
)
