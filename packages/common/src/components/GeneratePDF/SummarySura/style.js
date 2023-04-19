import styled from '@emotion/styled'
import { css } from '@emotion/core'

export const Container = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
`

export const Divider = styled('div')(
  (props) => css`
    width: 100%;
    height: 1px;
    margin: 24px 0px 24px 0px;
    background-color: ${props.theme.colors.gray.alto};
    @media print {
      margin: 0;
    }
  `
)

export const Print = styled('div')(
  (props) => css`
    @media print {
      border: 1px solid ${props.theme.colors.gray.alto};
    }
  `
)

export const ContainerInfo = styled('div')`
  align-items: center;
  display: flex;
  flex-direction: column;

  @media print {
    padding: 1.2rem;
    p {
      display: none;
    }
  }
`
