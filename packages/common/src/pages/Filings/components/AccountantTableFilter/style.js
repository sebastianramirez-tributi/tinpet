import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { TableFilter as TableFilterBase } from '@tributi-co/tributi-components'

export const TableFilter = styled(TableFilterBase)(css`
  justify-content: center;
  margin: 1rem 2rem 0;

  .ant-picker-input input {
    text-transform: capitalize;
  }
`)
