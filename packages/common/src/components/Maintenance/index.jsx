import React, { useMemo, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { MAIN } from '../../config/routes/constants'
import DefaultLayout from '../../layout/Main'
import TributiLogo from '../TributiLogo'
import { Content, Container, Message, Text } from './style'

// 10 minutes
const MAINTENANCE_TIMEOUT = 10 * 60 * 1000
const isMaintenanceMode = process.env.ENABLE_MAINTENANCE_MODE === 'true'

const Maintenance = () => {
  const isServiceUnavailable = useMemo(() => {
    const unavailableSince =
      parseInt(sessionStorage.getItem('unavailableService')) || 0
    return Date.now() - unavailableSince <= MAINTENANCE_TIMEOUT
  }, [])

  useEffect(() => {
    if (!isServiceUnavailable) {
      sessionStorage.removeItem('unavailableService')
    }
  }, [isServiceUnavailable])

  return isServiceUnavailable || isMaintenanceMode ? (
    <DefaultLayout>
      <Container>
        <TributiLogo />
        <Content>
          <Message>Estamos en mantenimiento</Message>
        </Content>
        <Text>No te preocupes, pronto estaremos de regreso</Text>
      </Container>
    </DefaultLayout>
  ) : (
    <Navigate replace to={MAIN} />
  )
}

export default Maintenance
