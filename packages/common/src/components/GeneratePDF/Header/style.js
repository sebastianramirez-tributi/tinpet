import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { media } from '../../../styles/utils'

export const ContainerHeader = styled('div')`
  display: flex;
  flex-direction: row;
  ${media.md`
    align-items: flex-start;
    justify-content: space-between;
  `}

  @media print {
    flex-direction: row-reverse;
    justify-content: space-between;
    margin-top: 2.3rem;
    margin-bottom: 1.2rem;
    align-items: flex-end;
  }
`

export const Title = styled('span')`
  font-weight: bold;
  ${media.lg`
    display:none;
  `}

  @media print {
    display: none;
  }
`

export const CardUser = styled('div')(
  (props) => css`
    padding: 1.2rem;
    border-radius: 1rem;
    background: ${props.theme.colors.white.main};
    box-shadow: 0 2px 40px 0 ${props.theme.colors.black08};
    text-align: left;
    display: flex;
    margin-bottom: 0.9rem;
    justify-content: space-between;
    align-items: flex-start;
    flex-direction: row;
    width: 100%;
    div img {
      display: none;
    }
    ${media.md`
    width: auto;

    div {
      display: flex;
      align-items: center;

      img {
        display: block;
        height: 3.1rem;
      }

      li {
        font-weight: bold;
        &:last-child {
          border-top: 1px solid ${props.theme.colors.gray.alto};
          padding-top: 0.6rem;
          margin-top: 0.6rem;
          font-weight: normal;
        }
      }
    }
  `};

    ${media.lg`
    li {
      font-size: 1.2rem;
    }
  `}

    @media print {
      padding: 0;
      border-radius: 0;
      box-shadow: none;
      margin-bottom: 0px;

      li {
        font-size: larger;
        font-weight: bold;
        &:last-child {
          font-weight: normal;
        }
      }
    }
  `
)

export const ButtonSmall = styled('button')`
  display: block;
  img {
    width: 2.5rem;
  }
  ${media.md`
    display: none;
  `}

  @media print {
    display: none;
  }
`

export const Text = styled('p')`
  font-weight: bold;
  margin: 0.9rem auto;
  ${media.lg`
    font-size: x-large;
  `}
`

export const Divider = styled('div')(
  (props) => css`
    border-right: 1px solid ${props.theme.colors.gray.alto};
    padding-right: 0.9rem;
    margin-right: 0.9rem;
  `
)

export const Button = styled('button')(
  (props) => css`
    justify-content: space-around;
    align-items: center;
    padding: 8px 12px;
    font-size: 1rem;
    font-weight: 900;
    color: ${props.theme.colors.white.main};
    border: none;
    border-radius: 0.5rem;
    background-color: ${props.theme.colors.primary.main};
    display: none;
    img {
      width: 1.2rem;
      height: 1.2rem;
    }
    ${media.md`
    display: flex;
  `}

    ${media.lg`
    img {
      margin-right: 0.6rem;
    }
  `}
  `
)

export const CardInfo = styled('div')`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-left: 3.1rem;
  display: none;

  div {
    display: none;
    text-align: left;
  }

  ${media.md`
    display: flex;
  `}

  ${media.lg`
    div {
      display: block;
      text-align: left;
    }
  `}

  @media print {
    display: flex;
    margin-left: 0;
    margin-right: 3.1rem;

    div {
      display: block;
      text-align: left;
    }
  }
`
