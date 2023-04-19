import React, { useMemo } from 'react'
import moment from 'moment'
import { AccountantFilingTable } from '@tributi-co/tributi-components'

import * as filingActions from '../../../redux/filings/actions'
import {
  FILING_STATUS,
  STATUS_HUMANIZATED as ORIGINAL_STATUS_HUMANIZATED,
} from '../../../constants/filings'
import TableFilter from '../components/AccountantTableFilter'
import Capitalize from '../components/Capitalize'
import {
  DATE_FORMAT_DASHED,
  HUMANIZED_SHORT_DATE_FORMAT,
  UTC_DATE_FORMAT,
} from '../../../constants/strings'
import useFilingFilters from '../useFilingFilters'
import {
  getInputValue,
  getDateInputValue,
  FILTER_PROP_TYPES,
  TABLE_PROP_TYPES,
} from '../utils'
import { getMaxTaxYear } from '../../../helpers/collections'

const { renderActionsCell, renderSwitch } = AccountantFilingTable

export { default as Header } from '../components/Header'

const STATUS_HUMANIZATED = { ...ORIGINAL_STATUS_HUMANIZATED }
delete STATUS_HUMANIZATED[FILING_STATUS.UN_STARTED]

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
      type: 'date',
      name: 'filterDueDate',
      placeholder: 'Filtrar por fecha de vencimiento',
      onChange: (value) =>
        onChangeFilter('dueDate', getDateInputValue(value, DATE_FORMAT_DASHED)),
      value: filters.dueDate && moment(filters.dueDate, DATE_FORMAT_DASHED),
      format: HUMANIZED_SHORT_DATE_FORMAT,
    },
    {
      type: 'date',
      name: 'filterScheduled',
      placeholder: 'Filtrar por fecha de cita',
      onChange: (value) =>
        onChangeFilter('scheduled', getDateInputValue(value, UTC_DATE_FORMAT)),
      value: filters.scheduled && moment(filters.scheduled, UTC_DATE_FORMAT),
      format: HUMANIZED_SHORT_DATE_FORMAT,
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

function getColumnsConfig({
  onChange160FormSubmission,
  onChangeMustDeclareStatus,
  ...actionCallbacks
}) {
  return [
    {
      title: 'Nombre',
      dataIndex: 'name',
      width: '25%',
    },
    {
      title: 'Año',
      dataIndex: 'taxYear',
      sorter: (prevRow, nextRow) => prevRow.taxYear - nextRow.taxYear,
      responsive: ['md'],
      align: 'center',
      width: '5%',
    },
    {
      title: 'Vencimiento',
      dataIndex: 'dueDate',
      sorter: (prevRow, nextRow) => {
        return (
          (prevRow.filing?.due_date ? Date.parse(prevRow.filing.due_date) : 0) -
          (nextRow.filing?.due_date ? Date.parse(nextRow.filing.due_date) : 0)
        )
      },
      render: (date) => <Capitalize>{date}</Capitalize>,
      align: 'right',
      responsive: ['xl'],
      width: '15%',
    },
    {
      title: 'Cita',
      dataIndex: 'scheduled',
      sorter: (prevRow, nextRow) => {
        const { scheduled_at: prevScheduledAt } =
          prevRow?.filing?.scheduling || {}
        const { scheduled_at: nextScheduledAt } =
          nextRow?.filing?.scheduling || {}
        return (
          (prevScheduledAt ? Date.parse(prevScheduledAt) : 0) -
          (nextScheduledAt ? Date.parse(nextScheduledAt) : 0)
        )
      },
      render: (date) => <Capitalize>{date}</Capitalize>,
      align: 'right',
      responsive: ['xl'],
      width: '15%',
    },
    {
      title: 'No Declara',
      dataIndex: ['filing', 'pro_data', 'not_needs_submitted'],
      responsive: ['xl'],
      align: 'center',
      width: '8%',
      render: renderSwitch(onChangeMustDeclareStatus, {
        idSelector: (record) => record?.filing.id,
        isVisible: (record) => record.filing,
        isDisabled: (record) => record?.filing?.tax_year < getMaxTaxYear(),
        disabledTitle:
          'Esta declaración no se puede marcar como No Debe Declarar',
      }),
    },
    {
      title: 'Presentó F160',
      dataIndex: ['filing', 'pro_data', 'is_submitted_form_160'],
      responsive: ['xl'],
      align: 'center',
      width: '10%',
      render: renderSwitch(onChange160FormSubmission, {
        idSelector: (record) => record.filing?.id,
        isVisible: (record) => record.filing,
        isDisabled: ({ filing = {} }) =>
          filing?.tax_year < getMaxTaxYear() || !filing?.needs_form_160,
        disabledTitle: 'El Formulario 160 no aplica para esta declaración',
      }),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      responsive: ['xl'],
      align: 'center',
      width: '10%',
    },
    {
      title: '',
      key: 'action',
      render: renderActionsCell(actionCallbacks),
      width: '10%',
    },
  ]
}

export function getLoadPersons({ dispatch }) {
  return async () => {
    // Loads persons
    await dispatch(filingActions.loadPersons())
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

export function Filters({ taxableYearsOptions, onFilter }) {
  const { filters, onChangeFilter } = useFilingFilters(onFilter, {
    status: 'customer:accountant:filings-filter:status',
  })
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
  onSort,
  onContinueFiling,
  tableLoading,
  onChange160FormSubmission,
  onChangeMustDeclareStatus,
}) {
  const config = getColumnsConfig({
    onContinue: onContinueFiling,
    onChange160FormSubmission,
    onChangeMustDeclareStatus,
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
