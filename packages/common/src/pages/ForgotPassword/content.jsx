import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { captureSentryException } from '../../sentry'

import {
  FormForgotPassword,
  MessageEmailSend,
} from '../../components/ForgotPassword'
import AuthCard, { Button } from '../../components/AuthCard'

class ForgotPassword extends Component {
  state = {
    email: '',
  }

  handleSubmit = (values) => {
    const { sendForgotPassword } = this.props
    this.setState({ email: values.email })

    try {
      if (window.H && window.H.identify) {
        window.H.identify(values.email, {
          identifyFrom: 'Forgot Password',
        })
      }
    } catch (error) {
      captureSentryException(error)
    }

    this.props.recaptchaAction((token) => {
      sendForgotPassword(values.email, token)
    })
  }

  handleLoginBackClick = () => {
    const { navigate } = this.props
    navigate('/login')
  }

  render() {
    return (
      <AuthCard
        footer={
          <Button fullWidth onClick={this.handleLoginBackClick} size="lg">
            Volver
          </Button>
        }
      >
        {this.state.email ? (
          <MessageEmailSend />
        ) : (
          <FormForgotPassword handleSubmit={this.handleSubmit} />
        )}
      </AuthCard>
    )
  }
}

ForgotPassword.propTypes = {
  sendForgotPassword: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  recaptchaAction: PropTypes.func.isRequired,
}

export default ForgotPassword
