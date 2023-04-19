import React from 'react'

import FormattedDate from '../../../components/FormattedDate'
import { DocumentName } from '../style'

const renderDate = (value) => <FormattedDate date={value} />

const renderLink = (value, text) => (
  <a href={value} target="_blank" rel="noopener noreferrer">
    {text}
  </a>
)

export default [
  {
    title: 'Certificado que debia adjuntar',
    key: 'document_description ',
    dataIndex: 'document_description',
    render: (value, record) => {
      return (
        <DocumentName>
          <span>{record.entity.name}</span>
          <span>{value.text}</span>
        </DocumentName>
      )
    },
  },
  {
    title: 'Fecha en la que se adjuntó',
    key: 'created_at',
    dataIndex: 'created_at',
    sorter: (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    defaultSortOrder: 'descend',
    render: renderDate,
  },
  {
    title: 'Estado en servidores',
    key: 'status',
    dataIndex: 'status',
  },
  {
    title: 'Estado en navegador',
    key: 'firebase_status',
    dataIndex: 'firebase_status',
    render: (value) => {
      return value !== null ? value : 'No aplica'
    },
  },
  {
    title: 'Estado de extracción',
    key: 'read_status',
    dataIndex: 'read_status',
    render: (value) => {
      return value !== null ? value : 'No aplica'
    },
  },
  {
    title: 'Fecha de eliminación',
    key: 'desactivated_at',
    dataIndex: 'desactivated_at',
    render: renderDate,
  },
  {
    title: 'Link de descarga',
    key: 'cert_file',
    dataIndex: 'cert_file',
    render: (value) => renderLink(value, 'Descargar documento'),
  },
]
