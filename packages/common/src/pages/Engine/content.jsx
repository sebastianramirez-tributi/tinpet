import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import moment from 'moment'
import 'moment/locale/es'
import Steps from 'antd/lib/steps'
import { CopyOutlined, LoadingOutlined } from '@ant-design/icons'
import message from 'antd/lib/message'
import { stringFormat } from '@tributi-co/core-fe'

import { checkRedirect } from '../../helpers/redirect-user'
import { Card, CardBody } from '../../components/Card'
import ImageSupervised from '../../components/ImageSupervised'
import {
  ENGINE_STATUS,
  ENGINE_STATUS_ASSISTANT,
  ENGINE_REPORT_STATUS_ASSISTANT,
  ENGINE_STATUS_ROLES,
} from '../../constants/engine'
import {
  Container,
  Title,
  ContainerSteps,
  ContainerText,
  StyledButton,
  Text,
  Header,
  ImageCalendar,
  ContainerEngine,
  StepsC,
  ClipboardDek,
  CopyClipboardBtn,
} from './style'
import { PLANS, FILING_STATUS } from '../../constants/filings'
import { ROLES } from '../../constants/person'
import { captureSentryException } from '../../sentry'

const { DEPRECATED, CANCELLED, VALID, INVALID, ERROR, NEW } = ENGINE_STATUS
const { BEING_PROCESSED, PROCESSED, SUMMARY } = FILING_STATUS

const Step = Steps.Step
const DELAY = 10 * 1000
moment.locale('es')

class Engine extends Component {
  constructor(props) {
    super(props)
    this.state = {
      invalidTaxEngine: false,
      // this state will handle redirection to next step
      redirect: null,
      status: null,
      reportStatus: null,
      author_role: '',
      taskId: '',
    }
    this.unsubscribeFB = () => {}
    this.retryDeclaration = this.retryDeclaration.bind(this)
  }

  componentDidMount() {
    const { updateStatusFilling, personalInfo, navigate } = this.props
    const { currentFiling } = personalInfo
    if (!currentFiling) {
      // This is a workarround since activeRef from useNavigate is not enable until the component is being properly render. So we need to defer this action util that is ready.
      setTimeout(() => {
        navigate(checkRedirect(null), { replace: true })
      }, 0)
    } else if (currentFiling?.id) {
      this.pollEngine()
      const { currentOwner } = sessionStorage
      updateStatusFilling(BEING_PROCESSED, currentFiling.id, currentOwner)
    } else {
      // This is a workarround since activeRef from useNavigate is not enable until the component is being properly render. So we need to defer this action util that is ready.
      setTimeout(() => {
        navigate('/filings', { replace: true })
      }, 0)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      updateStatusFilling,
      tax_engine_info: { id: taxEngineId },
      personalInfo,
    } = this.props
    const { currentFiling, role } = personalInfo

    const {
      tax_engine_info: { id: prevTaxEngineId },
    } = prevProps

    const { status: prevStatus, reportStatus: prevReportStatus } = prevState
    const { status, reportStatus } = this.state
    // Verify if the status has changed
    const hasStatusChanged = status !== prevStatus
    const hasReportStatusChanged = prevReportStatus !== reportStatus
    const hasEngineIdChanged =
      prevTaxEngineId && taxEngineId !== prevTaxEngineId
    if (hasEngineIdChanged) {
      this.renewPollEngine()
    }
    if (hasStatusChanged || hasReportStatusChanged) {
      const { payment_status: paymentStatus } = currentFiling
      const isIntruder =
        paymentStatus !== 'approved' && role === ROLES.TAX_FILER
      if ([INVALID, ERROR].includes(status) || reportStatus === ERROR) {
        this.checkFiling(true)
      } else if (status === VALID && reportStatus === VALID && !isIntruder) {
        const { currentOwner } = sessionStorage
        updateStatusFilling(PROCESSED, currentFiling.id, currentOwner)
        this.setState({ redirect: '/payment/success' })
      } else if ([DEPRECATED, CANCELLED].includes(status)) {
        // Add this timeout since when we implement firebase the filing is not getting
        // updated engine since when an engine is cancelled with firebase automatically
        // the front end receives the cancel and the new engine is not created yet, so the
        // delay is to wait the new engine is created.
        setTimeout(() => this.handleNewEngine(currentFiling.id), DELAY)
      }
    }
  }

  /**
   * This function is only called when an engines is either `cancelled` or `deprecated`
   * status
   * @param {String} filingId filing to be retrieved
   */
  async handleNewEngine(filingId) {
    const {
      tax_engine_info: { id: taxEngineId },
      getFillingState,
      updateTaxEngineId,
    } = this.props
    this.unsubscribeFB()
    const filing = await getFillingState(filingId)
    const { last_engine_id: lastEngineId } = filing || {}
    // Check filling, if last_engine_id it's the same redirect to summary
    // otherwise renew polling, make sure in assistant view we refresh engine_id values
    if (!lastEngineId || lastEngineId === taxEngineId) {
      this.checkFiling(true)
    } else {
      updateTaxEngineId(lastEngineId)
    }
  }

