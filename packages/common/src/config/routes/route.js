import React, { Fragment, useMemo, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { useRootContext } from '../../context'
import { usePersonalInfo } from '../../helpers/hooks'
import { captureSentryException } from '../../sentry'
import { ROLES, PARTNER_KEY } from '../../constants/person'
import { ONE_YEAR_SEC } from '../../constants/strings'
import {
  COOKIE_CROSS_DOMAIN,
  COOKIE_DOMAIN_EXCEPTIONS,
} from '../../constants/subdomains'
import { resetStore } from '../../redux/general/actions'
import { normalizePartner, removeCookie } from '../../helpers/collections'
import { ASSISTANT, MAINTENANCE } from './constants'
const isMaintenanceMode = process.env.ENABLE_MAINTENANCE_MODE === 'true'

export const LayoutElement = ({
  componentProps,
  component: Component,
  layout: Layout,
}) => {
  const context = useRootContext()
  return (
    <Layout>
      <Component {...componentProps} context={context} />
    </Layout>
  )
}

LayoutElement.propTypes = {
  componentProps: PropTypes.object.isRequired,
  layout: PropTypes.func.isRequired,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
}

const PrivateRoute = ({
  assistable = true,
  private: isPrivateRoute,
  layout = Fragment,
  component,
  componentProps = {},
}) => {
  const dispatch = useDispatch()
  const { persistor, redirectOnPartner } = useRootContext()
  const { personalInfo } = usePersonalInfo()
  const hasPersonalInfo = !!personalInfo
  const hadPersonalInfo = useRef(hasPersonalInfo)
  const { hostname = '' } = location
  const token = useMemo(() => {
    try {
      return localStorage.jwtToken
    } catch (error) {
      captureSentryException(error)
      return false
    }
  }, [hasPersonalInfo])

  const {
    first_name: firstName,
    last_name: lastName,
    email,
    id,
    phone,
    role,
    national_id: nationalId,
    partner,
    isEnhancedRole,
  } = personalInfo || {}

  const isAssistant = personalInfo && role === ROLES.ASSISTANT
  const isBasicDataCompleted =
    isAssistant || (personalInfo && !!phone && !!nationalId && !!lastName)

  useEffect(() => {
    if (!token && hadPersonalInfo.current) {
      hadPersonalInfo.current = false
      persistor.purge()
      dispatch(resetStore())
    }
    if (!token) {
      // remove cookie to fix some user stuck in login screen when partner is diffent
      removeCookie(PARTNER_KEY, COOKIE_CROSS_DOMAIN)
    }
  }, [isBasicDataCompleted, token])

  useEffect(() => {
    if (hasPersonalInfo) {
      hadPersonalInfo.current = hasPersonalInfo
    }

    try {
      if (
        window.H &&
        window.H.identify &&
        hasPersonalInfo &&
        !sessionStorage.userIdentified
      ) {
        window.H.identify(email, {
          displayName: `${firstName} ${lastName}`,
          email,
          id,
          phone,
          identifyFrom: 'Regular flow',
        })
        sessionStorage.setItem('userIdentified', true)
      }
    } catch (error) {
      captureSentryException(error)
    }
  }, [hasPersonalInfo, firstName, lastName, email, id, phone])

  useEffect(() => {
    // check if the domain shouldn't need the cookie, this is for localhost and ephemerals FTM
    const exceptedDomain = COOKIE_DOMAIN_EXCEPTIONS.some((exceptedDomain) =>
      COOKIE_CROSS_DOMAIN.includes(exceptedDomain)
    )
    if (
      token &&
      partner &&
      !isEnhancedRole &&
      !exceptedDomain &&
      redirectOnPartner
    ) {
      const normalizedPartner = normalizePartner(partner)
      document.cookie = `${PARTNER_KEY}=${normalizedPartner}; domain=${COOKIE_CROSS_DOMAIN}; max-age=${ONE_YEAR_SEC}; path=/;`
    }
  }, [hostname, partner, token, isEnhancedRole, redirectOnPartner])
  if (isMaintenanceMode) {
    return <Navigate replace to={MAINTENANCE} />
  }

  // check if the route is accesible to `assistant` role
  if (!assistable && personalInfo && isAssistant) {
    return <Navigate replace to={ASSISTANT} />
  }

  return isPrivateRoute && (!token || !isBasicDataCompleted) ? (
    <Navigate replace to="/register/declarante" />
  ) : (
    <LayoutElement
      component={component}
      componentProps={componentProps}
      layout={layout}
    />
  )
}

PrivateRoute.propTypes = {
  assistable: PropTypes.bool,
  private: PropTypes.bool,
  layout: PropTypes.func,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  componentProps: PropTypes.object,
}

export default PrivateRoute
