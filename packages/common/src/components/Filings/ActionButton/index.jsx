import React from 'react'
import PropTypes from 'prop-types'
import { Button } from './style'
import cx from 'classnames'

const completeClass = (className) => `${className}`

const ActionButton = ({
  small,
  outstanding,
  icon,
  success,
  primary,
  danger,
  leftIcon,
  fullWidth,
  outlined,
  className,
  children,
  ...props
}) => {
  const propsClassNames = {
    [completeClass`small`]: small,
    [completeClass`outstanding`]: outstanding,
    [completeClass`outlined`]: outlined,
    [completeClass`icon`]: icon,
    [completeClass`success`]: success,
    [completeClass`danger`]: danger,
    [completeClass`left-icon`]: leftIcon,
    [completeClass`full-width`]: fullWidth,
    [completeClass`primary`]: primary,
  }
  return (
    <Button {...props} className={cx(propsClassNames, className)}>
      {children}
    </Button>
  )
}

ActionButton.propTypes = {
  small: PropTypes.any,
  outstanding: PropTypes.any,
  icon: PropTypes.any,
  success: PropTypes.any,
  primary: PropTypes.any,
  danger: PropTypes.any,
  leftIcon: PropTypes.any,
  fullWidth: PropTypes.any,
  outlined: PropTypes.any,
  className: PropTypes.any,
  children: PropTypes.any,
}

export default ActionButton
