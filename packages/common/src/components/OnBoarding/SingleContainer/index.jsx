import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
import {
  QuestionRender,
  QuestionRenderErrorBoundary,
} from '@tributi-co/tributi-components'

import SectionTitle from '../SectionTitle'
import { OB_BULK } from '../../../constants/onboarding'
import { usePersonalInfo } from '../../../helpers/hooks'
import {
  getAnswers,
  getQuestions,
  getSummarySura,
  postAnswers,
} from '../../../redux/onboarding/actions'
import { captureSentryException } from '../../../sentry'
import { Container, QuestionRenderError } from './style'

const BUTTON_PROPS = {
  size: 'lg',
}

const SingleContainer = ({
  groupCode,
  helpLink,
  hideHeader,
  next,
  onlyBulkOnboarding,
  onSaveSura,
  sectionSubtitle,
  sectionTitle,
  setDisableTabs,
  validatePersonalInfo,
  updateDueDate,
}) => {
  const refQRC = useRef(null)
  const { personalInfo } = usePersonalInfo()
  const { currentFiling, role, isEnhancedRole } = personalInfo

  const dispatch = useDispatch()
  const { taxable_kind: taxableKind, tax_year: taxYear } = currentFiling

  const { alerts, answersRender, questionsRender, postLoading, error } =
    useSelector(
      ({
        onboardingReducer: {
          alerts,
          answersRender,
          questionsRender,
          loading: postLoading,
          error,
        },
      }) => ({
        alerts,
        answersRender,
        error,
        questionsRender,
        postLoading,
      })
    )

  const loading = !(questionsRender && answersRender)

  const getQuestionAnswers = useCallback(async (groupCode) => {
    try {
      await dispatch(getAnswers({ code: groupCode }, currentFiling.id))
      dispatch(getQuestions(groupCode, currentFiling))
    } catch (error) {
      message.error('Ocurrió un error, por favor recarga de nuevo la página')
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    getQuestionAnswers(groupCode)
  }, [getQuestionAnswers, groupCode])

  /**
   * Run validation after QRC is fully mounted
   */
  useLayoutEffect(() => {
    if (
      questionsRender?.length > 0 &&
      answersRender?.length > 0 &&
      !postLoading &&
      !error &&
      refQRC.current
    ) {
      // Run in the next stack of events when QRC has the information
      // mounted
      // TODO find out another way to handle this load, maybe the QR after
      // load Questions and answers model can callback with a function and call
      // this function
      setTimeout(() => validatePersonalInfo(refQRC, groupCode), 0)
    }
  }, [
    answersRender,
    error,
    questionsRender,
    groupCode,
    postLoading,
    refQRC,
    validatePersonalInfo,
  ])

  const handleSaveFail = useCallback((error) => {
    message.destroy()
    message.error(
      'No pudimos guardar tus respuestas, intenta de nuevo; si el problema persiste, comunícate con el chat en vivo'
    )
    captureSentryException(error)
  }, [])

  const handleSubmitSideEffect = useCallback(
    (bulkAnswer) => {
      updateDueDate(bulkAnswer, groupCode)
    },
    [updateDueDate]
  )

  const handleSaveAnswers = useCallback(
    async (answers) => {
      window.scrollTo(0, 0)

      const isSuraShouldDeclare = currentFiling.kind === 'SDSURA'

      // This is a workarround since we are receiving umbrellas in some of the tax_inputs
      // so the idea it's remove the answers that are not in the groupCode.
      const bulkAnswer = answers.filter((item) =>
        item.code.startsWith(groupCode)
      )

      // In the future when there are more monoinstances and umbrellas, we will should to made other implementation for getting the instace_id
      // TODO: Refactor QRC to always return the instance_id on the same place so we don't have to look in #instance_id and #answer.instance_id
      const answer = bulkAnswer.find(
        (item) => item.instance_id || (item.answer && item.answer.instance_id)
      )
      const instanceId =
        answer &&
        (answer.instance_id || (answer.answer && answer.answer.instance_id))

      const data = {
        code: groupCode,
        fillingId: currentFiling.id,
        brand: currentFiling.kind,
        instance_id: instanceId,
        role,
      }

      await dispatch(
        postAnswers(bulkAnswer, data, false, onlyBulkOnboarding && OB_BULK)
      )
      handleSubmitSideEffect(bulkAnswer)
      if (isSuraShouldDeclare) {
        onSaveSura()
        await getSummarySura(currentFiling.id)
      }
      setDisableTabs(false)
      next()
      return Promise.resolve()
    },
    [
      dispatch,
      currentFiling,
      groupCode,
      next,
      onSaveSura,
      role,
      setDisableTabs,
      handleSubmitSideEffect,
    ]
  )

  return (
    <QuestionRenderErrorBoundary
      logServiceCallback={captureSentryException}
      fallback={
        <QuestionRenderError>
          <p>
            <b>Algo pasó y no pudimos cargar esta sección</b>, puede ser el
            navegador o una de las extensiones. Puedes intentar desactivando las
            extensiones o con otro navegador.
          </p>
          <p>Si sigues teniendo problemas, comunícate con el chat en vivo.</p>
        </QuestionRenderError>
      }
    >
      <Container>
        {!hideHeader && (
          <SectionTitle
            title={sectionTitle}
            subtitle={sectionSubtitle}
            helpLink={helpLink}
          />
        )}
        {!loading && (
          <QuestionRender
            alertsConfig={alerts}
            answers={answersRender || []}
            buttonText="Siguiente"
            buttonProps={BUTTON_PROPS}
            enableEnhancedInputInfo={isEnhancedRole}
            enableIconHelp
            hideSaveButton={!questionsRender || questionsRender.length === 0}
            markMandatoryFields
            questions={questionsRender}
            ref={refQRC}
            onEmptySave={next}
            onSaveAnswers={handleSaveAnswers}
            onSaveFail={handleSaveFail}
            taxYear={taxYear}
            taxableKind={taxableKind}
          />
        )}
      </Container>
    </QuestionRenderErrorBoundary>
  )
}

SingleContainer.propTypes = {
  /**
   * Indicates what is the groupCode to point to the get the questions.
   */
  groupCode: PropTypes.string.isRequired,
  helpLink: PropTypes.string,
  hideHeader: PropTypes.bool,

  /**
   * This callback move one step forward in the tab container
   */
  next: PropTypes.func,

  /**
   * Indicates a validation to run on load
   */
  onLoad: PropTypes.string,
  onlyBulkOnboarding: PropTypes.bool,
  onSaveSura: PropTypes.func,

  /**
   * Subtitle to show in the sections
   */
  sectionSubtitle: PropTypes.string,

  /**
   * Title of the section
   */
  sectionTitle: PropTypes.string,

  setDisableTabs: PropTypes.func,
  validatePersonalInfo: PropTypes.func,
  updateDueDate: PropTypes.func,
}

SingleContainer.defaultProps = {
  helpLink: '',
  hideHeader: false,
  next: () => {},
  onLoad: '',
  onlyBulkOnboarding: false,
  onSaveSura: () => {},
  sectionSubtitle: '',
  sectionTitle: '',
  setDisableTabs: () => {},
  validatePersonalInfo: () => {},
}

export default SingleContainer
