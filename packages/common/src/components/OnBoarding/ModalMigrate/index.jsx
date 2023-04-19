import React, { useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import Markup from './Markup'
const ModalMigrate = ({
  visible,
  onCancelPreload,
  onPreload,
  wasMigrated,
  onContinue,
  migrationError,
  onClearErrorFlag,
}) => {
  const [buttonLoadInfo, setButtonLoadInfo] = useState(false)
  const [migrationReady, setMigrationReady] = useState(false)
  const [showConfirm, setShowConfirm] = useState(true)
  const [successLoad, setSuccessLoad] = useState(false)

  useEffect(() => {
    if (migrationReady) {
      if (wasMigrated) {
        setSuccessLoad(true)
      } else {
        setSuccessLoad(false)
        onClearErrorFlag()
      }
      setShowConfirm(false)
      setButtonLoadInfo(false)
    }
  }, [wasMigrated, migrationError, migrationReady])

  const handlePreloadClick = useCallback(async () => {
    setButtonLoadInfo(true)
    await onPreload()
    setMigrationReady(true)
  }, [])

  return (
    <>
      <Modal width={550} visible={visible} closable={false} footer={null}>
        <Markup
          onCancelPreload={onCancelPreload}
          onContinue={onContinue}
          buttonLoadInfo={buttonLoadInfo}
          showConfirm={showConfirm}
          successLoad={successLoad}
          onPreload={handlePreloadClick}
          migrationErrorStatus={migrationError}
          wasMigrated={wasMigrated}
        />
      </Modal>
    </>
  )
}

ModalMigrate.propTypes = {
  onPreload: PropTypes.func,
  onCancelPreload: PropTypes.func,
  onClearErrorFlag: PropTypes.func,
  onContinue: PropTypes.func,
  visible: PropTypes.bool,
  wasMigrated: PropTypes.bool,
  migrationError: PropTypes.bool,
}

ModalMigrate.defaultProps = {
  visible: false,
}

export default ModalMigrate
