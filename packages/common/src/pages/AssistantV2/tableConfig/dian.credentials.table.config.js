import React from 'react'

import FormattedDate from '../../../components/FormattedDate'

const renderDate = (value) => <FormattedDate date={value} />

const renderLink = (value, text) =>
  value && (
    <a onClick={() => download(value)} rel="noopener noreferrer">
      Archivos
    </a>
  )

const download = (downloadLink) => {
  window.open(downloadLink, '_blank', 'noopener,noreferrer')
}

const renderCredentials = (value) => {
  return (
    <ul>
      <li>Tipo doc: {value.national_id_kind}</li>
      <li>Nro doc:{value.national_id}</li>
      <li>Contraseña: {value.password}</li>
      <li>Contraseña de IFE: : {value.signature_password}</li>
    </ul>
  )
}

export default [
  {
    title: 'Fecha de registro',
    key: 'created_at ',
    dataIndex: 'created_at',
    render: renderDate,
    sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
  },
  {
    title: 'Estado aranea',
    key: 'aranea_status',
    dataIndex: 'aranea_status',
    render: (value, { deleted } = {}) =>
      !!deleted ? `${value} (deleted)` : value,
  },
  {
    title: 'Estado de credenciales',
    key: 'credential_status',
    dataIndex: 'credential_status',
  },
  {
    title: 'Credenciales DIAN',
    key: 'dian_credential',
    dataIndex: 'dian_credential',
    render: renderCredentials,
  },
  {
    title: 'Archivos',
    key: 'dian_files',
    dataIndex: 'dian_files',
    render: renderLink,
  },
]
