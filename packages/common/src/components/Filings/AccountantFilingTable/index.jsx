import React, { useMemo } from 'react'

import AccountantFilingTableRow from '../AccountantFilingTableRow'
import { Table, HeaderCell, TableHead, TableHeadRow } from './style'

const AccountantFilingTable = ({ data = [], onEdit, onDelete, onContinue }) => {
  const flatData = useMemo(() => {
    return data
      .map((person) =>
        person.filings
          ? person.filings.map((filing) => ({ ...person, filing }))
          : []
      )
      .flat()
  }, [data])
  return (
    <Table>
      <TableHead>
        <TableHeadRow>
          <HeaderCell left>Nombre</HeaderCell>
          <HeaderCell flexNone />
          <HeaderCell>Fecha de vencimiento</HeaderCell>
          <HeaderCell right>Acciones</HeaderCell>
        </TableHeadRow>
      </TableHead>
      <tbody>
        {flatData.map((row) => (
          <AccountantFilingTableRow
            {...row}
            key={row.filing.id}
            onEdit={onEdit}
            onDelete={onDelete}
            onContinue={onContinue}
          />
        ))}
      </tbody>
    </Table>
  )
}

export default AccountantFilingTable
