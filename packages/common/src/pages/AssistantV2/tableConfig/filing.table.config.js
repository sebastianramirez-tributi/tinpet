import React from 'react'
import { AccountantFilingTable } from '@tributi-co/tributi-components'

import FormattedDate from '../../../components/FormattedDate'
import { PAYMENT_STATUS } from '../../../constants/payment'

const { renderSwitch } = AccountantFilingTable

const renderDate = (value) => <FormattedDate date={value} />

export default ({ toggleVideocallException }) => [
  {
    title: 'Año gravable',
    key: 'tax_year',
    dataIndex: 'tax_year',
    sorter: (a, b) => a.tax_year - b.tax_year,
  },
  {
    title: 'Plan',
    key: 'product_plan',
    dataIndex: 'product_plan',
    render: (value) => (typeof value === 'string' ? value : value?.name),
    sorter: (a, b) =>
      a.product_plan?.name?.length - b.product_plan?.name?.length,
  },
  {
    title: 'Último estado de pagos',
    key: 'payment_status',
    dataIndex: 'payment_status',
    sorter: (a, b) => a.payment_status.length - b.payment_status.length,
  },
  {
    title: 'Link video llamada',
    key: 'videocall_link',
    dataIndex: ['pro_data', 'video_call_url_exception'],
    render: renderSwitch(toggleVideocallException, {
      idSelector: (filing) => filing.id,
      isVisible: (filing) =>
        filing?.product_plan?.is_assisted &&
        filing?.payment_status === PAYMENT_STATUS.APPROVED,
    }),
  },
  {
    title: 'Fecha vencimiento',
    key: 'due_date',
    dataIndex: 'due_date',
    render: renderDate,
    sorter: (a, b) =>
      new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
  },
  {
    title: 'Fecha creación',
    key: 'created_at',
    dataIndex: 'created_at',
    render: renderDate,
    sorter: (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  },
  {
    title: 'Fecha última actualización',
    key: 'updated_at',
    dataIndex: 'updated_at',
    render: renderDate,
    sorter: (a, b) =>
      new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
  },
  {
    title: 'Estado declaración',
    key: 'status',
    dataIndex: 'status',
    sorter: (a, b) => a.status.length - b.status.length,
  },
  {
    title: 'F. ultima actualización estado',
    key: 'change_status_at',
    dataIndex: 'change_status_at',
    render: renderDate,
    sorter: (a, b) =>
      new Date(a.change_status_at).getTime() -
      new Date(b.change_status_at).getTime(),
  },
  {
    title: 'Filing ID',
    key: 'id',
    dataIndex: 'id',
    sorter: (a, b) => a.id.length - b.id.length,
  },
  {
    title: 'Estado presentación',
    key: 'is_submitted_by_app',
    dataIndex: 'is_submitted_by_app',
    render: (value, record) => {
      return value ? (
        <div>
          App tributi <br />
          {renderDate(record?.submitted_by_app_at)}
        </div>
      ) : (
        ''
      )
    },
  },
]
