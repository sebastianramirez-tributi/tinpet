import React from 'react'
import FormattedDate from '../../../components/FormattedDate'
import ExpandableMessage from '../../../components/ExpandableMessage'
import { ENGINE_STATUS } from '../../../constants/engine'
import DownloadLink from '../../../components/DownloadLink'
import { Item, ItemEngine } from './style'

const { INVALID, ERROR, CANCELLED } = ENGINE_STATUS
const FAIL_STATUS = [INVALID, ERROR, CANCELLED]

const renderDate = (value) => <FormattedDate date={value} />
const renderLink = (value, text) => (
  <Item>
    <a href={value} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  </Item>
)

const renderLinkEngine = (value, text) => (
  <ItemEngine>
    <a href={value} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  </ItemEngine>
)

export default [
  {
    title: 'Estado',
    key: 'status_engine',
    dataIndex: 'status_engine',
    render: (value) => value.status,
    sorter: (a, b) => a.status_engine.length - b.status_engine.length,
    filtered: true,
  },
  {
    title: 'Autor',
    key: 'author',
    dataIndex: 'author',
    sorter: (a, b) => a.author.length - b.author.length,
  },
  {
    title: 'Es asistente',
    key: 'is_assistant',
    dataIndex: 'is_assistant',
    render: (value) => {
      const bool_value = JSON.parse(value.toLowerCase())
      return bool_value ? 'Si' : 'No'
    },
  },
  {
    title: 'Creación',
    key: 'created_at',
    dataIndex: 'created_at',
    render: renderDate,
    defaultSortOrder: 'descend',
    sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
  },
  {
    title: 'Entrega esperada',
    key: 'max_delivery_date',
    dataIndex: 'max_delivery_date',
    render: renderDate,
    sorter: (a, b) => a.max_delivery_date.length - b.max_delivery_date.length,
  },
  {
    title: 'Fecha completado',
    key: 'completed_at',
    dataIndex: 'completed_at',
    render: renderDate,
    sorter: (a, b) =>
      new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime(),
  },
  {
    title: 'PDF generados',
    key: 'pdf_outputs',
    dataIndex: 'form',
    render: (value, record) => {
      return <DownloadLink value={value} record={record} />
    },
  },
  {
    title: 'Como presentarla',
    key: 'how_to_file_link',
    dataIndex: 'how_to_file_link',
    render: (value, record) => {
      return FAIL_STATUS.includes(record.status_engine.status) ? (
        'No hay link'
      ) : record.form_160_output.length >= 1 ? (
        <div>
          {renderLink(record.how_to_file_160_link, 'Cómo presentar-160')} <br />
          {renderLink(value, 'Cómo presentar-210')}
        </div>
      ) : record.form === '210' ? (
        value && renderLink(value, 'Cómo presentar-210')
      ) : record.form === '110' ? (
        renderLink(value, 'Cómo presentar-110')
      ) : null
    },
  },
  {
    title: 'Resumen',
    key: 'financial_status',
    dataIndex: 'financial_status',
    render: (value, record) => {
      return record.form !== null ? (
        <DownloadLink value={value} record={record} text="Descargar resumen" />
      ) : null
    },
  },
  {
    title: 'Motor',
    key: 'template_book_url',
    dataIndex: 'template_book_url',
    render: (value, record) => {
      return record.form !== null ? renderLinkEngine(value, 'Motor') : null
    },
  },
  {
    title: 'Tipo de error',
    key: 'status_code',
    dataIndex: 'status_engine',
    render: (value) => (value.status_code ? value.status_code : ''),
  },
  {
    title: 'Copy error',
    key: 'status_message',
    dataIndex: 'status_message',
    render: (status_message) =>
      status_message && <ExpandableMessage message={status_message} />,
  },
]
