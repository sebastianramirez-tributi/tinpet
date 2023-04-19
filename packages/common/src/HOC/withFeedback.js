import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { message } from 'antd'

/**
 * show feedback messages when they're coming from the state,
 * these messages are shown by the message component from antd
 * however we can implement any other library
 * This could be a potencial shared-component
 */
const withFeedback = (Component) => {
  function Feedback({
    errorMessage,
    successMessage,
    errorTimestamp,
    successTimestamp,
    ...props
  }) {
    const handleMessageDisplay = useCallback((messageBody, timestamp, type) => {
      if (messageBody && timestamp) {
        message.destroy()
        message[type](messageBody)
      }
    }, [])

    useEffect(() => {
      handleMessageDisplay(errorMessage, errorTimestamp, 'error')
    }, [handleMessageDisplay, errorMessage, errorTimestamp])

    useEffect(() => {
      handleMessageDisplay(successMessage, successTimestamp, 'success')
    }, [handleMessageDisplay, successMessage, successTimestamp])
    return <Component {...props} />
  }
  Feedback.propTypes = {
    errorMessage: PropTypes.string,
    successMessage: PropTypes.string,
    errorTimestamp: PropTypes.number,
    successTimestamp: PropTypes.string,
  }
  Feedback.defaultProps = {
    errorMessage: null,
    successMessage: null,
    errorTimestamp: null,
    successTimestamp: null,
  }
  return Feedback
}

export default withFeedback
