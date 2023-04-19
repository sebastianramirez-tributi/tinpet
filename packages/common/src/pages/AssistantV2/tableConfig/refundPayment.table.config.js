import React from 'react'
import FormattedDate from '../../../components/FormattedDate'

const renderDate = (value) => <FormattedDate date={value} />

export default [
  {
    title: 'Fecha de solicitud',
    key: 'created_at',
    dataIndex: 'created_at',
    render: renderDate,
  },
  {
    title: 'Motivo de reembolso',
    key: 'details',
    dataIndex: 'details',
  },
  {
    title: 'Estado reembolso',
    key: 'status',
    dataIndex: 'status',
  },
  {
    title: 'F. última actualización estado',
    key: 'updated_at',
    dataIndex: 'updated_at',
    render: renderDate,
  },
]
