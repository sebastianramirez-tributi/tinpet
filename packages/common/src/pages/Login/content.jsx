import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { captureSentryException } from '../../sentry'

import { RootContext } from '../../context'
import AuthCard, { Button } from '../../components/AuthCard'
import LoginForm from '../../components/Login'
import withRecaptcha from '../../HOC/withRecaptcha'
import RedirectUser from '../../helpers/redirect-user'

import {
  authorizeGmail,
  authorizeMicrosoft,
  closeAuthorize,
} from '../../helpers/auth'
import { SURA_RETAIL } from '../../constants/subdomains'
import { message } from 'antd'

const SSO_DISCOURSE_URL = process.env.SSO_DISCOURSE_URL || ''

class Login extends Component {
  static contextType = RootContext

  state = {
    email: '',
    password: '',
    error: null,
    disabled: false,
    discourseInitialized: false,
  }

  onSubmit = async (email, pass) => {
    const { subdomainConfig, redirectOnPartner } = this.context
    this.setState({ disabled: true })

    try {
      if (window.H && window.H.identify) {
        window.H.identify(email, {
          identifyFrom: 'Login Submit',
        })
      }
    } catch (error) {
      captureSentryException(error)
    }

    this.props.recaptchaAction(async (token) => {
      await this.props.login(
        email,
        pass,
        token,
        redirectOnPartner,
        subdomainConfig.domain
      )
      setTimeout(() => this.setState({ disabled: false }), 2000)
    })
  }

  handleSocialLogin = async (token) => {
    const { subdomainConfig, redirectOnPartner } = this.context
    this.setState({ disabled: true })
    await this.props.loginSocial(
      token,
      redirectOnPartner,
      subdomainConfig.domain
    )
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

  handleCreateAccountButton = () => {
    closeAuthorize()
    const { navigate } = this.props
    const { isTributi } = this.context
    const registerUser = isTributi ? 'declarante' : 'contador'
    navigate(`/register/${registerUser}`)
  }

  componentDidMount() {
    this.checkRedirection()
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props
    if (error && prevProps.error !== error) message.error(error, 2)

    this.checkRedirection()
  }

  async checkRedirection() {
    const {
      isAuthenticated,
      context,
      navigate,
      personalInfo,
      discourseSSO,
      getDiscourseSSO,
    } = this.props
    const { discourseInitialized } = this.state
    const keyApp =
      context && context.subdomainConfig ? context.subdomainConfig.key : ''
    const isSuraApp = keyApp === SURA_RETAIL
    const params = this.props.location.pathname
    const taxDirections = ['/services']

    if (isAuthenticated && personalInfo && personalInfo.id) {
      const url = new URL(location.href)
      const sso = url.searchParams.get('sso')
      const sig = url.searchParams.get('sig')

      if (taxDirections.includes(params)) {
        // This is a workarround since activeRef from useNavigate is not enable until the component is being properly render. So we need to defer this action util that is ready.
        setTimeout(() => {
          navigate('/services/payment', { replace: true })
        }, 0)
      } else if (sso && sig) {
        if (discourseSSO) {
          window.location.href = `${SSO_DISCOURSE_URL}/session/sso_login/${discourseSSO}`
        } else if (!discourseInitialized) {
          this.setState({ discourseInitialized: true })
          await getDiscourseSSO(sso, sig)
        }
      } else {
        try {
          if (heap) {
            heap.identify(personalInfo.email)
          }
          if (window.FS && window.FS.identify) {
            window.FS.identify(personalInfo.email, {
              displayName: `${personalInfo.first_name} ${personalInfo.last_name}`,
              email: personalInfo.email,
              reviewsWritten_int: 14,
            })
          }
        } catch (e) {
          console.error(e)
        }
        // This is a workarround since activeRef from useNavigate is not enable until the component is being properly render. So we need to defer this action util that is ready.
        setTimeout(
          () => RedirectUser.loginUser(personalInfo, navigate, isSuraApp),
          0
        )
      }
    }
  }

  render() {
    const { subdomainConfig } = this.context
    const { disabled } = this.state
    const { loading, form } = this.props
    const keyApp = subdomainConfig ? subdomainConfig.key : ''
    const isSuraApp = keyApp === SURA_RETAIL
    return (
      <AuthCard
        footer={
          <Button fullWidth onClick={this.handleCreateAccountButton} size="lg">
            {'Crear mi cuenta'}
          </Button>
        }
      >
        <LoginForm
          sendLoginInfo={this.onSubmit}
          isSuraApp={isSuraApp}
          loading={loading}
          disabled={disabled}
          onGmailLogin={this.handleGmailLogin}
          onMicrosoftLogin={this.handleMicrosoftLogin}
          form={form}
        />
      </AuthCard>
    )
  }
}

Login.propTypes = {
  loading: PropTypes.bool,
  form: PropTypes.shape({}),
  navigate: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  context: PropTypes.shape({ subdomainConfig: PropTypes.any }),
  location: PropTypes.any,
  loginSocial: PropTypes.func,
  recaptchaAction: PropTypes.func,
  error: PropTypes.any,
  login: PropTypes.func,
  personalInfo: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    id: PropTypes.string,
  }),
  discourseSSO: PropTypes.string,
  getDiscourseSSO: PropTypes.func.isRequired,
}

export default withRecaptcha(Login)
