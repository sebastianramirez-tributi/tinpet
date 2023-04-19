import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { startLoading, stopLoading } from '../redux/general/actions'

const withLoading = (Component) =>
  function WithLoadingComponent(props) {
    const dispatch = useDispatch()
    const handleStartLoading = useCallback(() => dispatch(startLoading()), [])
    const handleStopLoading = useCallback(() => dispatch(stopLoading()), [])
    return (
      <Component
        {...props}
        startLoading={handleStartLoading}
        stopLoading={handleStopLoading}
      />
    )
  }

export default withLoading
