import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { stringFormat } from '@tributi-co/core-fe'
import Modal from 'antd/lib/modal'

import { requestEmailValidation, changeEmail } from '../../redux/auth/actions'
import { useBroadcastChannel, usePersonalInfo } from '../../helpers/hooks'
import { Card } from '../../components/Card'
import {
  Button,
  ButtonContainer,
  Container,
  Content,
  Subtitle,
  Title,
} from './style'
import { getHumanizedTime } from '../../helpers/collections'
import ChangeEmailForm from './ChangeEmailForm'

// 2 minutes to resend the email
const RESEND_TIME = 2 * 60 * 1000

function ValidateEmail() {
  const [showChangeEmailModal, setChangeEmailModalVisibility] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { personalInfo } = usePersonalInfo()
  const {
    id: personId,
    is_validate_email: isEmailValidated,
    email,
  } = personalInfo
  const validateEmailPersistKey = `validate-email-timeout:${personId}`

  const [time, setTime] = useState(null)
  const nextResendTime = useRef(null)
  const timeout = useRef(null)

  const isGmailAddress = useMemo(() => email.endsWith('@gmail.com'), [email])

  /**
   * Starts timer if it's not already one running
   * Also, receives an initial value to start timer from
   *
   * @param {number} startFrom value to start from
   * @returns {boolean} telling if timer was initialized. Returns false if timer is already initialized
   */
  const startTimeout = useCallback(
    (startFrom) => {
      const currentTime = Date.now()
      if (nextResendTime.current && currentTime <= nextResendTime.current)
        return false

      if (startFrom) {
        nextResendTime.current = startFrom
      } else {
        nextResendTime.current = currentTime + RESEND_TIME
        localStorage.setItem(validateEmailPersistKey, nextResendTime.current)
        setTime(getHumanizedTime(RESEND_TIME))
      }

      timeout.current = setInterval(() => {
        const diff = nextResendTime.current - Date.now()
        setTime(getHumanizedTime(diff))

        if (diff <= 0) {
          setTime(null)
          nextResendTime.current = null
          clearTimeout(timeout.current)
          localStorage.removeItem(validateEmailPersistKey)
        }
      }, 1000)

      return true
    },
    [validateEmailPersistKey]
  )

  const handleResend = useCallback(() => {
    if (!startTimeout()) return
    dispatch(requestEmailValidation())
  }, [dispatch, startTimeout])

  const handleValidateBroadcast = useCallback(
    ({ data }) => {
      if (data) {
        navigate('/')
      }
    },
    [navigate]
  )

  const toggleChangeModalVisibility = () =>
    setChangeEmailModalVisibility((visibility) => !visibility)

  const handleChangeEmail = useCallback(
    async ({ email, confirmEmail }) => {
      if (email === confirmEmail) {
        const result = await dispatch(changeEmail(email))
        if (result) toggleChangeModalVisibility()
      }
    },
    [dispatch, changeEmail]
  )

  useBroadcastChannel('validate-email', handleValidateBroadcast)

  useEffect(() => {
    if (isEmailValidated) {
      navigate('/filings')
    }
  }, [isEmailValidated, navigate])

  useEffect(() => {
    const nextResend = localStorage.getItem(validateEmailPersistKey) || 0
    const remainingTime = nextResend - Date.now()
    if (nextResend && remainingTime > 0) {
      setTime(getHumanizedTime(remainingTime))
      startTimeout(parseInt(nextResend))
    }

    return () => clearTimeout(timeout)
  }, [validateEmailPersistKey, startTimeout])

  return (
    <>
      <Modal
        destroyOnClose
        visible={showChangeEmailModal}
        footer={null}
        onCancel={toggleChangeModalVisibility}
      >
        <ChangeEmailForm
          onSubmit={handleChangeEmail}
          onCancel={toggleChangeModalVisibility}
        />
      </Modal>
      <div className="container">
        <Card>
          <Container>
            <Title>{translate('validateEmail.title')}</Title>
            <Subtitle>{translate('validateEmail.subtitle')}</Subtitle>
            <Content>
              <p>{translate('validateEmail.callToAction')}</p>
              <b data-testid="validate-email-address">{email}</b>
              <Button
                data-testid="validate-email-wrong-address"
                color="primary"
                variant="link"
                onClick={toggleChangeModalVisibility}
              >
                {translate('validateEmail.wrongAddress')}
              </Button>
            </Content>
            <ButtonContainer>
              <Button
                data-testid="validate-email-resend"
                color="primary"
                size="lg"
                onClick={handleResend}
                disabled={!!time}
              >
                {time
                  ? stringFormat(
                      translate('validateEmail.button.sendAgainTimer'),
                      { time }
                    )
                  : translate('validateEmail.button.send')}
              </Button>
              {isGmailAddress ? (
                <Button
                  data-testid="validate-email-gmail-button"
                  color="primary"
                  size="lg"
                  as="a"
                  href="https://www.gmail.com"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {translate('validateEmail.reviewOnGmail')}
                </Button>
              ) : null}
            </ButtonContainer>
          </Container>
        </Card>
      </div>
    </>
  )
}

export default ValidateEmail
