import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { message } from 'antd'
import {
  FormRecoverPassword,
  MessageSuccessRecover,
} from '../../components/RecoverPassword'
import AuthCard, { Button } from '../../components/AuthCard'

class RecoverPassword extends Component {
  state = {
    confirmDirty: false,
    submitDisabled: false,
  }

  handleSubmit = (values) => {
    const { params } = this.props
    this.setState({ submitDisabled: true })
    this.props.changePasswordWithToken(values, params)
  }

  handleLoginBackClick = () => {
    const { navigate } = this.props
    navigate('/login')
  }

  showError = () => {
    const { error = {} } = this.props
    let errorMessage =
      'Hubo un error al recuperar la contraseña. Por favor comunicate con soporte para que te ayudemos'
    if (
      error.response &&
      error.response.data &&
      error.response.data.new_password
    ) {
      ;[errorMessage] = error.response.data.new_password
    }
    window.scrollTo(0, 0)
    message.error(errorMessage, 2)
    setTimeout(() => this.setState({ submitDisabled: false }), 2500)
  }

  componentDidUpdate(props) {
    if (this.props.error && this.props.error !== props.error) this.showError()
  }

  render() {
    const { userInfo } = this.props
    const { submitDisabled } = this.state
    return (
      <AuthCard
        footer={
          <Button fullWidth onClick={this.handleLoginBackClick} size="lg">
            {userInfo ? 'Ingresar' : 'Volver'}
          </Button>
        }
      >
        {userInfo ? (
          <MessageSuccessRecover />
        ) : (
          <FormRecoverPassword
            submitDisabled={submitDisabled}
            validateToNextPassword={this.validateToNextPassword}
            handleSubmit={this.handleSubmit}
          />
        )}
      </AuthCard>
    )
  }
}

RecoverPassword.propTypes = {
  changePasswordWithToken: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.bool]),
  params: PropTypes.shape({}),
  navigate: PropTypes.func.isRequired,
  userInfo: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.bool]),
}

export default RecoverPassword
