import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { media } from '../../../styles/utils'

export const Container = styled('div')`
  display: flrex;
  flex-direction: row;

  ${media.lg`
    margin-left: 0.6rem;
  `}

  @media print {
    flex-direction: column;
    display: flex;
    align-items: baseline;
  }
`

export const Link = styled('a')(
  (props) => css`
    color: ${props.theme.colors.black85};
    text-decoration: underline;
    line-height: 2;
    text-align: left;
    ${media.lg`
    text-decoration: none;
    font-weight: 600;

    &:focus, &:hover {
      color: ${props.theme.colors.black85};
      cursor: auto;
    }
  `};
    @media print {
      text-decoration: none;
      font-weight: 600;
    }
  `
)

export const ContainerText = styled('div')(
  (props) => css`
    text-align: left;
    margin-top: 0.6rem;
    span {
      display: none;
      ${media.lg`
      display:block;
      font-size: 0.8rem;
      color: ${props.theme.colors.text.gray44};
    `};
    }
    @media print {
      margin-top: 1.25rem;

      span {
        display: block;
        font-size: 0.8rem;
        color: ${props.theme.colors.text.gray44};
        white-space: pre-line;
        width: 90%;
      }
    }
  `
)

export const Help = styled('div')`
  display: none;
  ${media.lg`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    span {
      margin-left: 0.3rem;
      margin-right: 0.6rem;
    }
  `};
  @media print {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 0.9rem;
    span {
      margin-left: 0.3rem;
      margin-right: 0.6rem;
    }
  }
`
