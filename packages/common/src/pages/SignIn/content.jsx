import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import RedirectUser from '../../helpers/redirect-user'
import { useRootContext } from '../../context'
import { CARDIF } from '../../constants/subdomains'
import { Container } from './style'
import { message } from 'antd'

const SignIn = ({ error, handleSSOAuth, userInfo }) => {
  const { subdomainConfig } = useRootContext()
  const isCardif = subdomainConfig?.key === CARDIF
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const refreshToken = params.get('refresh')
    // this will remove all query string and avoid to the user see
    // the information
    handleSSOAuth(token, refreshToken, isCardif)
    window.history.replaceState({}, document.title, '/')
  }, [handleSSOAuth, isCardif])

  // Everything fulfilled properly
  useEffect(() => {
    if (userInfo) {
      RedirectUser.fromSSO(userInfo, navigate)
    }
  }, [userInfo, navigate])

  // In case error has occurred
  useEffect(() => {
    if (error) {
      localStorage.clear()
      message.error(error)
      navigate('/login', { replace: true })
    }
  }, [error])
  return <Container data-testid="container" />
}

SignIn.propTypes = {
  error: PropTypes.string,
  handleSSOAuth: PropTypes.func.isRequired,
  userInfo: PropTypes.shape({}),
}

export default SignIn
