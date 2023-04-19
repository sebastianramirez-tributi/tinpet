import React, { useMemo } from 'react'
import moment from 'moment'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import PopConfirm from 'antd/lib/popconfirm'

import ActionButton from '../ActionButton'
import { TableRow, Cell } from './style'

const AccountantFilingTableRow = ({
  id,
  filing,
  first_name,
  last_name,
  onEdit,
  onDelete,
  onContinue,
}) => {
  const handleEdition = () => onEdit && onEdit(id)
  const handleDelete = () => onDelete && onDelete(id, filing.id, false)
  const handleContinue = () => onContinue && onContinue(id, filing.id)
  const filingActionButton = !filing.created_at ? 'Comenzar' : 'Continuar'
  const formattedDueDate = useMemo(
    () =>
      filing.due_date
        ? moment(filing.due_date).format('DD [de] MMMM [de] YYYY')
        : null,
    [filing.due_date]
  )
  return (
    <TableRow>
      <Cell left>
        {first_name} {last_name}
      </Cell>
      <Cell>
        <ActionButton icon onClick={handleEdition}>
          <EditOutlined />
        </ActionButton>
        <PopConfirm
          cancelText="Cancelar"
          okText="Eliminar"
          title="¿Quieres eliminar a esta declaración?"
          onConfirm={handleDelete}
        >
          <ActionButton icon danger>
            <DeleteOutlined />
          </ActionButton>
        </PopConfirm>
      </Cell>
      <Cell ellipsis title={formattedDueDate}>
        {formattedDueDate}
      </Cell>
      <Cell>
        <ActionButton onClick={handleContinue} success outlined>
          {filingActionButton}
        </ActionButton>
      </Cell>
    </TableRow>
  )
}

export default AccountantFilingTableRow
