import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { media } from '../../../styles/utils'

export const Container = styled('div')(
  (props) => css`
    display: flex;
    flex-direction: column;
    padding: 15px;
    border-bottom: 1px solid ${props.theme.colors.gray.line};
    width: 100%;

    ${media.md`
    flex-direction: row;
  `};

    ${media.lg`
    border: 1px solid ${props.theme.colors.gray.line};
    padding-bottom: 1.8rem;
    padding-top: 1.8rem;
    flex-direction: row;
  `};

    @media print {
      flex-direction: row;
      border: 1px solid ${props.theme.colors.gray.line};
      padding-bottom: 0px;
      padding-top: 0px;
    }
  `
)

export const ContainerImage = styled('div')(
  (props) => css`
    justify-content: center;
    flex-direction: row;
    display: flex;
    align-items: center;
    img {
      margin-right: 0.6rem;
    }

    span {
      font-weight: 600;
    }

    ${media.md`
    flex-direction: column;
    width: 30%;
    img {
      margin-bottom: 0.6rem;
    }
  `}

    ${media.lg`
      flex-direction: column;
      border-right: 1px solid ${props.theme.colors.gray.line};
      width: 30%;
      img {
        margin-bottom: 0.6rem;
      }
  `};

    @media print {
      flex-direction: column;
      width: 30%;
      border-right: 1px solid ${props.theme.colors.gray.line};

      img {
        margin-bottom: 0.6rem;
      }
    }
  `
)

export const ContainerInfo = styled('div')`
  width: 100%;
  ${media.md`
    margin-left: 1.8rem;
  `}
  @media print {
    margin-bottom: 1.2rem;
    margin-left: 1.2rem;
  }
`
