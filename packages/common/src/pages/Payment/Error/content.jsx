import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'

import { usePersonalInfo } from '../../../helpers/hooks'
import { checkRedirect } from '../../../helpers/redirect-user'
import { Error } from '../../../components/Payment'

const PaymentError = () => {
  const navigate = useNavigate()
  const [redirect, setRedirect] = useState()
  const { personalInfo } = usePersonalInfo()
  const { currentFiling = {} } = personalInfo

  // If there is no filing in storage, we need to redirect to filings
  useEffect(() => {
    if (!currentFiling.id) {
      setRedirect(checkRedirect(null))
    }
  }, [currentFiling.id])

  const handleRetryPayment = (e) => {
    e.preventDefault()
    navigate(`/filings/${currentFiling.id}/assistantpayment`)
  }

  if (redirect) {
    return <Navigate replace to={redirect} />
  }

  return currentFiling.id ? <Error retryPayment={handleRetryPayment} /> : null
}

export default PaymentError
