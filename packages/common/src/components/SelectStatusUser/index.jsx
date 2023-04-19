import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Select, message } from 'antd'

import ActionContainer from '../../pages/AssistantV2/ActionContainer'
import {
  saveAssistantUser,
  clearMessage,
  updateAsistantUsers,
} from '../../redux/form/actions'
import { usePersonalInfo } from '../../helpers/hooks'
import { ACTIONS } from '../../pages/AssistantV2/config'

const Option = Select.Option

const SelectStatusUser = ({
  saveAssistantUser,
  messageToShow,
  error,
  id,
  email,
  defaultValue,
  clearMessage,
  updateAsistantUsers,
  assistantLocalState,
}) => {
  const [readOnly, setReadOnly] = useState(false)

  const handleChange = (value) => {
    saveAssistantUser(id, { is_active: value })
  }

  const { personalInfo } = usePersonalInfo()
  const { is_staff: isStaff } = personalInfo || {}

  const infoUser = useMemo(() => {
    return isStaff ? { accessControl: { is_staff: isStaff } } : {}
  }, [isStaff])

  useEffect(() => {
    if (!isStaff) {
      setReadOnly(true)
    }
  }, [isStaff])

  useEffect(() => {
    const { currentUserToValidate = {} } = assistantLocalState
    const { email: currentEmail = '' } = currentUserToValidate
    if (email === currentEmail) {
      // Validate to show only a message
      if (error && messageToShow) {
        message.destroy()
        clearMessage()
        return message.error(messageToShow)
      }
      if (messageToShow) {
        message.destroy()
        message.success(messageToShow)
        clearMessage()
        updateAsistantUsers(assistantLocalState.emailOrId.param)
      }
    }
  }, [messageToShow])

  if (readOnly) {
    return <div>{defaultValue ? 'Activo' : 'Inactivo'}</div>
  }

  return (
    <ActionContainer
      action={ACTIONS.ACTIVE_OR_INACTIVE_USER}
      permissions={infoUser.accessControl ? infoUser.accessControl : infoUser}
    >
      <Select
        defaultValue={defaultValue}
        value={defaultValue}
        onChange={handleChange}
      >
        <Option value>Activo</Option>
        <Option value={false}>Inactivo</Option>
      </Select>
    </ActionContainer>
  )
}

SelectStatusUser.propTypes = {
  /**
   * id of user
   */
  id: PropTypes.string.isRequired,
  /**
   * email of user
   */
  email: PropTypes.string.isRequired,
  /**
   * Default value to show in select
   */
  defaultValue: PropTypes.bool.isRequired,
  /**
   * Message to show after save status of user
   */
  messageToShow: PropTypes.string,
  /**
   * Error saving the user
   */
  error: PropTypes.bool,
  /**
   * Actio to save the user
   */
  saveAssistantUser: PropTypes.func,
  /**
   * Object with local stste to asistant
   */
  assistantLocalState: PropTypes.object,
  /**
   *  Function to clear message to show after change status of user
   */
  clearMessage: PropTypes.func,
  /**
   *  Function to update status of user (active or inactive)
   */
  updateAsistantUsers: PropTypes.func,
}

const mapStateToProps = ({ registerReducer }) => ({
  messageToShow: registerReducer.messageToShow,
  error: registerReducer.error,
  assistantLocalState: registerReducer.assistantLocalState,
})

const mapDispatchToProps = {
  saveAssistantUser,
  clearMessage,
  updateAsistantUsers,
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectStatusUser)
