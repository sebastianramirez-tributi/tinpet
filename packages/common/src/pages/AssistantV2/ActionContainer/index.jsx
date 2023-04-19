import React from 'react'
import PropTypes from 'prop-types'
import { RBAC } from '../config'

const ActionContainer = ({ action, permissions, children }) => {
  return (
    <>
      {RBAC.assistant[action].includes(...Object.keys(permissions)) && children}
    </>
  )
}

ActionContainer.propTypes = {
  /**
   * Action to call
   */
  action: PropTypes.string.isRequired,
  /**
   * Permissions to the user to access to some actions
   */
  permissions: PropTypes.object.isRequired,
  /**
   * Render inside to show depend of the permissions
   */
  children: PropTypes.node.isRequired,
}

function propsAreEqual(prev, next) {
  return prev.action === next.action && prev.children === next.children
}

export default React.memo(ActionContainer, propsAreEqual)
