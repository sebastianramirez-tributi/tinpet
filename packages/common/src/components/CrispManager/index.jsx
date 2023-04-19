import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import {
  ACCOUNTANT_CRISP_WEBSITE_ID,
  CRISP_LOAD_EVENT,
  GENERAL_CRISP_WEBSITE_ID,
} from '../../constants/filings'
import { PAYMENT_STATUS } from '../../constants/payment'
import { getMaxTaxYear } from '../../helpers/collections'
import { usePersonalInfo } from '../../helpers/hooks'
import { setCrispWebsiteId } from '../../redux/general/actions'
import { assignCrispProSession } from '../../redux/onboarding/actions'
import { captureSentryException } from '../../sentry'

const CRISP_ACCOUNTANT_ENABLED = process.env.CRISP_ACCOUNTANT_ENABLED === 'true'

const MAX_TAX_YEAR = getMaxTaxYear()
const ALLOWED_PATHS = [
  /^\/filings\/.+/, // onboarding
  /^\/filingstatus/, // elaborate
  /^\/payment\/success/, // download page
]

// Initialize $crisp
window.$crisp = window.$crisp = window.$crisp || []

function CrispManager({ pathname }) {
  const sessionId = useRef(null)
  const dispatch = useDispatch()
  const { personalInfo, setCurrentFiling } = usePersonalInfo()
  const { email, currentFiling } = personalInfo || {}
  const {
    id: filingId,
    first_name: firstName,
    last_name: lastName,
    payment_status: paymentStatus,
    product_plan: productPlan,
    tax_year: taxYear,
    crispSessionSet,
  } = currentFiling || {}

  const isValidPath = useMemo(
    () => ALLOWED_PATHS.find((path) => pathname.match(path)),
    [pathname]
  )

  const isAssistedPaid =
    productPlan?.is_assisted &&
    paymentStatus === PAYMENT_STATUS.APPROVED &&
    taxYear === MAX_TAX_YEAR

  const changeChatInstance = useCallback(
    (websiteId, sessionId = undefined) => {
      dispatch(setCrispWebsiteId(websiteId))
      window.CRISP_WEBSITE_ID = websiteId
      window.CRISP_TOKEN_ID = sessionId
      window.$crisp.push(['off', 'session:loaded'])
      window.$crisp.push(['do', 'session:reset'])
    },
    [dispatch]
  )

  const initializeAccountantChat = useCallback(async () => {
    window.$crisp.push([
      'on',
      'session:loaded',
      async (currentSessionId) => {
        sessionId.current = currentSessionId

        window.$crisp.push([
          'set',
          'user:nickname',
          [`${firstName} ${lastName}`],
        ])
        window.$crisp.push(['set', 'user:email', [email]])
        // Multiple square brackets are needed, https://docs.crisp.chat/guides/chatbox-sdks/web-sdk/dollar-crisp/#push-session-data
        window.$crisp.push(['set', 'session:data', [[['filing', filingId]]]])

        if (!crispSessionSet) {
          try {
            await dispatch(assignCrispProSession(filingId, currentSessionId))
            setCurrentFiling({
              crispSessionSet: true, // synthetic prop to check crisp session for PRO plan
            })
          } catch (error) {
            changeChatInstance(GENERAL_CRISP_WEBSITE_ID)
            captureSentryException(error)
          }
        }
      },
    ])
  }, [
    firstName,
    lastName,
    email,
    filingId,
    dispatch,
    setCurrentFiling,
    crispSessionSet,
    changeChatInstance,
  ])

  useEffect(() => {
    const crispLoadedCallback = () => {
      initializeAccountantChat()
    }

    const asyncEffect = async () => {
      // this function is defined after $crisp loads
      const crispLoaded = !!window.$crisp.is
      if (
        CRISP_ACCOUNTANT_ENABLED &&
        isValidPath &&
        isAssistedPaid &&
        filingId &&
        window.CRISP_WEBSITE_ID !== ACCOUNTANT_CRISP_WEBSITE_ID
      ) {
        changeChatInstance(ACCOUNTANT_CRISP_WEBSITE_ID, filingId)

        if (crispLoaded) {
          // this call is in case crisp already loaded
          crispLoadedCallback()
        } else {
          // And this one is in case crisp load any time in the future
          window.addEventListener(CRISP_LOAD_EVENT, crispLoadedCallback)
        }
      } else if (
        !isValidPath &&
        (!window.CRISP_WEBSITE_ID ||
          window.CRISP_WEBSITE_ID === ACCOUNTANT_CRISP_WEBSITE_ID)
      ) {
        changeChatInstance(GENERAL_CRISP_WEBSITE_ID)
      }
    }

    asyncEffect()

    return () =>
      window.removeEventListener(CRISP_LOAD_EVENT, crispLoadedCallback)
  }, [
    initializeAccountantChat,
    isAssistedPaid,
    filingId,
    isValidPath,
    changeChatInstance,
  ])

  return null
}

CrispManager.propTypes = {
  pathname: PropTypes.string.isRequired,
}

export default CrispManager
