import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { usePersonalInfo } from '../../../helpers/hooks'
import { ROLES } from '../../../constants/person'

const IsAccountant = ({ hide, children, ...props }) => {
  const { personalInfo } = usePersonalInfo()
  const { role } = personalInfo || {}
  const isAccountant = role === ROLES.ACCOUNTANT
  // the hide property works as a validation to show when is not accountant
  const shouldShow = hide ? !isAccountant : isAccountant

  return shouldShow
    ? React.isValidElement(children)
      ? React.cloneElement(children, props)
      : children
    : null
}

IsAccountant.propTypes = {
  hide: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

IsAccountant.defaultProps = {
  hide: false,
}

function propsAreEquals(prev, next) {
  return prev.hide === next.hide && prev.children === next.children
}

export default memo(IsAccountant, propsAreEquals)
