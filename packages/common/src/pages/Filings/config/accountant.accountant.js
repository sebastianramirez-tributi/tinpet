import React, { useMemo } from 'react'
import { AccountantFilingTable } from '@tributi-co/tributi-components'

import * as filingActions from '../../../redux/filings/actions'
import useFilingFilters from '../useFilingFilters'
import { STATUS_HUMANIZATED } from '../../../constants/filings'
import { FORM_CONTROLS } from '../../../components/PersonForm'
import TableFilter from '../components/AccountantTableFilter'
import { FILTER_PROP_TYPES, getInputValue, TABLE_PROP_TYPES } from '../utils'
import Capitalize from '../components/Capitalize'

const CONTADIA_LEGACY_FILINGS = 2021
const CONTADIA_LEGACY_URL = 'http://legacy.contadia.com/'

const { renderActionsCell, renderSubmissionSwitch } = AccountantFilingTable

export const formConfig = [
  FORM_CONTROLS.FORM_CONTROL_NAME,
  FORM_CONTROLS.FORM_CONTROL_SURNAME,
  FORM_CONTROLS.FORM_ONLY_CONTROL_DOCUMENT_ID,
  FORM_CONTROLS.FORM_CONTROL_PHONE,
]

export { default as Header } from '../components/AccountantHeader'

function getFilterConfig({ filters, years, onChangeFilter }) {
  return [
    {
      type: 'input',
      name: 'filterDocument',
      placeholder: 'Buscar por nombre o documento',
      onChange: (e) => onChangeFilter('search', getInputValue(e)),
      value: filters.search,
    },
    {
      type: 'select',
      name: 'filterYear',
      defaultValue: '',
      defaultOptionPlaceholder: 'Filtrar por año gravable',
      onChange: (value) => onChangeFilter('year', value),
      options: years,
      value: filters.year,
    },
    {
      type: 'select',
      name: 'filterStatus',
      defaultValue: '',
      defaultOptionPlaceholder: 'Filtrar por estado',
      onChange: (value) => onChangeFilter('status', value),
      options: STATUS_HUMANIZATED,
      value: filters.status,
    },
  ]
}

function getColumnsConfig({ onChangeSubmitStatus, ...actionCallbacks }) {
  return [
    {
      title: 'Nombre',
      dataIndex: 'name',
      width: '25%',
    },
    {
      title: 'Año gravable',
      dataIndex: 'taxYear',
      sorter: (prevRow, nextRow) => prevRow.taxYear - nextRow.taxYear,
      responsive: ['md'],
      align: 'right',
      width: '10%',
    },
    {
      title: 'Fecha de vencimiento',
      dataIndex: 'dueDate',
      sorter: (prevRow, nextRow) => {
        return (
          (prevRow.filing?.due_date ? Date.parse(prevRow.filing.due_date) : 0) -
          (nextRow.filing?.due_date ? Date.parse(nextRow.filing.due_date) : 0)
        )
      },
      render: (date) => <Capitalize>{date}</Capitalize>,
      responsive: ['xl'],
      width: '15%',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      responsive: ['xl'],
      width: '10%',
    },
    {
      title: 'Presentada',
      dataIndex: 'isSubmitted',
      width: '10%',
      render: renderSubmissionSwitch(onChangeSubmitStatus),
    },
    {
      title: '',
      key: 'action',
      width: '20%',
      render: renderActionsCell(actionCallbacks),
    },
  ]
}

export function getLoadPersons({ dispatch }) {
  return async () => {
    // Loads persons
    await dispatch(filingActions.loadPersons())
    // Excludes accountant own person
    await dispatch(filingActions.excludeOwnPerson())
    // Mocks missing years for persons
    await dispatch(filingActions.mockFilings())
    // Mock due dates
    await dispatch(filingActions.mockDueDates())
    // Formats the persons to list of filings
    await dispatch(filingActions.formatFilings())
  }
}

export function getFormatFilings({ dispatch }) {
  return async () => {
    await dispatch(filingActions.formatFilings())
  }
}

export function getFilterFilings({ dispatch }) {
  return async ({ filters, sort }) => {
    await dispatch(filingActions.filterFilings({ filters, sort }))
  }
}

export function getOverwriteActions({ dispatch }) {
  return {
    onStartFiling(original, params) {
      const { taxYear } = params
      if (!handleRedirectLegacyFiling(taxYear)) return original(params)
    },
    onContinueFiling(original, params) {
      const { tax_year: taxYear } = params
      if (!handleRedirectLegacyFiling(taxYear)) return original(params)
    },
    async onSubmitForm(original, params) {
      original({ ...params, user_document_type: 'cedula_de_ciudadania' })
    },
  }
}

export function Filters({ taxableYearsOptions, onFilter }) {
  const { filters, onChangeFilter } = useFilingFilters(onFilter)

  const filterConfig = useMemo(
    () =>
      getFilterConfig({
        filters,
        years: taxableYearsOptions,
        onChangeFilter,
      }),
    [filters, taxableYearsOptions, onChangeFilter]
  )

  return <TableFilter filterConfig={filterConfig} />
}

Filters.propTypes = FILTER_PROP_TYPES

export function Table({
  filingsFiltered,
  tableLoading,
  onSort,
  onEditPerson,
  onDeletePerson,
  onStartFiling,
  onContinueFiling,
  onDeleteFiling,
  onChangeSubmitStatus,
}) {
  const config = getColumnsConfig({
    onChangeSubmitStatus,
    onStart: onStartFiling,
    onContinue: onContinueFiling,
    onEdit: onEditPerson,
    onDelete: onDeleteFiling,
    onDeletePerson,
  })

  return (
    <AccountantFilingTable
      loading={tableLoading}
      columns={config}
      dataSource={filingsFiltered}
      onSort={onSort}
      tableLayout="fixed"
    />
  )
}

Table.propTypes = TABLE_PROP_TYPES

/**
 * redirects to `legacy.contadia.com` when tax year is lower than or equals to CONTADIA_LEGACY_FILINGS
 * @param {number} taxYear filing tax year
 */
function handleRedirectLegacyFiling(taxYear) {
  if (taxYear <= CONTADIA_LEGACY_FILINGS) {
    window.open(CONTADIA_LEGACY_URL, '_blank', 'noopener noreferrer')
    return true
  }
}
