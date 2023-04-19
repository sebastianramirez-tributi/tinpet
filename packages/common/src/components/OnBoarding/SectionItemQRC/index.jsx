import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { QuestionCircleOutlined, ToolOutlined } from '@ant-design/icons'
import Modal from 'antd/lib/modal'

import {
  removeItemFromArray,
  isBelvoEnabled,
} from '../../../helpers/collections'
import withPersonalInfo from '../../../HOC/withPersonalInfo'
import QRCContainer from '../QRCContainer'
import SectionTitle from '../SectionTitle'
import BelvoSectionItem from '../BelvoSectionItem'

import {
  ButtonsContainer,
  CancelButton,
  Container,
  InlineIcon,
  StyledButton,
} from './styles'
import { STATUS } from '../../../constants/onboarding'

const INITIAL_STATE = {
  hasError: false,
  bulkError: false,
  newItem: false,
  activeKey: 0,
  disabledAdd: false,
  questionsbyGroup: [],
  answerOnboardingGroup: [],
  loading: false,
  counter: 0,
  showQuestions: false,
  belvoUnstarted: false,
  isBelvoConnected: false,
  hasPartialInstances: false,
}

class SectionItemQRC extends Component {
  qrcRef
  lastAnswersKeys
  constructor(props) {
    super(props)

    this.state = INITIAL_STATE
    this.lastAnswersKeys = []
    this.setRefQRC = this.setRefQRC.bind(this)
    this.addCollapse = this.addCollapse.bind(this)
    this.changeActiveKey = this.changeActiveKey.bind(this)
    this.removeInstance = this.removeInstance.bind(this)
    this.onClose = this.onClose.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  UNSAFE_componentWillMount() {
    this.setAnswers()
  }

  componentDidMount() {
    this.setState({ showQuestions: !this.props.data.is_belvo })
  }

  componentDidUpdate(prevProps) {
    const { data, answerOnboardingGroup } = this.props
    if (prevProps.data !== data) {
      this.setAnswers()
    }
    if (
      prevProps.answerOnboardingGroup.length !== answerOnboardingGroup.length
    ) {
      const hasPartialInstances = answerOnboardingGroup.some(
        ({ status }) => status === STATUS.PARTIAL
      )
      this.setState({ hasPartialInstances })
    }
  }

  componentWillUnmount() {
    this.setState(INITIAL_STATE)
  }

  handleShowQuestions = (show) => {
    this.setState({
      showQuestions: show,
    })
  }

  handleBelvoConnected = (isConnected) => {
    this.setState({
      isBelvoConnected: isConnected,
    })
  }

  handleBelvoLoading = (isLoading) => {
    this.setState({
      isBelvoLoading: isLoading,
    })
  }

  async setAnswers() {
    const {
      data,
      getCurrentAnswerByCode,
      fillingId,
      getQuestionsByGroup2,
      personalInfo,
    } = this.props
    const { currentFiling } = personalInfo
    this.setState({ loading: true })
    await getQuestionsByGroup2({
      code_group: data.code,
      fillingInfo: currentFiling,
    })
    await getCurrentAnswerByCode({ code: data.code, fillingId })
    const { answerOnboardingGroup: answers, questionsbyGroup } = this.props
    const arrayLength = answers.length > 0 ? answers.length : 1
    const arrayCollapse = Array.from(
      { length: arrayLength },
      (_, index) => answers[index]
    )
    const questions = questionsbyGroup.map((item) => {
      if (item.type === 'multichoice' || item.type === 'singlechoice') {
        item.values = item.values.filter((choice) => choice.is_onboarding)
      }
      return item
    })

    this.setState({
      questionsbyGroup: questions,
      answerOnboardingGroup: arrayCollapse,
      loading: false,
      disabledAdd: arrayCollapse.length >= data.instances_limit,
    })
  }

  async changeActiveKey(evt, index) {
    const { activeKey, counter } = this.state
    const {
      hasPendingInformation,
      bulkAnswers,
      hasChanges: hasChangesFromValidation,
    } = await this.qrcRef.current.submit(evt)
    if (!hasPendingInformation) {
      const { hasChanges: hasChangesFromPrevious } =
        this.lastAnswersKeys[activeKey] || {}
      this.lastAnswersKeys[activeKey] = {
        bulkAnswers,
        hasChanges: hasChangesFromValidation || hasChangesFromPrevious,
      }
      this.setState({ activeKey: index, counter: counter + 1 })
    }
  }

  getSubmitEventQRC = async (evt) => {
    evt.persist()
    window.scrollTo(0, 0)
    const { answerOnboardingGroup, activeKey } = this.state
    const {
      data,
      bulkSaveAnswers,
      fillingId,
      getSummarySura,
      saveSuraBtn,
      onSetNextButton,
      personalInfo,
    } = this.props
    const { currentFiling, role } = personalInfo
    const isSuraShouldDeclare = currentFiling.kind === 'SDSURA'

    // When saving we need to pass the appropriate instance_id to the bulkSaveAnswers (rather than guesing it from QRC bulkAnswers)
    // The component who contains QRC is the one who knows about New/Edit action and the corresponding instance_id
    const {
      isValid,
      bulkAnswers,
      hasChanges: hasChangesFromValidation,
    } = await this.isValidQuestions(evt)
    if (isValid) {
      const { hasChanges: hasChangesFromPrevious } =
        this.lastAnswersKeys[activeKey] || {}
      this.lastAnswersKeys[activeKey] = {
        bulkAnswers,
        hasChanges: hasChangesFromValidation || hasChangesFromPrevious,
      }
      for (const index in this.lastAnswersKeys) {
        const { bulkAnswers: answers, hasChanges } = this.lastAnswersKeys[index]
        const instanceId =
          answerOnboardingGroup[index] &&
          answerOnboardingGroup[index].instance_id
        if (hasChanges) {
          await bulkSaveAnswers(answers, {
            code: data.code,
            fillingId,
            instance_id: instanceId,
            role,
          })
        }
      }

      if (isSuraShouldDeclare) {
        saveSuraBtn()
        await getSummarySura(currentFiling.id)
      }
      this.onClose()
      onSetNextButton(true)
    }
  }

  async isValidQuestions(evt) {
    let isValid = true
    const item = this.qrcRef.current
    if (!item) {
      return { isValid: false }
    }
    const { hasPendingInformation, bulkAnswers, hasChanges } =
      await item.submit(evt)
    if (hasPendingInformation) {
      isValid = false
    }
    return { isValid, bulkAnswers, hasChanges }
  }

  removeInstance = (instanceAnswers, index) => (e) => {
    e.stopPropagation()
    const { data, fillingId, deleteInstanceQuestion } = this.props

    Modal.confirm({
      title: 'Eliminar Elemento',
      content: '¿Estás seguro que deseas eliminar este elemento?',
      icon: <QuestionCircleOutlined />,
      okText: 'Si',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        let remove = false
        if (instanceAnswers) {
          const { instance_id: instanceId } = instanceAnswers
          remove = await deleteInstanceQuestion({
            code: data.code,
            instance_id: instanceId,
            fillingId,
            groupCode: instanceAnswers.tax_inputs[0].group_code,
          })
          if (remove) {
            this.removeItem(index)
          }
        } else {
          this.removeItem(index)
        }
      },
    })
  }

