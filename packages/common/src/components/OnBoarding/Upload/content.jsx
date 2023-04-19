import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { message, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { CertificateManager } from '@tributi-co/tributi-components'

import { refCertificates } from '../../../config/firebase'
import { normalizeString } from '../../../helpers/collections'
import { captureSentryException } from '../../../sentry'
import {
  CERTIFICATES_MIMES,
  EXOGENA_FORMATS,
  CERTIFICATE_TYPES,
  OCR_STATUS_RECEVING_SAMPLES,
} from '../../../constants/certificates'
import { ROLES } from '../../../constants/person'
import { STATUS } from './status'
import {
  Container,
  UploadFeedback,
  MessageOcrStatus,
  TextMessageOcrStatus,
} from './style'
import { RootContext } from '../../../context'

const {
  CREATED,
  FAILED,
  PARTIAL,
  PENDING,
  PROCESSED,
  PROCESSING,
  QUEUED,
  CANCELLED,
  TRAINING,
} = STATUS
const CERTIFICATE_UPLOAD_WAIT = 5 * 60 * 1000
const CERTIFICATE_REQUEST_TIMEOUT = 30 * 1000
const AUTOMATED_PARTIAL_MODAL_COPY =
  'Por favor valida o corrige los campos resaltados y completa los campos vacíos para terminar esta sección'
const AUTOMATED_PARTIAL_TEXT =
  'Necesitamos tu ayuda verificando algunos valores de este certificado, haz clic en el botón "Validar"'

const WAITING_TEXT =
  'Este proceso podría tardar varios minutos, por favor espera'
const CANCELLED_TEXT =
  'Lo sentimos, el documento no pudo ser procesado. Por favor intenta nuevamente.'

const EXOGENA_WARNING_MESSAGE = {
  FME: 'Ingresaste un certificado que no cumple con el formato esperado, por favor ingresa el correcto',
  TYE: 'Ingresaste un certificado de un año gravable distinto al esperado, por favor ingresa uno correcto',
  WARNING_SIZE: 3,
}

const FIREBASE_OFFLINE = 'Failed to get document because the client is offline'

class UploadModal extends Component {
  static contextType = RootContext

  constructor(props) {
    super(props)
    this.state = { ...this.initialState }
    this.updateCertificate = this.updateCertificate.bind(this)
    this.getCertificate = this.getCertificate.bind(this)
    this.isProcessing = this.isProcessing.bind(this)
    this.handleClickDontHave = this.handleClickDontHave.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.handleRemoveCertificate = this.handleRemoveCertificate.bind(this)
    this.checkUploadTimeout = null
    this.unsubscribe = null
  }

  get initialState() {
    const { itemCertificate } = this.props
    const { user_certificate: userCertificate } = itemCertificate || {}
    return {
      processing: false,
      messageHidden: true,
      file: null,
      certificateId: null,
      finish: false,
      certificate: itemCertificate,
      is_alternative_questions: false,
      passwordFail: false,
      isCancelled: userCertificate && userCertificate.status === CANCELLED,
      statusCode: (userCertificate && userCertificate.status_code) || undefined,
    }
  }

  async componentDidMount() {
    const {
      certificate: { user_certificate: userCertificate },
      is_oculus: isOculus,
    } = this.state
    // in case user certificate is null
    const {
      id,
      status_code: statusCode,
      status: statusBack,
    } = userCertificate || {}

    let statusFirebase

    if (id) {
      try {
        const userCertificateFB = await refCertificates.doc(id).get()
        const fbCertificate = userCertificateFB.data() || {}
        const { id: userCertificateId } = fbCertificate
        statusFirebase = fbCertificate.status

        if ([CREATED, PROCESSING, QUEUED].includes(statusBack)) {
          const isCertificateProcessing =
            [PROCESSING, QUEUED].includes(statusBack) ||
            (isOculus && statusBack === CREATED)
          this.setState({
            processing: isCertificateProcessing,
            currentWarningMessage: EXOGENA_WARNING_MESSAGE[statusCode],
          })
          if (userCertificateId) {
            this.updateStatus(userCertificateId)
          }
        } else {
          this.setState({
            currentWarningMessage: EXOGENA_WARNING_MESSAGE[statusCode],
          })
        }
      } catch (error) {
        // Just report sentry event if the error is not by offline client
        if (error?.message && error.message.indexOf(FIREBASE_OFFLINE) < 0) {
          captureSentryException(error)
        }
      }
    }

    // If status of firebase and back are differents, should update firebase status
    if (statusBack !== statusFirebase) {
      const docFirebase = await refCertificates.doc(id)
      docFirebase.set({ status: statusBack })
    }
  }

  componentDidUpdate(_, prevState) {
    const { notifyLoading } = this.props
    if (prevState.processing !== this.state.processing) {
      notifyLoading()
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.checkUploadTimeout)
    // TODO check if the below line this is needed
    this.setState(this.initialState)
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  updateStatus(userCertificateId) {
    const { certificate } = this.state
    const { syncInstanceCertificates, loadSummary, markCertificateAsCancel } =
      this.props
    this.unsubscribe = refCertificates.doc(userCertificateId).onSnapshot(
      async (item) => {
        if (item && item.data()) {
          const { status } = item.data()
          if (
            [PROCESSED, PARTIAL].includes(status) &&
            !this.state.is_alternative_questions &&
            !this.state.finish
          ) {
            this.setState(
              {
                finish: true,
                certificate: {
                  ...certificate,
                  user_certificate: { ...certificate.user_certificate, status },
                },
                processing: false,
              },
              () => {
                loadSummary()
                message.success('El archivo subió exitosamente.')
              }
            )
            syncInstanceCertificates(this.props.instanceId, userCertificateId)
            clearTimeout(this.checkUploadTimeout)
          }
          if (status === FAILED) {
            this.setState({
              finish: false,
              certificate: {
                ...certificate,
                user_certificate: { ...certificate.user_certificate, status },
              },
              processing: false,
            })
            clearTimeout(this.checkUploadTimeout)
          }
          if (status === CANCELLED) {
            this.setState({
              certificate: {
                ...certificate,
                user_certificate: { ...certificate.user_certificate, status },
              },
              finish: false,
              isCancelled: true,
              processing: false,
            })
          }
          if (status === TRAINING) {
            this.setState({
              finish: false,
              certificate: {
                ...certificate,
                user_certificate: { ...certificate.user_certificate, status },
              },
              processing: false,
            })
            clearTimeout(this.checkUploadTimeout)
          }
        }
      },
      (err) => {
        console.log('error', err.message)
        clearTimeout(this.checkUploadTimeout)
        message.error(
          'Tuvimos un problema al subir tu archivo, intentalo nuevamente.'
        )
        this.setState({ processing: false })
        captureSentryException(err)
      }
    )
    clearTimeout(this.checkUploadTimeout)
    this.checkUploadTimeout = setTimeout(async () => {
      // run not response timeout endpoint call redux action
      markCertificateAsCancel(userCertificateId)
      captureSentryException(
        `User certificate ${userCertificateId} is taking more than ${CERTIFICATE_UPLOAD_WAIT} miliseconds loading, hence it was cancelled`
      )
    }, CERTIFICATE_UPLOAD_WAIT)
  }

  async handleUpload(instanceId, certificateId, file) {
    const { certificate } = this.state
    const { certificateCode, fillingId, personalInfo } = this.props

    if (file) {
      this.setState({ processing: true, isCancelled: false })
      const formData = new FormData()
      formData.append('instance_id', instanceId)
      formData.append('code', certificateCode)
      formData.append('taxobject', certificate.id)
      formData.append('file', file)
      const filename = normalizeString(file.name)
      axios
        .post(
          `${process.env.API_URL}/filings/${fillingId}/certificates`,
          formData,
          {
            headers: {
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache',
              Authorization: `JWT ${localStorage.jwtToken}`,
              'Content-Disposition': `attachment; filename="${filename}"`,
              'Consumer-App': personalInfo.consumer_app,
            },
            timeout: CERTIFICATE_REQUEST_TIMEOUT,
          }
        )
        .then(async ({ data: response }) => {
          const {
            status,
            id: userCertificateId,
            status_code: statusCode,
          } = response
          this.setState({
            status,
            certificateId: userCertificateId,
            certificate: { ...certificate, user_certificate: response },
            finish: false,
            is_alternative_questions: false,
            processing: [CREATED, PROCESSED].includes(status),
            currentWarningMessage: EXOGENA_WARNING_MESSAGE[statusCode],
            statusCode,
          })
          // We don't need to listen the poll if the document is standby
          // of password.
          if (status !== PENDING) {
            this.updateStatus(userCertificateId)
          }
        })
        .catch((error) => {
          message.error(
            'Tuvimos un problema al subir tu archivo, intentalo nuevamente.'
          )
          this.setState({ processing: false })
          // Just report sentry event if the error is not by offline client
          if (error?.message && error.message.indexOf(FIREBASE_OFFLINE) < 0) {
            captureSentryException(error)
          }
        })
    }
  }

  goToHelp(e, certificate) {
    e.preventDefault()
    window.open(certificate.values.certificate_url, '_blank')
  }

  updateCertificate(certificate) {
    const { status } = certificate.user_certificate || {}
    const shouldFinish = ![PROCESSING, QUEUED].includes(status)
    this.setState({
      certificate,
      finish: shouldFinish,
      processing: !shouldFinish,
    })
    if (this.unsubscribe && shouldFinish) {
      this.unsubscribe()
    }
  }

  getCertificate() {
    return this.state.certificate
  }

  isProcessing() {
    return this.state.processing
  }

  handleRemoveCertificate(instanceId) {
    const { removeCertificates } = this.props
    const { certificate } = this.state
    removeCertificates(instanceId, certificate)
  }

  handleClickDontHave() {
    const { certificate } = this.state
    const { user_certificate: userCertificate } = certificate
    const { read_status: readStatus } = userCertificate || {}
    const { onClickDontHave, instanceId } = this.props
    const isPartialRead = readStatus === PARTIAL
    const isReadCertificate = [PARTIAL, PROCESSED].includes(readStatus)
    const modalCopy = isPartialRead ? AUTOMATED_PARTIAL_MODAL_COPY : undefined
    onClickDontHave(
      certificate,
      instanceId,
      modalCopy,
      isReadCertificate,
      readStatus
    )
    this.setState({ is_alternative_questions: true })
  }

  updatePasswordCertificate = async (instanceId, certificateId, password) => {
    const { certificate } = this.state
    this.setState({
      certificate: {
        ...certificate,
        user_certificate: {
          ...certificate.user_certificate,
          status: PROCESSING,
        },
      },
      passwordFail: false,
      processing: true,
    })
    const {
      user_certificate: { id: userCertificateId },
    } = certificate
    const { updateCertificatePassword } = this.props
    try {
      await updateCertificatePassword(userCertificateId, password)
      this.updateStatus(userCertificateId)
    } catch ({ response }) {
      let status = PENDING
      let passwordFail =
        'La contraseña ingresada no es correcta, por favor intentalo nuevamente'
      if (!response) {
        passwordFail = ''
        message.error('Parece que hay un error de red, intenta de nuevo')
      } else if (response.status === 412) {
        status = FAILED
        passwordFail =
          'No se pudo desencriptar el archivo, trata de subirlo sin contraseña'
      }
      this.setState({
        certificate: {
          ...certificate,
          user_certificate: { ...certificate.user_certificate, status },
        },
        passwordFail,
        processing: false,
      })
    }
  }

  filterMessageOcrStatus() {
    const { certificate } = this.state
    const {
      is_oculus: isOculus,
      user_certificate: userCertificate,
      ocr_status: ocrStatus,
    } = certificate

    const certificateStatus = userCertificate ? userCertificate.status : false
    if (
      isOculus &&
      ocrStatus === OCR_STATUS_RECEVING_SAMPLES &&
      !certificateStatus
    ) {
      return (
        <MessageOcrStatus>
          <InfoCircleOutlined />
          <TextMessageOcrStatus>
            Todavía no podemos validar este certificado, pero si lo adjuntas tu
            muestra nos ayudará a poderlo procesar próximamente. ¡Gracias!
          </TextMessageOcrStatus>
        </MessageOcrStatus>
      )
    }
    if (
      isOculus &&
      ocrStatus === OCR_STATUS_RECEVING_SAMPLES &&
      certificateStatus === TRAINING
    ) {
      return (
        <MessageOcrStatus>
          <InfoCircleOutlined />
          <TextMessageOcrStatus>
            Muchas gracias por adjuntarlo, nos estas ayudanto a mejorar. No
            olvides que aún debes ingresar la información manualmente.
          </TextMessageOcrStatus>
        </MessageOcrStatus>
      )
    }
    return null
  }

  render() {
    const {
      processing,
      certificate,
      passwordFail,
      isCancelled,
      statusCode,
      currentWarningMessage,
    } = this.state
    const { instanceId, personalInfo } = this.props
    const { isAccountantApp } = this.context

    const {
      required_level: requiredLevel = -1,
      certificate_kind: certificateKind = '',
      is_oculus: isOculus = false,
      user_certificate: userCertificate,
      id: certificateId,
      ocr_status: ocrStatus,
    } = certificate

    const {
      status,
      is_automated: isAutomated,
      cert_file: certificateUrl,
      read_status: readStatus,
    } = userCertificate || {}
    let isOcrPending = null
    if (status === TRAINING && ocrStatus === OCR_STATUS_RECEVING_SAMPLES) {
      isOcrPending = TRAINING
    }

    const isPartial = status === PARTIAL
    const canReadUploadedCertificate =
      personalInfo.role === ROLES.ASSISTANT ||
      (personalInfo.role === ROLES.ACCOUNTANT && isAccountantApp)
    const isExogena = certificateKind === CERTIFICATE_TYPES.EXOGENA

    const isAutomatedPartial = isAutomated && isPartial
    const selectedMime = !isExogena ? CERTIFICATES_MIMES : EXOGENA_FORMATS
    const messageOcrStatus = this.filterMessageOcrStatus()
    return (
      <Container>
        <CertificateManager
          certificateId={certificateId}
          certificateType={certificateKind}
          certificateUrl={certificateUrl}
          instanceId={instanceId}
          isAutomated={isAutomated}
          isOculus={isOcrPending ? false : isOculus}
          isReadRole={canReadUploadedCertificate}
          mimeType={selectedMime.join(',')}
          onDelete={this.handleRemoveCertificate}
          onEdit={this.handleClickDontHave}
          onFilePasswordChange={this.updatePasswordCertificate}
          onUpload={this.handleUpload}
          readStatus={readStatus}
          requiredLevel={isOcrPending ? 0 : requiredLevel}
          status={
            ((processing || status === QUEUED) && PROCESSING) ||
            (status === CANCELLED && CREATED) ||
            status
          }
        />
        <UploadFeedback>
          {status === FAILED && !processing && !passwordFail && (
            <Tooltip overlayClassName={'upload__feedback_tooltip'}>
              <InfoCircleOutlined className="upload__feedback_icon" />
              <span>
                {isExogena &&
                statusCode &&
                statusCode.length === EXOGENA_WARNING_MESSAGE.WARNING_SIZE
                  ? currentWarningMessage
                  : isExogena && !statusCode // Keep to support old records
                  ? 'Ingresaste un certificado distinto al esperado, por favor verifica si es el correcto.'
                  : 'Ingresaste un certificado distinto al esperado, por favor verifica si es el correcto o ingresa manualmente los valores, dando clic en el botón "Ingresar info'}
              </span>
            </Tooltip>
          )}
          {(passwordFail || isAutomatedPartial) && (
            <>
              <InfoCircleOutlined className="upload__feedback_icon" />
              <span>
                {passwordFail || (isAutomatedPartial && AUTOMATED_PARTIAL_TEXT)}
              </span>
            </>
          )}
          {(processing || status === PROCESSING) && !passwordFail && (
            <Fragment>
              <InfoCircleOutlined className="upload__feedback_icon" />
              <span>{WAITING_TEXT}</span>
            </Fragment>
          )}
          {isCancelled && (
            <Fragment>
              <InfoCircleOutlined className="upload__feedback_icon" />
              <span>{CANCELLED_TEXT}</span>
            </Fragment>
          )}
        </UploadFeedback>
        {messageOcrStatus}
      </Container>
    )
  }
}

UploadModal.propTypes = {
  certificateCode: PropTypes.string,
  fillingId: PropTypes.string.isRequired,
  onClickDontHave: PropTypes.func.isRequired,
  instanceId: PropTypes.string.isRequired,
  itemCertificate: PropTypes.shape({}).isRequired,
  removeCertificates: PropTypes.func.isRequired,
  notifyLoading: PropTypes.func.isRequired,
  syncInstanceCertificates: PropTypes.func.isRequired,
  updateCertificatePassword: PropTypes.func.isRequired,
  loadSummary: PropTypes.func.isRequired,
  markCertificateAsCancel: PropTypes.func.isRequired,
  personalInfo: PropTypes.shape({
    consumer_app: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
}

export default UploadModal
