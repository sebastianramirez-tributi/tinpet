import styled from '@emotion/styled'
import { css } from '@emotion/core'

export const TableRow = styled.tr`
  display: flex;
`

export const Cell = styled.td`
  color: ${({ theme }) => theme.colors.black65};
  flex: 1;
  font-size: 0.8rem;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  text-align: center;
  padding: 10px 20px;

  ${(props) =>
    props.left &&
    css`
      text-align: left;
    `}

  ${(props) =>
    props.ellipsis &&
    css`
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    `}
`