  async removeItem(index) {
    const { answerOnboardingGroup, counter } = this.state
    const instances = removeItemFromArray(answerOnboardingGroup, index)
    this.lastAnswersKeys = removeItemFromArray(this.lastAnswersKeys, index)

    const newKey = instances.length - 1

    if (newKey === -1) {
      this.onClose()
    } else {
      await this.setState({
        activeKey: newKey,
        disabledAdd: false,
        answerOnboardingGroup: instances,
        counter: counter + 1,
      })
    }
  }

  async addCollapse(evt) {
    evt.persist()
    const { activeKey, answerOnboardingGroup, counter } = this.state
    const { data } = this.props

    const {
      isValid,
      bulkAnswers,
      hasChanges: hasChangesFromValidation,
    } = await this.isValidQuestions(evt)

    if (isValid) {
      const { hasChanges: hasChangesFromPrevious } =
        this.lastAnswersKeys[activeKey] || {}
      this.lastAnswersKeys[activeKey] = {
        bulkAnswers,
        hasChanges: hasChangesFromValidation || hasChangesFromPrevious,
      }

      if (answerOnboardingGroup.length < data.instances_limit) {
        this.setState({
          activeKey: answerOnboardingGroup.length,
          answerOnboardingGroup: [...answerOnboardingGroup, undefined],
          counter: counter + 1,
          disabledAdd:
            answerOnboardingGroup.length === data.instances_limit - 1,
        })
      } else {
        this.setState({ disabledAdd: true })
        this.notificationMsg.bind()
      }
    }
  }

  notificationMsg = () => {
    // const { options, initialGroupQuestion } = this.props
    // NotificationAntd({
    //   key: 1,
    //   type: 'info',
    //   duration: 3,
    //   message: '¡Límite de preguntas!',
    //   placement: 'topRight',
    //   description: `Has llegado al límite de ${options.optionsSelected[initialGroupQuestion].instances_limit} preguntas.`
    // });
  }

  handleClose() {
    if (this.state.hasPartialInstances) {
      Modal.warning({
        title: 'Tienes preguntas por responder',
        content: (
          <Fragment>
            <p>{translate('filings.onboarding.partialMessageTop')}</p>
            <br />
            <p>{translate('filings.onboarding.partialMessageBottom')}</p>
          </Fragment>
        ),
        onOk: (close) => {
          this.onClose()
          close()
        },
      })
    } else {
      this.onClose()
    }
  }

