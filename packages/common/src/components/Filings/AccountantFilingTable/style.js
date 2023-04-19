import styled from '@emotion/styled'
import { css } from '@emotion/core'

export const Table = styled.table`
  display: flex;
  flex-direction: column;
`

export const TableHead = styled.thead(
  ({ theme }) => `
    background: ${theme.colors.gray.gallery};
    border-bottom: 1px solid ${theme.colors.gray.alto};
    color: ${theme.colors.black85};
    font-size: 0.8rem;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
  `
)

export const TableHeadRow = styled.tr`
  display: flex;
  align-items: flex-end;
`

export const HeaderCell = styled.th`
  padding: 10px 20px;
  text-align: center;
  flex: 1;
  ${(props) =>
    props.noFlex &&
    css`
      flex: none;
    `}
  ${(props) =>
    props.left &&
    css`
      text-align: left;
    `}
  ${(props) =>
    props.right &&
    css`
      text-align: right;
    `}
`
