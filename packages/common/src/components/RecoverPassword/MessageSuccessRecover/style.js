import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { media } from '../../../styles/utils'

export const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const Title = styled('h2')(
  {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '1.25rem',
  },
  (props) => css`
    font-family: ${props.theme.fontFamily.body};
    color: ${props.theme.colors.disabled.textContrast};
    font-size: 1.5rem;
    ${media.md`
    font-size: 1.5rem;
    `};
  `
)

export const Icon = styled.img(
  ({ theme }) => css`
    color: ${theme.colors.primary.main};
    font-size: 3.125rem;
    margin: 1.25rem 0;
  `
)