  componentWillUnmount() {
    // prevent clean up the engine if there is a redirection, it means,
    // user waits until the engine is fulfilled and is getting in download page.
    if (!this.state.redirect) {
      this.props.clearEngineStatus()
    }
    this.unsubscribeFB()
  }

  getdateObject(minutesSince) {
    let statusDate = []
    if (!minutesSince || minutesSince < 4) {
      statusDate = ['finish', 'process', 'wait', 'wait', 'wait', 'wait']
    } else if (minutesSince < 180) {
      statusDate = ['finish', 'finish', 'process', 'wait', 'wait', 'wait']
    } else {
      statusDate = ['finish', 'finish', 'finish', 'process', 'wait', 'wait']
    }
    return statusDate
  }

  retryDeclaration(e) {
    e.preventDefault()
    this.checkFiling(true)
  }

  validate(taxEngineStatus, status = VALID) {
    return taxEngineStatus && taxEngineStatus.status === status
  }

  /*
   * {Function} checkFiling
   * This function update the status of the filing to summary in case we need to
   * go back to summary again
   * @param {Boolean} isBackwards `true` if this is called by a function to intented
   * goBack to edit the filing, `false` if is from polling fail setup
   */
  async checkFiling(isBackwards) {
    const { updateStatusFilling, navigate, personalInfo } = this.props
    const { currentFiling } = personalInfo
    try {
      await updateStatusFilling(SUMMARY, currentFiling.id)
      // we use replace in order to clear all trace the filing was here and prevent
      // errors when dealing with sessioned filings
      navigate(`/filings/${currentFiling.id}/onboarding`, { replace: true })
    } catch (error) {
      if (!error.response && isBackwards) {
        message.error(translate('filingStatus.engine.error'))
      }
    }
  }

  renewPollEngine() {
    const { tax_engine_status: taxEngineStatus } = this.props
    if (!this.validate(taxEngineStatus)) {
      this.computedTaxes()
    }
  }

  async pollEngine() {
    const { currentOwner } = sessionStorage
    const {
      tax_engine_status: taxEngineStatus,
      computedTaxes,
      personalInfo,
    } = this.props
    const { currentFiling } = personalInfo
    if (!this.validate(taxEngineStatus) && currentFiling) {
      const success = await computedTaxes({
        filling: currentFiling.id,
        ownerId: currentOwner,
      })
      if (success) {
        this.computedTaxes()
      } else {
        // if computed taxes has an unexpected error redirect to onboarding
        this.checkFiling()
      }
    }
  }

  computedTaxes() {
    const {
      subscribe,
      tax_engine_info: { id: taxEngineId },
    } = this.props
    if (taxEngineId) {
      this.unsubscribeFB = subscribe(
        taxEngineId,
        (data) => {
          if (!data) return
          const {
            status,
            report_status: reportStatus,
            author_role: authorRole,
            task_id: taskId,
          } = data
          this.setState({ status, reportStatus, authorRole, taskId })
        },
        (error) => {
          captureSentryException(error)
        }
      )
    }
  }

  copyText(evt) {
    window.navigator.clipboard.writeText(
      evt.currentTarget.getAttribute('value')
    )
  }

  // addWeekdays function was deleted since is not longer used, however it might be restored
  // if we use the estimated date again, by the moment we get rid of that.

