import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { WidgetWrapper, useWidget } from '@tributi-co/tributi-components'
const noop = () => {}

/**
 * it will be potencially a shared component however i think right now is
 * just a component for this app, when we have more use cases may be we can
 * reconsider
 */
function TributiWidget({
  config,
  initialState,
  onClose,
  onFlush,
  open,
  ...props
}) {
  const {
    modalConfig: { onBackButtonClick = noop, ...modalConfig },
    Component,
    Template,
    setModalConfig,
    templateProps,
    setTransition,
    stepProps,
  } = useWidget(config, initialState)
  const [visible, setVisible] = useState(open)
  const handleClose = useCallback(() => {
    setVisible(false)
    onClose()
    setTransition(initialState)
  }, [onClose, setTransition, initialState])
  useEffect(() => {
    setVisible(open)
  }, [open])
  return (
    <WidgetWrapper
      onBackButtonClick={onBackButtonClick(setTransition)}
      visible={visible}
      onCancel={handleClose}
      onDestroy={onFlush}
      {...modalConfig}
    >
      <Template {...templateProps} {...stepProps}>
        <Component
          {...props}
          {...stepProps}
          onClose={handleClose}
          setModalConfig={setModalConfig}
          setTransition={setTransition}
        />
      </Template>
    </WidgetWrapper>
  )
}

TributiWidget.propTypes = {
  initialState: PropTypes.string,
  onClose: PropTypes.func,
  onFlush: PropTypes.func,
  open: PropTypes.bool,
  config: PropTypes.arrayOf(PropTypes.shape({})),
}

export default TributiWidget
