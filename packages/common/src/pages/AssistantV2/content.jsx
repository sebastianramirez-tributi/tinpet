import React, {
  Fragment,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { Modal, message, Tooltip, Form, Input } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  Button,
  AssistantFilter,
  LocationBar,
  FormEdit,
  useFirebaseCollection,
} from '@tributi-co/tributi-components'

import { Card, CardHeader, CardBody } from '../../components/Card'
import ActionContainer from './ActionContainer'
import { FormRecoverPassword } from '../../components/RecoverPassword'
import FormFilingSelect from '../../components/Filings/FormFilingSelect'
import { comparePassword, normalizePhone } from '../../helpers/collections'
import { ACTIONS } from './config'
import { PAYMENT_STATUS } from '../../constants/payment'
import { USER_DOCUMENT_TYPE } from '../../constants/person'
import { usePersonalInfo } from '../../helpers/hooks'
import PaymentRefundForm from '../../components/PaymentRefundForm'

import {
  Container,
  Content,
  Title,
  ContainerButtons,
  ContainerCell,
  DataTableExpandable,
  DataTable,
  InputPaymentRef,
} from './style'

import DATA_TABLE_USER from './tableConfig/user.table.config'
import TABLE_CONFIG_PERSONS from './tableConfig/person.table.config'
import TABLE_CONFIG_DOCUMENTS from './tableConfig/document.table.config'
import TABLE_CONFIG_ENGINES from './tableConfig/engine.table.config'
import TABLE_CONFIG_PAYMENTS from './tableConfig/payments.table.config'
import TABLE_CONFIG_ACCOUNT_SWAP from './tableConfig/account.swap.config'
import TABLE_CONFIG_DIAN_CREDENTIALS from './tableConfig/dian.credentials.table.config'
import TABLE_CONFIG_REQUEST_REFUND_PAYMENTS from './tableConfig/refundPayment.table.config'
import tableConfigFilings from './tableConfig/filing.table.config'
import cancelModalConfig from './tableConfig/cancelModal.config'

import { STATUS } from '../../constants/documents'
import { CERTIFICATES_FIREBASE_COLLECTION } from '../../constants/certificates'
import { MAX_LENGTH_PAYMENT_APPROVE_REF } from '../../constants/general'

const MAX_PERCENT_COUPON = 100
const taxYearAfterArareaImplementation = 2019

const { CREATED, PROCESSING } = STATUS
const { confirm } = Modal

