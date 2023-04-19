import React, { PureComponent, Fragment } from 'react'
import { Navigate } from 'react-router-dom'

import * as routes from '../../../config/routes/constants'
import { FILING_STATUS } from '../../../constants/filings'
import { PAYMENT_STATUS } from '../../../constants/payment'
import { checkRedirect } from '../../../helpers/redirect-user'
import { trackDeclarationPurchase } from '../../../helpers/analytics'
import PaymentError from '../Error'
import PaymentProcess from '../Process'

class PaymentDone extends PureComponent {
  state = {
    redirect: null,
    tracked: false,
  }

  componentDidMount() {
    this.props.getStatus_payment({ order_id: this.props.params.order_id })
  }

  componentDidUpdate() {
    const {
      statusPayment,
      location,
      AckOrder,
      tax_engine,
      params,
      payment_order: paymentOrder,
      setCurrentFiling,
      personalInfo,
    } = this.props
    const { tracked } = this.state
    const { currentFiling = {} } = personalInfo
    const { product_plan: userPlan } = currentFiling
    const { engine: paymentEngine } = paymentOrder || {}

    // If there is no current filing we need to redirect to the right path
    if (!currentFiling) {
      this.redirect(checkRedirect(null))
    } else {
      const url = decodeURI(
        location.search.replace(/&/g, '","').replace(/=/g, '":"')
      )
      const paymentResolve = JSON.parse(`{"${url.substring(1, url.length)}"}`)
      const fromPlans = currentFiling.planPayment

      AckOrder(params.order_id, paymentResolve)
      if (
        statusPayment &&
        statusPayment === PAYMENT_STATUS.APPROVED &&
        !tracked
      ) {
        trackDeclarationPurchase(paymentOrder, fromPlans ? 'PLANS' : 'CHECKOUT')
        this.setState({ tracked: true })
      }

      const planAssistedOrRush =
        !paymentEngine ||
        (userPlan && (userPlan.is_assisted || userPlan.is_rush))
      if (
        statusPayment === PAYMENT_STATUS.APPROVED &&
        currentFiling.status === FILING_STATUS.DOCS_COMPLETED &&
        planAssistedOrRush
      ) {
        this.redirect(routes.FILING_STATUS)
      } else if (fromPlans) {
        const paymentFail =
          statusPayment === PAYMENT_STATUS.DECLINED ||
          statusPayment === PAYMENT_STATUS.CANCELLED
        const updatedFiling = {
          ...currentFiling,
          status: paymentFail
            ? FILING_STATUS.CHOOSING_PLAN
            : currentFiling.status,
          planPayment: false,
        }
        const planRoute = currentFiling.upgradingPlan
          ? routes.ACCOUNTANT_FILLINGS
          : routes.SELECT_PLAN
        if (statusPayment) {
          const route = paymentFail ? planRoute : checkRedirect(updatedFiling)
          setCurrentFiling(updatedFiling, false)
          this.redirect(route)
        }
      } else if (statusPayment === PAYMENT_STATUS.APPROVED) {
        if (currentFiling.status === FILING_STATUS.ON_BOARDING) {
          const route = checkRedirect(currentFiling)
          this.redirect(route)
        } else if (currentFiling.status !== FILING_STATUS.BEING_PROCESSED) {
          // If status is `being_processed` we do nothing because already was redirected to /filingstatus
          tax_engine({ tax_engine: paymentEngine })
          this.redirect(routes.PAYMENT_PAYU, 'success')
        }
      } else if (
        statusPayment === PAYMENT_STATUS.PENDING ||
        statusPayment === PAYMENT_STATUS.CREATED
      ) {
        this.redirect(routes.PAYMENT_PAYU, 'pending', params.order_id)
      } else if (
        statusPayment === PAYMENT_STATUS.DECLINED ||
        statusPayment === PAYMENT_STATUS.CANCELLED
      ) {
        this.redirect(routes.PAYMENT_PAYU, 'error')
      }
    }
  }

  redirect(...segments) {
    const path = segments.join('/')
    this.setState({ redirect: path })
  }

  getUrlParams(search) {
    const hashes = search.slice(search.indexOf('?') + 1).split('&')
    const params = hashes.reduce((param, hash) => {
      const [key, val] = hash.split('=')
      param[key] = decodeURIComponent(val)
      return param
    }, {})
    return params
  }

  render() {
    const { redirect } = this.state
    const {
      location,
      statusPayment,
      PaymentPolling,
      params: { order_id: orderId },
    } = this.props
    const params = this.getUrlParams(location.search)
    if (
      [
        PAYMENT_STATUS.APPROVED,
        PAYMENT_STATUS.PENDING,
        PAYMENT_STATUS.CREATED,
      ].includes(statusPayment)
    ) {
      PaymentPolling(orderId)
    }

    if (redirect) {
      return <Navigate replace to={redirect} />
    }

    return (
      <Fragment>
        {['6', '104', '5'].includes(params.transactionState) && (
          <PaymentError />
        )}
        {params.transactionState === '7' && <PaymentProcess />}
      </Fragment>
    )
  }
}

export default PaymentDone