  async onClose() {
    const { resetQRC, getSectionInfo } = this.props
    const { isBelvoLoading } = this.state
    if (isBelvoLoading) return
    await this.setState({ ...INITIAL_STATE, loading: false })
    getSectionInfo()
    resetQRC()
  }

  setRefQRC = (ref) => {
    if (ref) {
      this.qrcRef = ref
    }
  }

  handleCleanBelvo = () => {
    this.setAnswers()
  }

  render() {
    const {
      data,
      answersRender,
      iconsPath,
      answerOnboardingGroup: originalAnswerOnboardingGroup,
      hasMigratedAnswers,
    } = this.props
    const {
      activeKey,
      answerOnboardingGroup,
      questionsbyGroup,
      disabledAdd,
      counter,
      showQuestions,
      isBelvoConnected,
      isBelvoLoading,
      hasPartialInstances,
    } = this.state

    const { is_belvo: showBelvo } = data
    const belvoEnabled = isBelvoEnabled()
    const belvoEnabledForGroup = belvoEnabled && showBelvo
    const shouldShowQuestions =
      !hasMigratedAnswers ||
      showQuestions ||
      !belvoEnabled ||
      (originalAnswerOnboardingGroup.length > 0 && !isBelvoConnected)

    return (
      <>
        {belvoEnabledForGroup ? (
          <BelvoSectionItem
            groupId={data.id}
            title={data.text}
            toggleQuestionsVisibility={this.handleShowQuestions}
            markBelvoAsUnstarted={this.handleCleanBelvo}
            setBelvoLoading={this.handleBelvoLoading}
            setBelvoConnected={this.handleBelvoConnected}
          />
        ) : (
          <SectionTitle
            title={data.text}
            subtitle={
              !hasPartialInstances ? (
                translate('filings.onboarding.section.objectSubtitle')
              ) : (
                <Fragment>
                  <InlineIcon as={ToolOutlined} />
                  <span>
                    {translate(
                      'filings.onboarding.section.objectSubtitlePartial'
                    )}
                  </span>
                </Fragment>
              )
            }
          />
        )}
        {belvoEnabledForGroup && shouldShowQuestions && (
          <SectionTitle
            title="Responde las preguntas"
            subtitle="Ahora por favor ayudanos a responder las siguientes preguntas sobre tus productos"
          />
        )}
        {shouldShowQuestions && (
          <>
            <Container>
              <QRCContainer
                activeKey={activeKey}
                addCollapse={this.addCollapse}
                answerOnboardingGroup={answerOnboardingGroup}
                answersRender={answersRender}
                changeActiveKey={this.changeActiveKey}
                codePath={data.code}
                counter={counter}
                data={data}
                disabledAdd={disabledAdd}
                iconsPath={iconsPath}
                lastAnswersKeys={this.lastAnswersKeys}
                questionsbyGroup={questionsbyGroup}
                removeInstance={this.removeInstance}
                setRefQRC={this.setRefQRC}
              />
            </Container>
          </>
        )}
        <ButtonsContainer className="panel_footer">
          <CancelButton
            onClick={this.handleClose}
            size="lg"
            noMargin
            withMargin={shouldShowQuestions}
            disabled={isBelvoLoading}
          >
            {shouldShowQuestions
              ? 'Cancelar'
              : isBelvoConnected
              ? 'Continuar'
              : 'Volver'}
          </CancelButton>
          {shouldShowQuestions && (
            <StyledButton onClick={this.getSubmitEventQRC} size="lg">
              Guardar
            </StyledButton>
          )}
        </ButtonsContainer>
      </>
    )
  }
}

SectionItemQRC.propTypes = {
  answerOnboardingGroup: PropTypes.arrayOf(PropTypes.shape({})),
  answersRender: PropTypes.arrayOf(PropTypes.shape({})),
  bulkSaveAnswers: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string,
    is_belvo: PropTypes.bool,
    code: PropTypes.string,
    instances_limit: PropTypes.number,
    text: PropTypes.string,
  }),
  deleteInstanceQuestion: PropTypes.func.isRequired,
  fillingId: PropTypes.string,
  getCurrentAnswerByCode: PropTypes.func.isRequired,
  getQuestionsByGroup2: PropTypes.func.isRequired,
  getSectionInfo: PropTypes.func.isRequired,
  getSummarySura: PropTypes.func,
  iconsPath: PropTypes.string,
  onSetNextButton: PropTypes.func,
  questionsbyGroup: PropTypes.arrayOf(PropTypes.shape({})),
  resetQRC: PropTypes.func.isRequired,
  saveSuraBtn: PropTypes.func,
  personalInfo: PropTypes.shape({
    currentFiling: PropTypes.shape({
      id: PropTypes.string,
      kind: PropTypes.string,
    }),
    role: PropTypes.string,
  }).isRequired,
  hasMigratedAnswers: PropTypes.bool,
}

SectionItemQRC.defaultProps = {
  hasMigratedAnswers: false,
}

export default withPersonalInfo(SectionItemQRC)
