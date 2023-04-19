import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import Notification from 'antd/lib/notification'
import moment from 'moment'
import { QuestionRender } from '@tributi-co/tributi-components'

const findByCode = (code) => (item) => item.code === code

const HiddenContainer = styled.div`
  display: none;
`

const DueDateChecker = ({
  answeredQuestions,
  answeredQuestionsUpdatedAt,
  certificatesUpdates,
  config,
  country,
  filingId,
  getQuestionAndAnswers,
  saveAnswers,
  summary,
  taxableKind,
  taxYear,
}) => {
  const componentRenderedAt = useRef(Date.now())
  const notFirstRender = useRef(false)
  const questionRendererRef = useRef()
  const [dueDateState, setDueDateState] = useState({
    newDueDate: null,
    submittedAnswers: [],
  })
  const [inputsLoaded, setInputLoaded] = useState(false)

  const RUTUpdatedAt = useMemo(() => {
    if (config.RUTCertificate in certificatesUpdates) {
      const updatedAt = certificatesUpdates[config.RUTCertificate]
      const updatedAtMoment = moment(updatedAt)
      const now = moment()
      return updatedAtMoment < now ? updatedAt : null
    }
    return false
  }, [certificatesUpdates, config.RUTCertificate])

  useEffect(() => {
    if (
      answeredQuestionsUpdatedAt &&
      componentRenderedAt.current < answeredQuestionsUpdatedAt
    ) {
      summary(filingId)
    }
  }, [answeredQuestionsUpdatedAt, summary, filingId])

  useEffect(() => {
    if (RUTUpdatedAt && notFirstRender.current) {
      summary(filingId)
    }
    notFirstRender.current = true
  }, [RUTUpdatedAt, filingId, summary])

  useEffect(() => {
    if (RUTUpdatedAt) {
      getQuestionAndAnswers(taxableKind, filingId, [
        config.personalInfoInvisibleNITCode,
        config.personalInfoCalculatedNITCode,
        config.personalInfoDueDateCode,
        config.DianNITCode,
      ])
      setInputLoaded(true)
    }
  }, [filingId, getQuestionAndAnswers, taxableKind, config, RUTUpdatedAt])

  const [questions, answers] = useMemo(() => {
    const personalInfoNIT = answeredQuestions.find(
      findByCode(config.personalInfoInvisibleNITCode)
    )
    const DianNIT = answeredQuestions.find(findByCode(config.DianNITCode))
    const { question: personalInfoNITQuestion, answer: personalInfoNITAnswer } =
      personalInfoNIT || {}
    const { answer: DianNITAnswer } = DianNIT || {}
    if (
      (answeredQuestions.length > 0 &&
        DianNITAnswer &&
        personalInfoNITAnswer &&
        DianNITAnswer.value === personalInfoNITAnswer.value) ||
      !inputsLoaded
    ) {
      return [[], []]
    }

    return answeredQuestions
      .filter(({ code }) => code !== config.personalInfoInvisibleNITCode)
      .reduce(
        (acc, curr) => {
          const [accQuestions, accAnswers] = acc
          const {
            code,
            question: originalQuestion,
            answer: originalAnswer,
          } = curr
          // Creates a copy to prevent overwrite the original data from redux
          let question = originalQuestion
          let answer = originalAnswer
          const currentQuestions = [...accQuestions]
          const currentAnswers = [...accAnswers]

          if (question && answer) {
            if (code === config.DianNITCode) {
              question = {
                ...originalQuestion,
                code: config.personalInfoInvisibleNITCode,
                id: personalInfoNITQuestion.id,
              }
              answer = {
                ...originalAnswer,
                code: config.personalInfoInvisibleNITCode,
                id: personalInfoNITQuestion.id,
                value: parseInt(originalAnswer.value),
              }
            }
            currentQuestions.push(question)
            currentAnswers.push(answer)
          }
          return [currentQuestions, currentAnswers]
        },
        [[], []]
      )
  }, [answeredQuestions, inputsLoaded, config])

  const handleSubmit = useCallback(
    (values) => {
      const dueDate = answers.find(
        ({ code }) => code === config.personalInfoDueDateCode
      )
      const submittedDueDate = values.find(
        ({ code }) => code === config.personalInfoDueDateCode
      )
      const { value: dueDateValue } = dueDate || {}
      const { value: submittedDueDateValue } = submittedDueDate || {}
      if (dueDateValue !== submittedDueDateValue && inputsLoaded) {
        setDueDateState((state) => ({
          ...state,
          newDueDate: submittedDueDateValue,
          submittedAnswers: values,
        }))
      }
    },
    [answers, inputsLoaded, config]
  )

  // Submit the question render component
  useEffect(() => {
    if (answers.length > 0) {
      const { submit } = questionRendererRef.current
      submit(window.event)
    }
  }, [answers.length, questionRendererRef])

  // Show the notification if user has a new due date
  useEffect(() => {
    const { newDueDate, submittedAnswers } = dueDateState
    if (newDueDate) {
      const formattedDueDate = moment(newDueDate).format('MMM DD [de] YYYY')
      const dueDateFiling = moment(newDueDate).format('YYYY-MM-DD')
      const postAnswers = submittedAnswers
        .filter((item) =>
          [
            config.personalInfoInvisibleNITCode,
            config.personalInfoCalculatedNITCode,
            config.personalInfoDueDateCode,
          ].includes(item.code)
        )
        .map(({ id, code, value }) => ({
          id,
          code,
          value,
        }))
      saveAnswers(filingId, postAnswers, dueDateFiling)
      Notification.warn({
        message: 'Fecha límite',
        description: `Con base a la información del RUT ingresado detectamos que la fecha límite que tienes para presentar oportunamente tu declaración de renta es: ${formattedDueDate}`,
        duration: null,
      })
    }
  }, [filingId, dueDateState, saveAnswers, config])

  return (
    answers.length > 0 && (
      <HiddenContainer data-testid="hidden-container">
        <QuestionRender
          ref={questionRendererRef}
          taxableKind={taxableKind}
          taxYear={taxYear}
          country={country}
          questions={questions}
          answers={answers}
          onSaveAnswers={handleSubmit}
        />
      </HiddenContainer>
    )
  )
}

DueDateChecker.propTypes = {
  answeredQuestions: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      question: PropTypes.shape,
      answer: PropTypes.shape,
    })
  ),
  answeredQuestionsUpdatedAt: PropTypes.number.isRequired,
  certificatesUpdates: PropTypes.object.isRequired,
  saveAnswers: PropTypes.func.isRequired,
  country: PropTypes.string.isRequired,
  filingId: PropTypes.string.isRequired,
  getQuestionAndAnswers: PropTypes.func.isRequired,
  summary: PropTypes.func.isRequired,
  taxableKind: PropTypes.string.isRequired,
  taxYear: PropTypes.number.isRequired,
  config: PropTypes.shape({
    personalInfoInvisibleNITCode: PropTypes.string.isRequired,
    personalInfoCalculatedNITCode: PropTypes.string.isRequired,
    personalInfoDueDateCode: PropTypes.string.isRequired,
    DianNITCode: PropTypes.string.isRequired,
    RUTCertificate: PropTypes.string.isRequired,
  }).isRequired,
}

DueDateChecker.defaultProps = {
  answeredQuestions: [],
}

export default DueDateChecker
