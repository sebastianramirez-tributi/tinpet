import React, { useEffect } from 'react'
import { Collapse, List } from 'antd'
import { connect } from 'react-redux'

import FormattedDate from '../FormattedDate'
import { ENGINE_STATUS } from '../../constants/engine'
import { FILE_TYPES, FILE_COPIES_DICTIONARY } from '../../constants/documents'
import { getBlobFile, clearBlobFile } from '../../redux/form/actions'
import { CaretRightOutlined } from '@ant-design/icons'

import { ListItem, StyledCollapse, StyledPanel } from './style'

const { INVALID, ERROR, CANCELLED } = ENGINE_STATUS
const FAIL_STATUS = [INVALID, ERROR, CANCELLED]

const { Panel } = Collapse

/**
 * Render links to download declaration and resume files
 * This component valid the form (210, 110, 160) to render respectly
 * When is a declaration, need a text property filled
 */
const DownloadLink = ({
  assistantLocalState,
  getBlobFile,
  clearBlobFile,
  blob,
  engineRequest,
  text = '',
  ...props
}) => {
  const { record, value } = props
  const { currentPerson, currentFiling } = assistantLocalState
  const { tax_year: taxYear } = currentFiling || {}

  const {
    id,
    form_160_output,
    form_110_output,
    form: currentForm,
    status_engine: statusEngine,
    pdf_outputs: pdfOutputs,
  } = record

  let form =
    form_160_output.length > 1 ? 160 : currentForm === '210' ? 210 : 110

  let endPoint =
    form === 210
      ? [`/dian-forms-local-210/${id}?type=draft`]
      : form === 160
      ? [form_160_output, `/dian-forms-local-210/${id}?type=draft`]
      : [form_110_output]

  const type = text.length > 0 ? 'Resumen' : 'Declaración'

  if (type === 'Resumen') endPoint = [value]

  /**
   *
   * @param {Array} data: List of engines to show, can be untidy
   * @returns Object with id forms by keys and each id with an array of items
   */
  const taxAgencyFormIdList = (data) => {
    const formIdObject = data.reduce((acc, item) => {
      const { form: formCurrent } = item
      if (!Object.keys(acc).includes(formCurrent)) {
        acc[formCurrent] = []
      }
      acc[formCurrent].push(item)
      return acc
    }, {})

    return formIdObject
  }

  const renderDefaultList = (data) => {
    const { is_submitted_by_app: isSubmittedByApp } = currentFiling || {}

    return (
      <List
        size="small"
        dataSource={data}
        renderItem={(item) => (
          <ListItem>
            <a href={item.cert_file} target="_blank" rel="noopener noreferrer">
              <strong>
                {item.form}&nbsp;
                {FILE_COPIES_DICTIONARY[item.type]}
              </strong>
              <FormattedDate date={item.created_at} />
              <span className="author" data-testid="list-email">
                , por {item.user_email}
              </span>
            </a>
          </ListItem>
        )}
      />
    )
  }

  const renderList = (data) => {
    // If there are many items, must validate if are expandables
    if (data.length > 1) {
      const formIdObject = taxAgencyFormIdList(data)
      const formIdList = Object.keys(formIdObject)

      return (
        <List
          size="small"
          dataSource={formIdList}
          renderItem={(item) => {
            const forms = formIdObject[item]
            return (
              <StyledCollapse
                bordered={false}
                expandIcon={({ isActive }) => (
                  <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
              >
                <Panel header={item}>{renderDefaultList(forms)}</Panel>
              </StyledCollapse>
            )
          }}
        />
      )
    } else {
      return renderDefaultList(data)
    }
  }

  const downloadPDF = async (typeForm = '110') => {
    const localEndPoint = endPoint[0]
    getBlobFile(localEndPoint, localEndPoint)
  }

  const download = (file) => {
    const fileURL = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = fileURL
    const { first_name: firstName, last_name: lastName } = currentPerson
    const { tax_year: taxYear, is_submitted_by_app: isSubmittedByApp } =
      currentFiling || {}
    const fileName =
      type === 'Resumen'
        ? `${type}-AñoGravable${taxYear}-${firstName} ${lastName}.pdf`
        : `${type}-Formulario${form}-AñoGravable${taxYear}-${firstName} ${lastName}.pdf`
    link.download = fileName
    link.click()
    clearBlobFile()
  }

  useEffect(() => {
    const downloadFile = () => {
      if (blob && endPoint.includes(engineRequest)) {
        if (engineRequest.indexOf('dian-forms-local-210') !== -1) form = 210
        const file = new Blob([blob.data], { type: 'application/pdf' })
        download(file, type, form)
      }
    }
    downloadFile()
  }, [engineRequest])

  return FAIL_STATUS.includes(statusEngine.status) ? (
    'No hay link'
  ) : text ? (
    <a
      onClick={() => downloadPDF()}
      style={{ cursor: 'pointer' }}
      data-testid="download-pdf-default"
    >
      Descargar resumen
    </a>
  ) : form === 160 ? (
    <ul>
      <ListItem>
        <a
          onClick={() => downloadPDF(160)}
          style={{ cursor: 'pointer' }}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="download-pdf-160"
        >
          <strong>160 Borrador: </strong>
          <FormattedDate date={record.created_at} />
          <span className="author">, por {record.author}</span>
        </a>
      </ListItem>
      {renderList(record.pdf_outputs)}
    </ul>
  ) : form === 210 && pdfOutputs.length ? (
    renderList(record.pdf_outputs)
  ) : (
    form === 110 &&
    form_110_output !== '' && (
      <ListItem>
        <a
          onClick={() => downloadPDF(110)}
          style={{ cursor: 'pointer' }}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="download-pdf-110"
        >
          <strong>110 Borrador: </strong>
          <FormattedDate date={record.created_at} />
          <span className="author">, por {record.author}</span>
        </a>
      </ListItem>
    )
  )
}

const mapStateToProps = ({ registerReducer }) => ({
  assistantLocalState: registerReducer.assistantLocalState,
  blob: registerReducer.blob,
  engineRequest: registerReducer.engineRequest,
})

const mapDispatchToProps = {
  getBlobFile,
  clearBlobFile,
}

export default connect(mapStateToProps, mapDispatchToProps)(DownloadLink)
