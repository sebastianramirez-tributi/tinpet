import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { media } from '../../../styles/utils'

export const Container = styled('div')(
  (props) => css`
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.9rem;
    border: 2px solid
      ${props.border === 'success'
        ? props.theme.colors.primary.bright
        : props.theme.colors.highlight.main};
    margin-top: 0.9rem;

    .icon-success {
      color: ${props.theme.colors.primary.bright};
    }
    ${media.lg`
      flex-direction: row;
      padding: 1.5rem;
      width: ${props.big ? '50%' : '100%'}
    `};

    @media print {
      flex-direction: row;
      padding: 1.5rem;
      width: ${props.big ? '80%' : '100%'};
    }
  `
)

export const ContainerInfo = styled('div')`
  display: flex;
  margin-bottom: 0.6rem;
  align-items: center;
  ${media.lg`
    margin-bottom: 0;
    margin-right: 0.6rem;
  `};
`

export const ContainerIcon = styled('div')(
  (props) => css`
    margin-right: 1.1rem;
    line-height: 1;
    font-size: 1.8rem;
    color: ${props.theme.colors.highlight.main};
    ${media.lg`
      font-size: ${props.big ? '6rem' : '2.5rem'}
    `};

    @media print {
      font-size: ${props.big ? '6rem' : '2.5rem'};
    }
  `
)

export const Text = styled('span')`
  text-align: justify;
  font-weight: 300;
`

export const Title = styled('h3')`
  font-size: 1.1rem;
  text-align: left;
`
