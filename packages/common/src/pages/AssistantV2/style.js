import styled from '@emotion/styled'
import { css } from '@emotion/core'
// import List from 'antd/lib/list'
import { Input, List } from 'antd'
import { DataTable as BaseDataTable } from '@tributi-co/tributi-components'

import { media } from '../../styles/utils'

export const ActionLink = styled.a`
  display: block;
`

export const Container = styled.div`
  max-width: none;
  width: 95%;

  .ant-list-sm .ant-list-item {
    padding: 0;
  }
`

export const Content = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;

  .ant-form-item-label {
    text-align: center;
  }
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  span {
    font-size: 0.75rem;

    &:first-of-type {
      font-size: 0.8rem;
      font-weight: bold;
    }

    ${media.md`
      &:first-of-type {
        font-weight: normal;
      }
      &:not(:nth-of-type(1)) {
        display: none;
      }
    `}
  }
`

export const Title = styled.h3(
  (props) => css`
    color: ${props.theme.colors.primary.main};
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 1.25rem;
    margin-top: 1.25rem;
  `
)

// assistan v2
export const ContainerButtons = styled.div`
  display: block;
  width: 150px;
  button {
    margin: 0.5rem 0.5rem 0 0;
    width: 150px;
  }
`
export const ContainerCell = styled.div`
  display: flex;
  flex-direction: column;
`

export const ListItem = styled(List.Item)`
  display: flex;
  max-width: 250px;

  strong {
    font-weight: bold;
    color: rgba(0, 0, 0, 0.8);
  }

  #author {
    color: gray;
  }
`

export const DocumentName = styled.div`
  display: flex;
  flex-direction: column;

  span:nth-of-type(2n + 1) {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
`
export const DataTableExpandable = styled.div`
  .ant-table-wrapper {
    .ant-table-row-expand-icon {
      position: absolute;
      top: 40%;
      left: 30%;
    }
  }
`

export const DataTable = styled(BaseDataTable)(
  ({ theme }) => `
    table {
      th {
        color: ${theme.colors.text.assistantTableHeader};
      }
    }
`
)
export const InputPaymentRef = styled(Input)`
  span {
    input {
      &::placeholder {
        font-size: 10px;
        margin: 0;
      }
    }
  }
`