  render() {
    const { personalInfo, isAccountantApp } = this.props
    const engineSteps = translate('filingStatus.engine.steps').split('|')
    const { currentFiling, role } = personalInfo
    const { product_plan: productPlan, delivery_init_date: deliveryInitDate } =
      currentFiling || {}
    const { name: planName } = productPlan || {}
    const minutesSince = moment().diff(deliveryInitDate, 'minutes')
    const statusList = this.getdateObject(minutesSince)
    const { tax_engine_info: taxEngineInfo } = this.props
    const { redirect, status, reportStatus, authorRole, taskId } = this.state
    // We need to preserve both props at the time since the services that retrieve
    // that information are being used in another components and in order to avoid
    // refactors in other components.
    const assistantEngineInfo = {
      status: status || taxEngineInfo.status,
      reportStatus: reportStatus || taxEngineInfo.report_status,
      id: taxEngineInfo.id,
      authorRole: authorRole || taxEngineInfo.author_role,
      taskId:
        (taskId && taskId.split`/`.pop()) ||
        (taxEngineInfo.task_id && taxEngineInfo.task_id.split`/`.pop()),
    }
    const expectedDeadline = planName === PLANS.EXPRESS ? '2' : '48'
    if (redirect) {
      return <Navigate replace to={redirect} />
    }
    return (
      <div className="container" data-testid="container">
        <Container className="row center-xs">
          <div className="col-xs-12 col-md-10 col-lg-12">
            <Card>
              <CardBody>
                <Header className="row">
                  <ContainerText className="col-xs-12 col-lg-6">
                    <Title>{translate('filingStatus.engine.title')}</Title>
                    <ContainerEngine>
                      {[ROLES.TAX_FILER, ROLES.TAX_ADVISOR].includes(role) ||
                      isAccountantApp ? (
                        <Fragment>
                          <ImageCalendar src={'/images/calendario.svg'} />
                          <Text
                            data-testid="container-text"
                            dangerouslySetInnerHTML={{
                              __html: stringFormat(
                                translate('filingStatus.engine.text'),
                                { expectedDeadline }
                              ),
                            }}
                          />
                        </Fragment>
                      ) : (
                        <Fragment>
                          <Text>
                            <strong>{'Status:'}</strong>{' '}
                            {
                              ENGINE_STATUS_ASSISTANT[
                                assistantEngineInfo.status || NEW
                              ]
                            }
                          </Text>
                          <Text>
                            <strong>{'Report status:'}</strong>{' '}
                            {
                              ENGINE_REPORT_STATUS_ASSISTANT[
                                assistantEngineInfo.reportStatus || NEW
                              ]
                            }
                          </Text>
                          <Text>
                            <strong>{'Filing: '}</strong>
                            <ClipboardDek>{currentFiling.id}</ClipboardDek>
                            <CopyClipboardBtn
                              value={currentFiling.id}
                              aria-label="Copiar Filing Id"
                              onClick={this.copyText}
                              data-testid="copy-clip-board-btn"
                            >
                              <CopyOutlined />
                            </CopyClipboardBtn>
                          </Text>
                          <Text>
                            <strong>{'Engine: '}</strong>
                            <ClipboardDek>
                              {assistantEngineInfo.id}
                            </ClipboardDek>
                            <CopyClipboardBtn
                              value={assistantEngineInfo.id}
                              aria-label="Copiar Engine Id"
                              onClick={this.copyText}
                              data-testid="copy-clip-board-btn"
                            >
                              <CopyOutlined />
                            </CopyClipboardBtn>
                          </Text>
                          {assistantEngineInfo.taskId && (
                            <Text>
                              <strong>{'Task: '}</strong>
                              <ClipboardDek>
                                {assistantEngineInfo.taskId}
                              </ClipboardDek>
                              <CopyClipboardBtn
                                value={assistantEngineInfo.taskId}
                                aria-label="Copiar Task Id"
                                onClick={this.copyText}
                                data-testid="copy-clip-board-btn"
                              >
                                <CopyOutlined />
                              </CopyClipboardBtn>
                            </Text>
                          )}
                          {assistantEngineInfo.authorRole && (
                            <Text>
                              <strong>{'Author: '}</strong>
                              {
                                ENGINE_STATUS_ROLES[
                                  assistantEngineInfo.authorRole
                                ]
                              }
                            </Text>
                          )}
                          <Text>
                            {translate('filingStatus.engine.realLoad')}
                          </Text>
                        </Fragment>
                      )}
                    </ContainerEngine>
                  </ContainerText>
                </Header>
                <ContainerSteps>
                  <Text>{translate('filingStatus.engine.subtitleSteps')}</Text>
                  <StepsC>
                    {statusList.map((status, index) => (
                      <Step
                        key={engineSteps[index]}
                        status={status}
                        title={engineSteps[index]}
                        icon={status === 'process' && <LoadingOutlined />}
                      />
                    ))}
                  </StepsC>
                </ContainerSteps>
                <div className="row center-xs">
                  <StyledButton
                    fullWidth
                    onClick={this.retryDeclaration}
                    size="lg"
                    variant="outlined"
                    data-testid="cancel-btn"
                  >
                    {translate('filingStatus.engine.buttonCancel')}
                  </StyledButton>
                </div>
              </CardBody>
            </Card>
          </div>
          <ImageSupervised />
        </Container>
      </div>
    )
  }
}

Engine.propTypes = {
  clearEngineStatus: PropTypes.func.isRequired,
  computedTaxes: PropTypes.func.isRequired,
  filingState: PropTypes.shape({
    last_valid_engine: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  getFillingState: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  tax_engine: PropTypes.func.isRequired,
  tax_engine_info: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
    author_role: PropTypes.string,
    task_id: PropTypes.string,
  }),
  updateStatusFilling: PropTypes.func.isRequired,
  updateTaxEngineId: PropTypes.func.isRequired,
  personalInfo: PropTypes.shape({
    role: PropTypes.string,
    currentFiling: PropTypes.shape({
      id: PropTypes.string,
      payment_status: PropTypes.any,
      product_plan: PropTypes.shape({
        name: PropTypes.string,
      }),
      delivery_init_date: PropTypes.string,
    }),
  }).isRequired,
  setCurrentFiling: PropTypes.func.isRequired,
  isAccountantApp: PropTypes.bool,
}

Engine.defaultProps = {
  isAccountantApp: false,
}

export default Engine
