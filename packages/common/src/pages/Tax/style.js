import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { Button } from '@tributi-co/tributi-components'
import { media } from '../../styles/utils'
import Table from 'antd/lib/table'

export const Container = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
`

export const Title = styled('h3')(
  {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  (props) => css`
    color: ${props.theme.colors.primary.main};
    margin-bottom: 1.25rem;
    ${media.lg`
      margin-bottom: 3.12rem;
    `};
  `
)

export const ContainerText = styled('div')`
  display: flex;
  justify-content: center;
  flex-direction: column;
`

export const Text = styled('p')(
  {
    fontSize: '1rem',
    fontStretch: 'normal',
    fontStyle: 'normal',
    fontWeight: 'normal',
    letterSpacing: 'normal',
    lineHeight: '1.33',
    marginBottom: '1.5em',
    textAlign: 'center',
  },
  (props) => css`
    font-family: ${props.theme.fontFamily.body};
    color: ${props.theme.colors.disabled.textContrast};
  `
)

export const Image = styled('img')`
  display: none;
  ${media.lg`
    display:block;
    width: 100%;
    height: 100%;
  `};
`

export const Row = styled('div')`
  align-items: center;
`

export const TableService = styled(Table)`
  margin-left: 0.6rem;

  table {
    th {
      background-color: #e7fcf7;
    }
    th:nth-of-type(2),
    td:nth-of-type(2) {
      display: none;
      ${media.md`
        display: table-cell;
      `};
    }
    th:nth-of-type(3),
    td:nth-of-type(3) {
      display: none;
      ${media.md`
       display: table-cell;
      `};
    }
  }
`

export const ServiceTitle = styled('p')`
  font-size: 0.9rem;
  font-weight: 500;
`

export const Description = styled('p')`
  font-style: italic;
  font-size: 0.7rem;
  ${media.md`
    display:none
  `};
`

export const StyledButton = styled(Button)`
  font-size: 0.8rem;
`
