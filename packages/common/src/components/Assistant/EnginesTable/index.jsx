import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import List from 'antd/lib/list'
import Message from 'antd/lib/message'

import FormattedDate from '../../FormattedDate'
import { AFFIRMATIVE, NEGATIVE } from '../../../constants/strings'
import {
  ENGINE_STATUS_ASSISTANT,
  ENGINE_STATUS,
} from '../../../constants/engine'
import { ROLES } from '../../../constants/person'
import { ActionLink, Alert, Table } from './styles'

const { Column } = Table

export const DownloadablePDF = ({ data, statusMessage }) => (
  <>
    {statusMessage && (
      <Alert
        type="warning"
        message={
          <div
            dangerouslySetInnerHTML={{
              __html: statusMessage,
            }}
          />
        }
      />
    )}
    <List
      size="small"
      header="PDF Generados"
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <a href={item.cert_file} target="_blank" rel="noopener noreferrer">
            <FormattedDate date={item.created_at} />
            &nbsp;({item.is_completed ? 'Litográfico' : 'Borrador'})
          </a>
          &nbsp;por {item.user_email}
        </List.Item>
      )}
    />
  </>
)

const EnginesTable = ({
  data,
  downloadFinancialStatusDoc,
  documents,
  documentsError,
  isFilingRush,
}) => {
  useEffect(() => {
    if (documents && documents.summary) {
      window.open(documents.summary, '_blank', 'noopener noreferrer')
    }
    if (documentsError) {
      Message.error(documentsError, 5)
    }
  }, [documentsError, documents])

  const handleDownloadFinancialStatus = useCallback(
    (engine, status) => {
      if (status !== ENGINE_STATUS.VALID) {
        return Message.error(
          'No se puede descargar el resumen de esta declaración porque no tiene un estado válido',
          5
        )
      }
      downloadFinancialStatusDoc(engine)
    },
    [downloadFinancialStatusDoc]
  )

  return (
    <Table
      expandedRowRender={(item) => (
        <DownloadablePDF
          data={item.pdf_outputs}
          statusMessage={item.status_message}
        />
      )}
      dataSource={data}
      rowKey={(columns) => columns.id}
    >
      <Column title="Autor" key="author_email" dataIndex="author_email" />
      <Column
        title="Es asistente"
        key="author_role"
        dataIndex="author_role"
        render={(item) => (item === ROLES.ASSISTANT ? AFFIRMATIVE : NEGATIVE)}
      />
      <Column
        title="Creación"
        key="created_at"
        dataIndex="created_at"
        render={(value) => <FormattedDate date={value} />}
      />
      <Column
        title="Entrega esperada"
        key="expected"
        dataIndex={null}
        render={(filing) => {
          const expectedDate = moment(filing.created_at).add(
            isFilingRush ? 2 : 48,
            'hours'
          )
          return <FormattedDate date={expectedDate} />
        }}
      />
      <Column
        title="Completado"
        key="completed_at"
        dataIndex="completed_at"
        render={(value) => <FormattedDate date={value} />}
      />
      <Column
        title="Estado"
        key="status"
        dataIndex="status"
        render={(value) => ENGINE_STATUS_ASSISTANT[value]}
      />
      <Column
        title="Enlaces"
        key="links"
        render={(filing) => (
          <>
            <ActionLink
              href={filing.how_to_file_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Como presentarla
            </ActionLink>
            <ActionLink
              href={filing.template_book_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Motor
            </ActionLink>
            <ActionLink
              href="javascript:;"
              onClick={() =>
                handleDownloadFinancialStatus(filing.id, filing.status)
              }
            >
              Resumen
            </ActionLink>
          </>
        )}
      />
    </Table>
  )
}

DownloadablePDF.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      cert_file: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      is_completed: PropTypes.bool.isRequired,
      user_email: PropTypes.string.isRequired,
    })
  ),
  statusMessage: PropTypes.string,
}

EnginesTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      author_email: PropTypes.string,
      author_role: PropTypes.string,
      completed_at: PropTypes.string,
      created_at: PropTypes.string,
      how_to_file_link: PropTypes.string,
      id: PropTypes.string,
      is_rush: PropTypes.bool,
      pdf_outputs: PropTypes.arrayOf(
        PropTypes.shape({
          cert_file: PropTypes.string.isRequired,
          created_at: PropTypes.string.isRequired,
          is_completed: PropTypes.bool.isRequired,
          user_email: PropTypes.string.isRequired,
        })
      ),
      status: PropTypes.string.isRequired,
      status_message: PropTypes.string,
      template_book_url: PropTypes.string,
    })
  ),
  downloadFinancialStatusDoc: PropTypes.func.isRequired,
  documents: PropTypes.string,
  documentsError: PropTypes.string,
  isFilingRush: PropTypes.bool.isRequired,
}

EnginesTable.defaultProps = {
  data: [],
  documents: null,
  documentsError: null,
}

export default EnginesTable