const AssistantV2 = ({
  changeFilingActiveStatus,
  error,
  getAsistantUsers,
  assistantUsers,
  getAssistantPersons,
  assistantPersons,
  getAssistantFilingsByPerson,
  assistantFilingsByPerson,
  getAssistantDocumentsByFiling,
  assistantDocumentsByFiling,
  getAssistantEnginesByFiling,
  assistantEnginesByFiling,
  getAssistantPaymentsByFiling,
  assistantPaymentsByFiling,
  saveAssistantUser,
  assistantUserSaved,
  saveAssistantPerson,
  assistantPersonSaved,
  assistantLocalState,
  setAssistantLocalState,
  getAssistantFilingsByUser,
  assistantFilingsByUser,
  cancelFileUpload,
  cancelFileUploadStatus,
  getFirebaseDocumentStatus,
  changeUserPassword,
  changePasswordSuccessed,
  changePasswordLoading,
  changeFilingOrderAssistant,
  swapAccountFromAssistant,
  changeOrderStatus,
  getAssistantFillingByEmail,
  getAssistantDianCredentials,
  assistantDianCredentials,
  assistantRefundPayment,
  assistantRequestRefundPayments,
  getAssistantRequestRefundPayment,
  toggleVideocallException,
}) => {
  const [accountSwapValues, setAccountSwapValues] = useState({
    destEmail: '',
    destDoc: '',
  })

  const paymentRef = useRef()
  const paymentFormRef = useRef()
  const navigate = useNavigate()

  const { setCurrentFilingById, setCurrentFiling, personalInfo } =
    usePersonalInfo()
  const infoUser = useMemo(() => {
    const { is_staff: isStaff } = personalInfo || {}
    return isStaff ? { accessControl: { is_staff: isStaff } } : {}
  }, [personalInfo])

  const handleSubmit = async (values, searchUser) => {
    const { email, document_id } = values
    const param = email
      ? { email: email }
      : document_id
      ? { national_id: document_id }
      : {}
    const emailOrId = email || document_id || ''

    if (searchUser) searchByUser(emailOrId, param, email)
    else searchByFiling(emailOrId, param, email)
  }

  const {
    location,
    showUsers,
    showPersons,
    showFilings,
    showDocuments,
    showEngines,
    showPayments,
    showEditUser,
    showEditPerson,
    currentUser,
    currentPerson,
    currentOrder,
    currentFiling,
    searching,
    emailOrId,
    showingFilings,
    showFilingByUser,
    showChangePassword,
    showChangeFilingOrder,
    changeFillingOrderError,
    changeFillingOrderLoading,
    changeFillingOrderSuccessed,
    showAccountSwap,
    filingsByEmail,
    showPaymentRefund,
    assistantUsers: localAssistantUsers,
    showDianCredentials,
    messageErrorToShow,
    messageSuccessToShow,
    errorInRequest,
    showRequestRefundPayment,
  } = assistantLocalState

  const TABLE_CONFIG_USERS = DATA_TABLE_USER.filter((field) => {
    return field.key !== 'indicative'
  })

  const { getDoc } = useFirebaseCollection(CERTIFICATES_FIREBASE_COLLECTION)
  const SIZE_TRANSFORM = {
    large: 'lg',
    default: 'md',
    small: 'sm',
  }

  const searchByFiling = async (emailOrId, param, email) => {
    const localState = {
      location: '',
      showUsers: false,
      showPersons: false,
      showFilings: false,
      showEngines: false,
      showDocuments: false,
      showPayments: false,
      showDianCredentials: false,
      showFilingByUser: true,
      showRequestRefundPayment: false,
      emailOrId: {
        param: param,
        text: emailOrId,
        tag: email ? 'email' : 'documento',
      },
      searching: true,
      showingFilings: true,
      currentFiling: {},
    }
    getAssistantFilingsByUser({ ...param, version: 2 }, localState)
  }

  const searchByUser = async (emailOrId, param, email) => {
    const localState = {
      currentLocation: { location: 'users' },
      showUsers: true,
      showPersons: false,
      showFilings: false,
      showEngines: false,
      showDocuments: false,
      showPayments: false,
      showFilingByUser: false,
      showDianCredentials: false,
      showRequestRefundPayment: false,
      emailOrId: {
        param: param,
        text: emailOrId,
        tag: email ? 'email' : 'documento',
      },
      searching: true,
      showingFilings: false,
      currentFiling: {},
    }

    await getAsistantUsers(param, localState)
  }
  const handleShowPersons = useCallback(
    (user) => async () => {
      const localState = {
        showUsers: false,
        showPersons: true,
        showFilings: false,
        showDianCredentials: false,
        currentUser: user,
        currentLocation: { location: 'persons', goBack: false },
      }
      await getAssistantPersons(user.id, localState)
    },
    [getAssistantPersons]
  )

  const handleShowFilings = useCallback(
    (person) => async () => {
      const { showingFilings } = assistantLocalState

      const localState = {
        showPersons: false,
        showDianCredentials: false,
        showFilings: true,
        currentPerson: person,
        currentLocation: !showingFilings
          ? { location: 'filings', goBack: false }
          : {},
      }
      await getAssistantFilingsByPerson(person.id, localState)
    },
    [getAssistantFilingsByPerson]
  )

  const handleShowDocuments = useCallback(
    (filing) => async () => {
      const { id, tax_year } = filing
      const { showingFilings } = assistantLocalState

      const localState = {
        showFilings: false,
        showDocuments: true,
        currentFiling: filing,
        showFilingByUser: false,
        currentLocation: !showingFilings
          ? {
              location: 'engines',
              goBack: false,
              ag: `AG${tax_year}`,
              section: 'Documentos',
            }
          : {},
      }
      await getAssistantDocumentsByFiling(id, localState)
    },
    [getAssistantDocumentsByFiling]
  )

  const handleShowEngines = useCallback(
    (filing, index = -1) =>
      async () => {
        const { id, tax_year } = filing
        const { showingFilings } = assistantLocalState

        const localState = {
          showFilings: false,
          showEngines: true,
          showFilingByUser: false,
          currentFiling: filing,
          currentLocation: !showingFilings
            ? {
                location: 'engines',
                goBack: false,
                ag: `AG${tax_year}`,
                section: 'Motores',
              }
            : {},
        }

        if (index >= 0 && assistantFilingsByUser.length >= 1) {
          const currentPerson = assistantFilingsByUser[index]
          localState.currentPerson = currentPerson.person
        }

        await getAssistantEnginesByFiling(id, localState)
      },
    [getAssistantEnginesByFiling, assistantFilingsByUser]
  )

  const handleShowPayments = useCallback(
    (filing) => async () => {
      const { tax_year, id } = filing
      let params = (params = {
        filing_id: id,
      })

      const localState = {
        showFilings: false,
        showPayments: true,
        showFilingByUser: false,
        currentFiling: filing,
        currentLocation: {
          location: 'payments',
          goBack: false,
          ag: `AG${tax_year}`,
          section: 'Pagos',
        },
      }

      await getAssistantPaymentsByFiling(params, localState)
    },
    [getAssistantPaymentsByFiling]
  )

  const handleShowDianCredentials = useCallback(
    (filing) => async () => {
      const { tax_year, id } = filing

      const localState = {
        showFilings: false,
        showPayments: false,
        showFilingByUser: false,
        currentFiling: filing,
        showDianCredentials: true,
        currentLocation: {
          location: 'dian_credentials',
          goBack: false,
          ag: `AG${tax_year}`,
          section: 'Credenciales DIAN',
        },
      }

      await getAssistantDianCredentials(id, localState)
    },
    [getAssistantDianCredentials]
  )

  const handleShowPerson = (filing) => {
    const person = []
    person.push(filing.person)
    const localState = {
      showUsers: false,
      showPersons: true,
      showFilings: false,
      showFilingByUser: false,
      currentUser: filing.owner,
      showPersonsFromFiling: true,
      showingFilings: true,
      assistantPersons: person,
    }

    setAssistantLocalState(localState)
  }

  const handleShowUser = (filing) => {
    const user = []
    user.push(filing.owner)

    const localState = {
      currentLocation: {},
      showUsers: true,
      showPersons: false,
      showFilings: false,
      showEngines: false,
      showDocuments: false,
      showPayments: false,
      showFilingByUser: false,
      searching: true,
      assistantUsers: user,
      currentUser: filing.owner,
    }

    setAssistantLocalState(localState)
  }

  const handleEditUser = useCallback(
    (user) => () => {
      const [indicative, phone] = normalizePhone(user.phone || '')

      const localState = {
        currentUser: { ...user, phone, indicative },
        showEditUser: true,
      }
      setAssistantLocalState(localState)
    },
    [setAssistantLocalState]
  )

  const handleChangePassword = useCallback(
    (user) => () => {
      const localState = {
        currentUser: user,
        showChangePassword: true,
      }
      setAssistantLocalState(localState)
    },
    [setAssistantLocalState]
  )

  const handleChangeFilingOrderClose = useCallback(async () => {
    const localState = {
      showChangeFilingOrder: false,
    }
    let params = (params = {
      filing_id: currentFiling.id,
    })
    await getAssistantPaymentsByFiling(params, localState)
    setAssistantLocalState(localState)
  }, [setAssistantLocalState, getAssistantPaymentsByFiling, currentFiling])

  const handleChangeFilingOrder = useCallback(
    (order) => async () => {
      const localState = {
        currentOrder: order,
        showChangeFilingOrder: true,
        changeFillingOrderLoading: false,
      }
      const { currentUser } = assistantLocalState
      const { email } = currentUser
      const params = { version: 2, email: email }
      await getAssistantFillingByEmail(params, localState)
      setAssistantLocalState(localState)
    },
    [setAssistantLocalState, getAssistantFillingByEmail, assistantLocalState]
  )

  const handleCloseChangeFilingOrder = useCallback(() => {
    const localState = {
      showChangeFilingOrder: false,
    }
    setAssistantLocalState(localState)
  }, [setAssistantLocalState])

  const handleCloseEditUser = async () => {
    const { emailOrId, showingFilings } = assistantLocalState
    const { param } = emailOrId

    const localState = {
      showEditUser: false,
    }

    if (showingFilings) {
      param.version = 2
      await getAssistantFilingsByUser(param, localState)
    } else await getAsistantUsers(param, localState)
  }

  const handleEditPerson = useCallback(
    (person) => () => {
      const localState = {
        currentPerson: person,
        showEditPerson: true,
      }
      setAssistantLocalState(localState)
    },
    [setAssistantLocalState]
  )

  const handleCloseEditPerson = async () => {
    const { emailOrId, showingFilings } = assistantLocalState
    const { param } = emailOrId

    const localState = {
      showEditPerson: false,
    }

    if (showingFilings) {
      param.version = 2
      await getAssistantFilingsByUser(param, localState)
    } else await getAssistantPersons(currentUser.id, localState)
  }

  const handleClosePasswordChange = useCallback(() => {
    const localState = {
      showChangePassword: false,
    }
    setAssistantLocalState(localState)
  }, [setAssistantLocalState])

  const handleEditFiling = useCallback(
    (filing) => async () => {
      const localState = {
        currentFiling: filing,
      }
      setAssistantLocalState(localState)
      await setCurrentFilingById(filing.id, false, true)
      // this attribute is used for the header filingDetail
      sessionStorage.ownerEmail = filing.owner.email
      navigate(`/filings/${filing.id}/onboarding`)
    },
    [setAssistantLocalState, setCurrentFilingById, navigate]
  )

  const handleTransferOrder = useCallback(
    async (values) => {
      const data = {
        fillingId: values.fillingId,
        orderId: currentOrder.id,
      }
      await changeFilingOrderAssistant(data)
    },
    [changeFilingOrderAssistant, currentOrder, changeFillingOrderError]
  )

  const handleOnChange = useCallback(() => {
    const localState = {
      changeFillingOrderError: false,
    }
    setAssistantLocalState(localState)
  }, [setAssistantLocalState])

  useEffect(() => {
    if (changeFillingOrderSuccessed) {
      handleChangeFilingOrderClose()
    }
  }, [changeFillingOrderSuccessed, handleChangeFilingOrderClose])

  const handleShowAccountSwap = useCallback(
    (user) => () => {
      const localState = {
        currentUser: user,
        showAccountSwap: true,
      }
      setAssistantLocalState(localState)
      setAccountSwapValues({ dest_email: '', dest_doc: '' })
    },
    [setAssistantLocalState]
  )

  const handleCloseAccountSwap = useCallback(() => {
    const { emailOrId, showingFilings } = assistantLocalState
    const { param } = emailOrId

    const localState = {
      showAccountSwap: false,
    }

    if (showingFilings) {
      param.version = 2
      getAssistantFilingsByUser(param, localState)
    } else {
      getAsistantUsers(param, localState)
    }
  }, [assistantLocalState, setAssistantLocalState])

  const handleCloseRefundForm = useCallback(() => {
    const localState = {
      showPaymentRefund: false,
    }
    setAssistantLocalState(localState)
  }, [setAssistantLocalState])

  useEffect(() => {
    if (!!messageSuccessToShow && !errorInRequest) {
      message.success(messageSuccessToShow)
      const localState = {
        showPaymentRefund: false,
      }
      setAssistantLocalState(localState)
      Modal.destroyAll()
    } else if (!!messageErrorToShow && errorInRequest) {
      message.error(messageErrorToShow)
      const localState = {
        messageErrorToShow: '',
      }
      setAssistantLocalState(localState)
    }
  }, [messageErrorToShow, messageSuccessToShow, errorInRequest])

  useEffect(() => {
    const { messageStatusPayment } = assistantLocalState
    messageStatusPayment && !error && message.success(messageStatusPayment)
    messageStatusPayment && error && message.error(messageStatusPayment)
    messageStatusPayment && !error && Modal.destroyAll()
  }, [assistantLocalState.messageStatusPayment])

  useEffect(() => {
    const { updatePaymentOrderList } = assistantLocalState
    if (updatePaymentOrderList) {
      getAssistantPaymentsByFiling({ filing_id: currentFiling.id }, {})
      setAssistantLocalState({
        ...assistantLocalState,
        updatePaymentOrderList: false,
      })
    }
  }, [assistantLocalState.updatePaymentOrderList])

  const submitApprovePayment = (order) => {
    setAssistantLocalState({ messageStatusPayment: '' }, message)
    const referenceCode = paymentRef.current.state.value
    changeOrderStatus(order.id, PAYMENT_STATUS.APPROVED, {
      reference_code: referenceCode,
    })
  }

  const submitCancelPayment = (order) => {
    setAssistantLocalState({ messageStatusPayment: '' }, message)
    changeOrderStatus(order.id, PAYMENT_STATUS.CANCELLED)
  }

  const handleApprovePayment = (order) => () => {
    setAssistantLocalState({ messageStatusPayment: '' }, message)
    confirm({
      title: 'Aprobar pago',
      icon: <ExclamationCircleOutlined />,
      cancelText: 'Salir',
      okText: 'Aprobar',
      onOkButtonProps: { htmlType: 'submit', key: 'submit' },
      destroyOnClose: true,
      content: (
        <div>
          <Form
            autoComplete="off"
            ref={paymentFormRef}
            onFinish={() => submitApprovePayment(order)}
          >
            <Form.Item
              name="payment_ref"
              label="Referencia de pago (últimos 5 dígitos):"
              rules={[
                { required: true, message: 'Debe ingresar una referencia.' },
                {
                  type: 'string',
                  min: MAX_LENGTH_PAYMENT_APPROVE_REF,
                  max: MAX_LENGTH_PAYMENT_APPROVE_REF,
                  message: 'La referencia debe ser de 5 dígitos.',
                },
              ]}
            >
              <InputPaymentRef
                maxLength={MAX_LENGTH_PAYMENT_APPROVE_REF}
                ref={paymentRef}
                placeholder="Últimos 5 dígitos de la referencia de pago"
                size="large"
                addonAfter={
                  <a
                    href="images/ayuda-visual.png"
                    target="_blank"
                    alt="Ayuda visual"
                  >
                    ¿Dónde encontrarlos?
                  </a>
                }
              />
            </Form.Item>
          </Form>
          <p>
            Si confirmas, el estado quedará en <strong>approved</strong>.
          </p>
        </div>
      ),
      // Param _ to can handle the submit event
      onOk(_) {
        paymentFormRef.current.submit()
      },
    })
  }

  const handleRequestRefundPayment = (refundId) => async () => {
    const localState = {
      showRequestRefundPayment: true,
      showPayments: false,
      currentLocation: { location: 'refund', goBack: false },
    }
    getAssistantRequestRefundPayment(refundId, localState)
  }

  const handleRefundPayment = (order) => async () => {
    const localState = {
      showPaymentRefund: true,
      currentPaymentOrder: order,
    }
    setAssistantLocalState(localState)
  }

  const saveUser = async (values) => {
    const newValues = {
      ...values,
      phone: values.indicative.replace(' ', '') + values.phone,
    }

    await saveAssistantUser(currentUser.id, newValues)
  }

  const savePerson = async (values) => {
    await saveAssistantPerson(currentPerson.id, values)
  }

  const changePassword = useCallback(
    (values) => {
      changeUserPassword({
        email: currentUser.email,
        new_password: values.password,
      })
    },
    [changeUserPassword, currentUser]
  )

  const accountSwap = useCallback(
    (values) => {
      const { dest_doc: destDoc, dest_email: destEmail } = values
      setAccountSwapValues(values)
      function showConfirm() {
        confirm({
          title: 'Intercambiar cuenta',
          icon: <ExclamationCircleOutlined />,
          content: `Tenga en cuenta que se eliminará la información de filings y
                    personas que pueda existir en la cuenta destino. Es un proceso
                    que no se podrá revertir. ¿Está seguro de continuar?`,
          onOk() {
            const { id: originId } = assistantLocalState.currentUser // Origin user to swap the account
            swapAccountFromAssistant(
              {
                dest_doc: parseInt(destDoc),
                dest_email: destEmail,
                origin_id: originId,
              },
              { showAccountSwap: false }
            )
          },
        })
      }
      showConfirm()
    },
    [swapAccountFromAssistant, assistantLocalState]
  )

  const paymentRefund = useCallback(
    (values) => {
      setAssistantLocalState({ messageErrorToShow: '' }, message)
      const { currentPaymentOrder, currentFiling } = assistantLocalState || {}
      const { id: filingId } = currentFiling
      const { id } = currentPaymentOrder || ''
      assistantRefundPayment(id, values, filingId)
    },
    [assistantRefundPayment, assistantLocalState]
  )

  useEffect(() => {
    if (changePasswordSuccessed) {
      handleClosePasswordChange()
    }
  }, [changePasswordSuccessed, handleClosePasswordChange])

  const activeShowUsers = () => {
    const { showingFilings } = assistantLocalState
    const localState = {
      showUsers: !showingFilings,
      showFilingByUser: !!showingFilings,
      showPersons: false,
      currentLocation: showingFilings
        ? {}
        : { location: 'users', goBack: true },
    }
    setAssistantLocalState(localState)
  }

  const activeShowPersons = () => {
    const localState = {
      showPersons: true,
      showFilings: false,
      currentLocation: { location: 'persons', goBack: true },
    }
    setAssistantLocalState(localState)
  }

  const activeShowFilings = () => {
    const { currentPerson } = assistantLocalState
    const localState = {
      showFilings: !showingFilings,
      currentFiling: {},
      showDocuments: false,
      showEngines: false,
      showPayments: false,
      showDianCredentials: false,
      showFilingByUser: !!showingFilings,
      currentLocation: { location: 'filings', goBack: true },
    }
    getAssistantFilingsByPerson(currentPerson.id)
    setAssistantLocalState(localState)
  }

  const activeShowFilingsByUser = () => {
    const localState = {
      showFilingByUser: true,
      showUsers: false,
      showFilings: false,
      showDocuments: false,
      showEngines: false,
      showPayments: false,
    }
    setAssistantLocalState(localState)
  }

  const activeShowPayments = () => {
    const localState = {
      showRequestRefundPayment: false,
      showPayments: true,
      currentLocation: { location: 'payments', goBack: true },
    }
    setAssistantLocalState(localState)
  }

  const setLocationPersons = (goBack) => {
    const { emailOrId, location, currentUser } = assistantLocalState
    if (goBack) {
      const path = location.split('>')
      const localState = {
        location: `${path[0]} > Personas`,
      }
      setAssistantLocalState(localState)
    } else {
      const { first_name: name, last_name: last } = currentUser
      const path = `*Usuario:* ${name} ${last} (${emailOrId.text}) > Personas`
      const localState = {
        location: path,
      }
      setAssistantLocalState(localState)
    }
  }

  const clearLocation = () => {
    setAssistantLocalState({ location: '' })
  }

  const setLocationFilings = (goBack) => {
    const { currentPerson, location, emailOrId = {} } = assistantLocalState
    const { first_name: name, last_name: last, document_id } = currentPerson
    if (goBack) {
      const [path1, path2] = location.split(' > ')
      const localState = {
        location: [path1, path2, 'Declaraciones'].join(' > '),
      }
      setAssistantLocalState(localState)
    } else {
      let path = location.replace(
        'Personas',
        `*Persona:* ${name} ${last} (${document_id || ''}) > Declaraciones`
      )
      if (!path) {
        path = `*Usuario:* (${emailOrId.text}) > Personas > Declaraciones`
      }
      const localState = {
        location: path,
      }
      setAssistantLocalState(localState)
    }
  }

  const setLocationOthers = ({ ag, section }) => {
    const path = location.replace('Declaraciones', `${ag} > ${section}`)
    const localState = {
      location: path,
    }
    setAssistantLocalState(localState)
  }

  const setLocationRefund = (goBack) => {
    const path = goBack
      ? location.replace('Reembolsos', '')
      : `${location} >  Reembolsos`
    const localState = {
      location: path,
    }
    setAssistantLocalState(localState)
  }

  const { currentLocation } = assistantLocalState
  useEffect(() => {
    const { location, goBack } = currentLocation
    switch (location) {
      case 'users':
        const localState = {
          location: 'Usuarios',
        }
        setAssistantLocalState(localState)
        break
      case 'persons':
        setLocationPersons(goBack)
        break
      case 'filings':
        setLocationFilings(goBack)
        break
      case 'engines':
        setLocationOthers(currentLocation)
        break
      case 'payments':
        setLocationOthers(currentLocation)
      case 'dian_credentials':
        setLocationOthers(currentLocation)
        break
      case 'refund':
        setLocationRefund(goBack)
        if (Object.keys(currentLocation).length === 0) clearLocation()
    }
  }, [currentLocation])

  /**
   * handle effect when cancel file upload responses
   */
  useEffect(() => {
    if (cancelFileUploadStatus) {
      const { currentFiling } = assistantLocalState
      handleShowDocuments(currentFiling)()
      const { modalConfig, type } = cancelModalConfig[cancelFileUploadStatus]
      Modal[type](modalConfig)
    }
  }, [cancelFileUploadStatus])

  const handleCancelPayment = (order) => async () => {
    confirm({
      title: 'Cancelar pago',
      cancelText: 'No',
      okText: 'Si',
      onOkButtonProps: { htmlType: 'submit', key: 'submit' },
      icon: <ExclamationCircleOutlined />,
      content: (
        <Form
          autoComplete="off"
          ref={paymentFormRef}
          onFinish={() => submitCancelPayment(order)}
        >
          <p>¿Está seguro que desea cancelar este pago?</p>
          <p>
            Si confirmas, el estado quedará en <strong>cancelled</strong>.
          </p>
        </Form>
      ),
      // Param _ to can handle the submit event
      onOk(_) {
        paymentFormRef.current.submit()
      },
    })
  }

  const toggleFilingStatus = useCallback(
    (filing) => async () => {
      const { currentPerson, showingFilings, emailOrId } = assistantLocalState
      const { param } = emailOrId
      const { id: filingId, is_active: isActive } = filing
      await changeFilingActiveStatus(filingId, !isActive)

      if (showingFilings) {
        getAssistantFilingsByUser({ ...param, version: 2 }, {})
      } else {
        getAssistantFilingsByPerson(currentPerson.id)
      }
    },
    [changeFilingActiveStatus, assistantLocalState]
  )

  const columnConfigUsers = useMemo(() => {
    return [
      {
        title: 'Acciones',
        key: 'action',
        width: '150px',
        render: function userActions(user) {
          return (
            <ContainerButtons>
              <Button size="sm" onClick={handleEditUser(user)}>
                Editar
              </Button>
              <Button size="sm" onClick={handleChangePassword(user)}>
                Cambiar contraseña
              </Button>
              <Button size="sm" onClick={handleShowPersons(user)}>
                Ver personas
              </Button>
              {user.is_active && (
                <ActionContainer
                  action={ACTIONS.ACCOUNT_CHANGE}
                  permissions={infoUser.accessControl || infoUser}
                >
                  <Button size="sm" onClick={handleShowAccountSwap(user)}>
                    Intercambiar cuenta
                  </Button>
                </ActionContainer>
              )}
            </ContainerButtons>
          )
        },
      },
      ...TABLE_CONFIG_USERS,
    ]
  }, [handleEditUser, handleShowPersons])

  const columnConfigPersons = useMemo(() => {
    return [
      {
        title: 'Acción',
        key: 'action',
        width: '150px',
        render: function personActions(person) {
          return (
            <ContainerButtons>
              <Button size="sm" onClick={handleEditPerson(person)}>
                Editar
              </Button>
              <Button size="sm" onClick={handleShowFilings(person)}>
                Ver filings
              </Button>
            </ContainerButtons>
          )
        },
      },
      ...TABLE_CONFIG_PERSONS,
    ]
  }, [handleEditUser, handleShowPersons])

  const columnConfigFilings = useMemo(() => {
    return [
      {
        title: 'Acción',
        key: 'action',
        width: '150px',
        render: function filingActions(filing) {
          const { tax_year: taxYear } = filing
          if (!filing.is_active) {
            return (
              <>
                <span>Declaración eliminada</span>
                <ContainerButtons>
                  <ActionContainer
                    action={ACTIONS.ENABLE_TAX_FILE}
                    permissions={
                      infoUser.accessControl ? infoUser.accessControl : infoUser
                    }
                  >
                    <Button size="sm" onClick={toggleFilingStatus(filing)}>
                      Habilitar
                    </Button>
                  </ActionContainer>
                </ContainerButtons>
              </>
            )
          }

          return (
            <ContainerButtons>
              <Button size="sm" onClick={handleEditFiling(filing)}>
                Editar
              </Button>
              <ActionContainer
                action={ACTIONS.DISABLE_TAX_FILE}
                permissions={
                  infoUser.accessControl ? infoUser.accessControl : infoUser
                }
              >
                <Button size="sm" onClick={toggleFilingStatus(filing)}>
                  Deshabilitar
                </Button>
              </ActionContainer>

              <Button size="sm" onClick={handleShowDocuments(filing)}>
                Ver documentos
              </Button>
              <Button size="sm" onClick={handleShowEngines(filing)}>
                Ver motores
              </Button>
              <Button size="sm" onClick={handleShowPayments(filing)}>
                Ver pagos
              </Button>
              {
                // Just show aranea from aranea exists it
                parseInt(taxYear) >= taxYearAfterArareaImplementation && (
                  <Button size="sm" onClick={handleShowDianCredentials(filing)}>
                    Ver credenciales DIAN
                  </Button>
                )
              }
            </ContainerButtons>
          )
        },
      },
      ...tableConfigFilings({ toggleVideocallException }),
    ]
  }, [
    handleEditUser,
    toggleFilingStatus,
    handleShowDocuments,
    handleShowEngines,
    handleShowPayments,
  ])

  const columnConfigUsersByFiling = useMemo(() => {
    return [
      {
        title: 'Acciones',
        key: 'action',
        width: '150px',
        render: function userActions(user) {
          return (
            <ContainerButtons>
              <Button size="sm" onClick={handleEditUser(user)}>
                Editar
              </Button>
              {user.is_active && (
                <ActionContainer
                  action={ACTIONS.ACCOUNT_CHANGE}
                  permissions={infoUser.accessControl || infoUser}
                >
                  <Button size="sm" onClick={handleShowAccountSwap(user)}>
                    Intercambiar cuenta
                  </Button>
                </ActionContainer>
              )}
            </ContainerButtons>
          )
        },
      },
      ...TABLE_CONFIG_USERS,
    ]
  }, [handleEditUser, handleShowPersons])

  const columnConfigPersonByFiling = useMemo(() => {
    return [
      {
        title: 'Acción',
        key: 'action',
        width: '150px',
        render: function personActions(person) {
          return (
            <ContainerButtons>
              <Button size="sm" onClick={handleEditPerson(person)}>
                Editar
              </Button>
            </ContainerButtons>
          )
        },
      },
      ...TABLE_CONFIG_PERSONS,
    ]
  }, [handleEditUser, handleShowPersons])

  const columnConfigFilingsByUser = useMemo(() => {
    return [
      {
        title: 'Acción',
        key: 'action',
        width: '150px',
        render: function filingActions(filing, record, index) {
          if (!filing.is_active) {
            return (
              <>
                <span>Declaración eliminada</span>
                <ContainerButtons>
                  <ActionContainer
                    action={ACTIONS.ENABLE_TAX_FILE}
                    permissions={
                      infoUser.accessControl ? infoUser.accessControl : infoUser
                    }
                  >
                    <Button size="sm" onClick={toggleFilingStatus(filing)}>
                      Habilitar
                    </Button>
                  </ActionContainer>
                </ContainerButtons>
              </>
            )
          }

          return (
            <ContainerButtons>
              <Button size="sm" onClick={handleEditFiling(filing)}>
                Editar
              </Button>
              <ActionContainer
                action={ACTIONS.DISABLE_TAX_FILE}
                permissions={
                  infoUser.accessControl ? infoUser.accessControl : infoUser
                }
              >
                <Button size="sm" onClick={toggleFilingStatus(filing)}>
                  Deshabilitar
                </Button>
              </ActionContainer>
              <Button size="sm" onClick={handleShowDocuments(filing)}>
                Ver documentos
              </Button>
              <Button size="sm" onClick={handleShowEngines(filing, index)}>
                Ver motores
              </Button>
              <Button size="sm" onClick={handleShowPayments(filing)}>
                Ver pagos
              </Button>
              <Button size="sm" onClick={handleShowDianCredentials(filing)}>
                Ver credenciales DIAN
              </Button>
            </ContainerButtons>
          )
        },
      },
      {
        title: 'Dueño',
        key: 'duenio',
        width: '150px',
        render: function filingActions(filing) {
          return (
            <ContainerCell>
              <Button size="sm" onClick={() => handleShowUser(filing)}>
                Usuario
              </Button>
              <span>
                <strong>Email:</strong>
                {filing.owner.email}
              </span>
              <span>
                <strong>
                  {`${USER_DOCUMENT_TYPE[filing.owner.user_document_type]}: `}
                </strong>
                {filing.owner.national_id}
              </span>
              <Button size="sm" onClick={() => handleShowPerson(filing)}>
                Persona
              </Button>
              <span>
                <strong>Nombre:</strong>
                {filing.person.first_name}
              </span>
              <span>
                <strong>Apellidos:</strong>
                {filing.person.last_name}
              </span>
              <span>
                <strong>
                  {`${USER_DOCUMENT_TYPE[filing.person.user_document_type]}: `}
                </strong>
                {filing.person.document_id}
              </span>
            </ContainerCell>
          )
        },
      },
      ...tableConfigFilings({ toggleVideocallException }),
    ]
  }, [
    handleEditUser,
    toggleFilingStatus,
    handleShowDocuments,
    handleShowEngines,
    handleShowPayments,
  ])

  const columnConfigPayments = useMemo(() => {
    return [
      {
        title: 'Acción',
        key: 'action',
        width: '150px',
        render: function orderActions(order) {
          const { status, refund_id: refundId, amount } = order
          const { currentFiling } = assistantLocalState || {}
          const { product_plan: productPlan } = currentFiling || {}
          const { is_assisted: isAssisted, is_rush: isRush } = productPlan || {}
          const isPlanPro = isAssisted && isRush

          return (
            <ContainerButtons>
              <ActionContainer
                action={ACTIONS.PAYMENT_APPROVE}
                permissions={
                  infoUser.accessControl ? infoUser.accessControl : infoUser
                }
              >
                {parseInt(amount) > 0 &&
                  order.status === PAYMENT_STATUS.APPROVED &&
                  !isPlanPro && (
                    <Button size="sm" onClick={handleRefundPayment(order)}>
                      Reembolsar
                    </Button>
                  )}

                {order.status === PAYMENT_STATUS.CREATED && (
                  <Button size="sm" onClick={handleApprovePayment(order)}>
                    Aprobar
                  </Button>
                )}
                {order.status === PAYMENT_STATUS.APPROVED &&
                  order.coupon_percent === MAX_PERCENT_COUPON && (
                    <Button size="sm" onClick={handleCancelPayment(order)}>
                      Cancelar
                    </Button>
                  )}

                {!!refundId && (
                  <Button
                    size="sm"
                    onClick={handleRequestRefundPayment(refundId)}
                  >
                    Ver solicitud de reembolso
                  </Button>
                )}
                {order.status === PAYMENT_STATUS.APPROVED && (
                  <Button size="sm" onClick={handleChangeFilingOrder(order)}>
                    Transferir a otro filing
                  </Button>
                )}
              </ActionContainer>
            </ContainerButtons>
          )
        },
      },
      ...TABLE_CONFIG_PAYMENTS,
    ]
  }, [
    assistantPaymentsByFiling,
    handleApprovePayment,
    handleChangeFilingOrder,
    handleRequestRefundPayment,
    handleRefundPayment,
    infoUser,
  ])

  const configFormAccountSwap = useMemo(
    () => ({
      dest_email: accountSwapValues.destEmail,
      dest_doc: accountSwapValues.destDoc,
    }),
    [accountSwapValues]
  )

  const handleCancelUpload = useCallback(
    (userCertificateId) => () => {
      cancelFileUpload(userCertificateId)
    },
    [cancelFileUpload]
  )

  const handleShowFirebaseStatus = useCallback(
    (documentId) => () => {
      getFirebaseDocumentStatus(documentId, getDoc)
    },
    [getDoc, getFirebaseDocumentStatus]
  )

  const columnsConfigDocumentsByUser = useMemo(
    () => [
      {
        title: '',
        width: '50px',
      },
      {
        title: 'Acción',
        key: 'action',
        width: '150px',
        render: function documentActions(document) {
          const isDisabled = ![CREATED, PROCESSING].includes(document.status)
          const { id: documentId } = document
          return (
            <ContainerButtons>
              {!isDisabled && (
                <Button
                  size="sm"
                  onClick={handleCancelUpload(documentId)}
                  disabled={isDisabled}
                >
                  Cancelar carga
                </Button>
              )}
              <Button size="sm" onClick={handleShowFirebaseStatus(documentId)}>
                Consultar estado en navegador
              </Button>
            </ContainerButtons>
          )
        },
      },
      ...TABLE_CONFIG_DOCUMENTS,
    ],
    [handleCancelUpload, handleShowFirebaseStatus]
  )

  const renderDocuments = useMemo(() => {
    const currentData = []

    if (assistantDocumentsByFiling.length >= 1) {
      let currentCode = ''
      let currentIndex = 0
      let currentText = ''
      let currentEntity = ''

      assistantDocumentsByFiling.map((item, i) => {
        currentIndex = i
        if (
          currentCode === item.entity.group_code &&
          currentText === item.document_description.text &&
          currentEntity === item.entity.name
        ) {
          const lastIndex = currentData.length - 1

          if (currentData[lastIndex].children === undefined) {
            currentData[lastIndex].children = []
            currentData[lastIndex].expandable = true
          }
          // Search duplicated item
          const itemDuplicated = currentData[lastIndex].children.findIndex(
            (i) => i.id === item.id
          )
          if (itemDuplicated >= 0) {
            currentData[lastIndex].children.splice(
              itemDuplicated,
              itemDuplicated + 1
            )
          }
          currentData[lastIndex].children.push({ key: item.id, ...item })
        } else {
          currentData.push(item)
        }
        currentCode =
          currentCode !== item.entity.group_code
            ? item.entity.group_code
            : currentCode

        currentText =
          currentText !== item.document_description.text
            ? item.document_description.text
            : currentText

        currentEntity =
          currentEntity !== item.entity.name ? item.entity.name : currentEntity
      })
    }

    return (
      <DataTableExpandable>
        <DataTable
          title={'Documentos'}
          dataSource={currentData}
          columns={columnsConfigDocumentsByUser}
          handleGoBack={activeShowFilings}
          expandable={{
            expandIconColumnIndex: 0,
            expandIcon: ({ expanded, onExpand, record }) => {
              return (
                record.expandable &&
                (expanded ? (
                  <button
                    className="ant-table-row-expand-icon ant-table-row-expand-icon-expanded"
                    aria-label="Collapse row"
                    onClick={(e) => onExpand(record, e)}
                  />
                ) : (
                  <Tooltip title="Clic aquí para desplegar otros registros de carga de este documento.">
                    <button
                      type="button"
                      className="ant-table-row-expand-icon ant-table-row-expand-icon-collapsed"
                      aria-label="Expand row"
                      onClick={(e) => onExpand(record, e)}
                    />
                  </Tooltip>
                ))
              )
            },
          }}
        />
      </DataTableExpandable>
    )
  }, [assistantDocumentsByFiling])

  return (
    <Container className="container">
      <Content className="row center-xs">
        <div className="col-xs-12">
          <Card>
            <CardHeader>
              <Title>Vista de asistentes</Title>
            </CardHeader>
            <CardBody>
              <AssistantFilter onSubmit={handleSubmit} />
              {location && !showingFilings && (
                <LocationBar location={location} />
              )}
              <div>
                {showUsers && (
                  <DataTable
                    title={'Usuarios'}
                    dataSource={
                      showingFilings ? localAssistantUsers : assistantUsers
                    }
                    columns={
                      showingFilings
                        ? columnConfigUsersByFiling
                        : columnConfigUsers
                    }
                    showGoBack={!!showingFilings}
                    handleGoBack={activeShowFilingsByUser}
                  />
                )}
                {showPersons && (
                  <Fragment>
                    <DataTable
                      title={'Personas'}
                      dataSource={
                        assistantPersons.length > 0
                          ? assistantPersons
                          : assistantLocalState.assistantPersons
                      }
                      columns={
                        showingFilings
                          ? columnConfigPersonByFiling
                          : columnConfigPersons
                      }
                      handleGoBack={activeShowUsers}
                    />
                  </Fragment>
                )}
                {showFilings && (
                  <Fragment>
                    <DataTable
                      title={'Filings'}
                      dataSource={assistantFilingsByPerson}
                      columns={columnConfigFilings}
                      handleGoBack={activeShowPersons}
                    />
                  </Fragment>
                )}

                {showDocuments && <Fragment>{renderDocuments}</Fragment>}
                {showEngines && (
                  <Fragment>
                    <DataTable
                      title={'Motores'}
                      dataSource={assistantEnginesByFiling}
                      columns={TABLE_CONFIG_ENGINES}
                      handleGoBack={activeShowFilings}
                    />
                  </Fragment>
                )}
                {showPayments && (
                  <Fragment>
                    <DataTable
                      title={'Pagos'}
                      dataSource={assistantPaymentsByFiling}
                      columns={columnConfigPayments}
                      handleGoBack={activeShowFilings}
                    />
                  </Fragment>
                )}
                {showFilingByUser && (
                  <Fragment>
                    <DataTable
                      title={'Filings'}
                      dataSource={assistantFilingsByUser}
                      columns={columnConfigFilingsByUser}
                      showGoBack={false}
                    />
                  </Fragment>
                )}
                {showDianCredentials && (
                  <Fragment>
                    <DataTable
                      title="Credenciales DIAN"
                      dataSource={assistantDianCredentials}
                      columns={TABLE_CONFIG_DIAN_CREDENTIALS}
                      showGoBack
                      handleGoBack={activeShowFilings}
                    />
                  </Fragment>
                )}
                {showRequestRefundPayment && (
                  <Fragment>
                    <DataTable
                      title={'Reembolsos'}
                      dataSource={assistantRequestRefundPayments}
                      columns={TABLE_CONFIG_REQUEST_REFUND_PAYMENTS}
                      showGoBack
                      handleGoBack={activeShowPayments}
                    />
                  </Fragment>
                )}

                {error && <span>{typeof error === 'string' && error}</span>}
                {searching &&
                  assistantUsers.length === 0 &&
                  assistantFilingsByUser.length === 0 && (
                    <span>
                      No se encontró información del usuario por {emailOrId.tag}
                    </span>
                  )}
              </div>
            </CardBody>
            <Modal
              title={'Editar usuario'}
              visible={showEditUser}
              onCancel={handleCloseEditUser}
              footer={null}
            >
              <FormEdit
                data={currentUser}
                tableConfig={DATA_TABLE_USER}
                handleSubmit={saveUser}
                status={assistantUserSaved}
              />
            </Modal>

            <Modal
              title={'Editar persona'}
              visible={showEditPerson}
              onCancel={handleCloseEditPerson}
              footer={null}
            >
              <FormEdit
                data={currentPerson}
                tableConfig={(() => {
                  const tableConfig = TABLE_CONFIG_PERSONS
                  if (
                    assistantPersons.length >= 1 &&
                    Object.keys(currentPerson).length >= 1
                  ) {
                    if (assistantPersons[0].id === currentPerson.id)
                      tableConfig[4].toEdit = false
                    else tableConfig[4].toEdit = true
                  }
                  return tableConfig
                })()}
                handleSubmit={savePerson}
                status={assistantPersonSaved}
              />
            </Modal>
            <Modal
              destroyOnClose
              maskClosable={false}
              title="Cambiar contraseña"
              visible={showChangePassword}
              onCancel={handleClosePasswordChange}
              footer={null}
            >
              <FormRecoverPassword
                comparePassword={comparePassword}
                handleSubmit={changePassword}
                size="default"
                shouldConfirm
                showHeader={false}
                submitDisabled={changePasswordLoading}
              />
            </Modal>
            <Modal
              destroyOnClose
              title={'Transferir pago'}
              visible={showChangeFilingOrder}
              onCancel={handleCloseChangeFilingOrder}
              footer={null}
            >
              <FormFilingSelect
                submitDisabled={changeFillingOrderLoading}
                handleSubmit={handleTransferOrder}
                onChange={handleOnChange}
                currentFiling={currentFiling}
                currentOrder={currentOrder}
                error={changeFillingOrderError}
                options={filingsByEmail}
              />
            </Modal>
            <Modal
              title={'Intercambiar cuenta'}
              visible={showAccountSwap}
              onCancel={handleCloseAccountSwap}
              footer={null}
            >
              <p>Ingrese los datos de la cuenta de usuario destino.</p>
              <FormEdit
                data={configFormAccountSwap}
                tableConfig={TABLE_CONFIG_ACCOUNT_SWAP}
                handleSubmit={accountSwap}
                status={assistantUserSaved}
              />
            </Modal>
            <Modal
              destroyOnClose
              title="Reembolsar pago"
              visible={showPaymentRefund}
              onCancel={handleCloseRefundForm}
              footer={null}
            >
              <PaymentRefundForm
                handleCancel={handleCloseRefundForm}
                handleSubmit={paymentRefund}
              />
            </Modal>
          </Card>
        </div>
      </Content>
    </Container>
  )
}

