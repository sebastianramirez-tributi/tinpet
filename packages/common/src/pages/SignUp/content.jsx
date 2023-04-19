import React, { Component } from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { message } from 'antd'
import { captureSentryException } from '../../sentry'
import { stringFormat } from '@tributi-co/core-fe'

import { RootContext } from '../../context'
import RedirectUser from '../../helpers/redirect-user'
import withRecaptcha from '../../HOC/withRecaptcha'
import withPersonalInfo from '../../HOC/withPersonalInfo'
import { SURA_RETAIL } from '../../constants/subdomains'
import CreateFillingPage from '../CreateFIling'
import { Text } from './style'
import SignUpForm from '../../components/SignUp'
import AuthCard, { Button } from '../../components/AuthCard'
import { getCookie } from '../../helpers/collections'

import {
  authorizeGmail,
  authorizeMicrosoft,
  closeAuthorize,
} from '../../helpers/auth'

const TERMS_VERSION = 'Julio 23, 2019'
const regex =
  /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i

class SignUp extends Component {
  static contextType = RootContext

  constructor(props) {
    super(props)

    this.state = {
      confirmDirtyPassword: false,
      confirmDirtyEmail: false,
      value: props.context.appRole, // Role gotten from the AppShell config
      disabled: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleLoginBackClick = this.handleLoginBackClick.bind(this)
  }

  validateEmail =
    (message) =>
    ({ validateFields }) => {
      const { confirmDirtyEmail } = this.state
      return {
        validator(_, value) {
          if (value && regex.test(value.toLowerCase())) {
            if (value && confirmDirtyEmail) {
              validateFields(['emailConfirm'], { force: true })
            }
            return Promise.resolve()
          }
          return (
            // eslint-disable-next-line prefer-promise-reject-errors
            (value && Promise.reject(new Error(message))) || Promise.reject()
          )
        },
      }
    }

  handleSubmit(values) {
    const {
      register,
      context: { subdomainConfig },
    } = this.props
    const isSuraApp = subdomainConfig && subdomainConfig.key === SURA_RETAIL
    this.setState({ disabled: true })

    try {
      if (window.H && window.H.identify) {
        window.H.identify(values.email, {
          identifyFrom: 'Register Submit',
        })
      }
    } catch (error) {
      captureSentryException(error)
    }

    this.props.recaptchaAction(async (token) => {
      values.tyc_has_accepted = true
      values.tyc_version = TERMS_VERSION
      values.token = token
      values.role = this.state.value
      if (subdomainConfig) {
        values.partner = subdomainConfig.domain
      }
      const utmParams = JSON.parse(getCookie('tributi:utmParams'))

      await register({ ...values, ...utmParams }, isSuraApp)
      setTimeout(() => this.setState({ disabled: false }), 2000)
    })
  }

  handleConfirmBlur = (e) => {
    const { value } = e.target
    this.setState({
      confirmDirtyPassword: this.state.confirmDirtyPassword || !!value,
    })
  }

  handleConfirmBlurEmail = (e) => {
    const { value } = e.target
    this.setState({
      confirmDirtyEmail: this.state.confirmDirtyEmail || !!value,
    })
  }

  compareToFirstPassword = ({ getFieldValue }) => {
    const {
      context: { subdomainConfig },
    } = this.props
    return {
      validator(_, value) {
        const isSuraApp = subdomainConfig && subdomainConfig.key === SURA_RETAIL

        if (value && value !== getFieldValue('password')) {
          return Promise.reject(
            new Error(
              `Las dos ${isSuraApp ? 'cédula' : 'contraseña'} son diferentes`
            )
          )
        }
        return Promise.resolve()
      },
    }
  }

  // validateToNextPassword = (_, value, callback) => {
  //   const {
  //     form,
  //     context: { subdomainConfig },
  //   } = this.props
  //   const isSuraApp = subdomainConfig && subdomainConfig.key === SURA_RETAIL

  //   if (value && value.length <= 6) {
  //     callback(
  //       `La longitud de la ${
  //         isSuraApp ? 'cédula' : 'contraseña'
  //       } debe ser mayor a 8 caracteres`
  //     )
  //   }
  //   if (value && this.state.confirmDirtyPassword) {
  //     form.validateFields(['confirm'], { force: true })
  //   }
  //   callback()
  // }

  compareEmails = ({ getFieldValue }) => ({
    validator(_, value) {
      if (value && value !== getFieldValue('email')) {
        return Promise.reject(
          new Error('Los correos electrónicos no coinciden')
        )
      }
      return Promise.resolve()
    },
  })

  suraAvoidPaste = (e) => {
    const {
      context: { subdomainConfig },
    } = this.props
    const isSuraApp = subdomainConfig && subdomainConfig.key === SURA_RETAIL
    if (isSuraApp) {
      message.error('No puede realizar la acción pegar en este campo')
      e.preventDefault()
      return false
    }
  }

  handleSocialLogin = async (token) => {
    const { subdomainConfig } = this.context
    this.setState({ disabled: true })
    await this.props.loginSocial(token, subdomainConfig.domain)
    setTimeout(() => this.setState({ disabled: false }), 2000)
  }

  handleGmailLogin = async () => {
    try {
      this.setState({ disabled: true })
      const response = await authorizeGmail()
      this.handleSocialLogin(response.accessToken)
    } catch {
      this.setState({ disabled: false })
    }
  }

  handleMicrosoftLogin = async () => {
    try {
      this.setState({ disabled: true })
      const response = await authorizeMicrosoft()
      this.handleSocialLogin(response.accessToken)
    } catch {
      this.setState({ disabled: false })
    }
  }

  handleLoginBackClick = () => {
    closeAuthorize()
    const { navigate } = this.props
    navigate('/login')
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props
    if (error && prevProps.error !== error) message.error(error, 2)
  }

  render() {
    const { isTributi } = this.context
    const { disabled } = this.state
    const {
      navigate,
      errorUpdate,
      context: { subdomainConfig },
    } = this.props

    const isSuraApp = subdomainConfig && subdomainConfig.key === SURA_RETAIL
    const isExitoApp = subdomainConfig && subdomainConfig.key === 'exitoApp'
    const { personalInfo } = this.props

    if (
      errorUpdate ||
      (personalInfo &&
        (!personalInfo.phone ||
          !personalInfo.national_id ||
          !personalInfo.last_name))
    ) {
      return <CreateFillingPage isExitoApp={isExitoApp} />
    } else if (personalInfo) {
      // This is a workarround since activeRef from useNavigate is not enable until the component is being properly render. So we need to defer this action util that is ready.
      setTimeout(() => {
        RedirectUser.createdUser(personalInfo, navigate, isSuraApp)
      }, 0)
    }

    return (
      <>
        <AuthCard
          fluidContainer={!isTributi}
          className={isTributi && 'col-md-10 col-lg-9'}
          footer={
            <>
              <Text>
                {stringFormat(translate('signUp.question.youHaveAccount'))}
              </Text>
              <Button onClick={this.handleLoginBackClick} size="lg">
                {stringFormat(translate('signUp.signInHere'))}
              </Button>
            </>
          }
        >
          <SignUpForm
            isSuraApp={isSuraApp}
            isExitoApp={isExitoApp}
            onSubmit={this.handleSubmit}
            validateEmail={this.validateEmail}
            compareEmails={this.compareEmails}
            suraAvoidPaste={this.suraAvoidPaste}
            handleConfirmBlurEmail={this.handleConfirmBlurEmail}
            compareToFirstPassword={this.compareToFirstPassword}
            handleConfirmBlur={this.handleConfirmBlur}
            onGmailLogin={this.handleGmailLogin}
            onMicrosoftLogin={this.handleMicrosoftLogin}
            disabled={disabled}
          />
        </AuthCard>
      </>
    )
  }
}

SignUp.propTypes = {
  recaptchaAction: PropTypes.func,
  navigate: PropTypes.func.isRequired,
  errorUpdate: PropTypes.any,
  error: PropTypes.any,
  context: PropTypes.shape({
    subdomainConfig: PropTypes.any,
    appRole: PropTypes.string,
  }),
  userInfo: PropTypes.object,
  loginSocial: PropTypes.func,
  register: PropTypes.func,
  authError: PropTypes.string,
  personalInfo: PropTypes.object,
}

export default compose(withRecaptcha, withPersonalInfo)(SignUp)
