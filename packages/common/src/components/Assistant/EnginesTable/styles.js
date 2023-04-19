import styled from '@emotion/styled'
import AntdTable from 'antd/lib/table'
import AntdAlert from 'antd/lib/alert'

export const ActionLink = styled.a(
  ({ theme }) => `
    display: block;

    &:visited {
      color: ${theme.colors.text.links.visited};
    }
  `
)

export const Alert = styled(AntdAlert)`
  margin: 1rem 0;
`

export const Table = styled(AntdTable)(
  ({ theme }) => `
  .ant-table-content {
    color: ${theme.colors.black65};
    overflow: scroll;
  }
`
)