AssistantV2.propTypes = {
  changeFilingActiveStatus: PropTypes.any,
  error: PropTypes.any,
  getAsistantUsers: PropTypes.func.isRequired,
  assistantUsers: PropTypes.any,
  getAssistantPersons: PropTypes.func.isRequired,
  assistantPersons: PropTypes.any,
  getAssistantFilingsByPerson: PropTypes.func.isRequired,
  assistantFilingsByPerson: PropTypes.any,
  getAssistantDocumentsByFiling: PropTypes.func.isRequired,
  assistantDocumentsByFiling: PropTypes.any,
  getAssistantEnginesByFiling: PropTypes.func.isRequired,
  assistantEnginesByFiling: PropTypes.any,
  getAssistantPaymentsByFiling: PropTypes.func.isRequired,
  assistantPaymentsByFiling: PropTypes.any,
  saveAssistantUser: PropTypes.func.isRequired,
  assistantUserSaved: PropTypes.any,
  saveAssistantPerson: PropTypes.func.isRequired,
  assistantPersonSaved: PropTypes.any,
  getFillingState: PropTypes.func.isRequired,
  fillingState: PropTypes.any,
  assistantLocalState: PropTypes.any,
  setAssistantLocalState: PropTypes.func.isRequired,
  getAssistantFilingsByUser: PropTypes.func.isRequired,
  assistantFilingsByUser: PropTypes.any,
  cancelFileUpload: PropTypes.func.isRequired,
  cancelFileUploadStatus: PropTypes.string,
  getFirebaseDocumentStatus: PropTypes.func.isRequired,
  changeUserPassword: PropTypes.func.isRequired,
  changePasswordSuccessed: PropTypes.bool,
  changePasswordLoading: PropTypes.bool,
  getAssistantFilling: PropTypes.func.isRequired,
  changeFilingOrderAssistant: PropTypes.func.isRequired,
  getAssistantFillingByEmail: PropTypes.func.isRequired,
  getAssistantDianCredentials: PropTypes.func,
  assistantDianCredentials: PropTypes.any,
}

AssistantV2.defaultProps = {
  documents: null,
  documentsError: null,
  error: null,
  filingActiveStatusError: null,
  assistantUsers: [],
  assistantPersons: [],
  assistantFilingsByPerson: [],
  assistantDocumentsByFiling: [],
  assistantEnginesByFiling: [],
  assistantPaymentsByFiling: [],
  assistantUserSaved: {},
  assistantPersonSaved: {},
  assistantFilingsByUser: [],
  cancelFileUploadStatus: null,
  changePasswordSuccessed: false,
  changePasswordLoading: false,
  assistantDianCredentials: [],
}

export default AssistantV2
