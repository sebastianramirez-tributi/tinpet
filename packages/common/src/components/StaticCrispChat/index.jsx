import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'

import { CRISP_LOAD_EVENT } from '../../constants/filings'
import CrispChatButton from './CrispChatButton'

const StaticCrispChat = ({ container, websiteId }) => {
  const isEnabled = process.env.STATIC_CRISP_ENABLED === 'true'
  const [isCrispLoaded, setCrispAsLoaded] = useState(false)

  useEffect(() => {
    const initialState = window.isCrispLoaded
    if (initialState === undefined) {
      window.crispLoad = function crispLoad() {
        setCrispAsLoaded(true)
        window.dispatchEvent(new Event(CRISP_LOAD_EVENT))
      }
    } else {
      setCrispAsLoaded(initialState)
    }
  }, [])

  return !isCrispLoaded && isEnabled
    ? createPortal(<CrispChatButton websiteId={websiteId} />, container)
    : null
}

StaticCrispChat.propTypes = {
  container: PropTypes.instanceOf(HTMLDivElement).isRequired,
  websiteId: PropTypes.string.isRequired,
}

export default StaticCrispChat
