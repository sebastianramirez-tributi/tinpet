import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'antd/lib/modal'
import {
  ActionButton,
  ButtonsContainer,
  ModalBody,
  ModalContent,
  ModalIcon,
  ModalTitle,
} from './style'

const WarningModal = ({
  children,
  goText,
  handleGo,
  handleKeep,
  keepText,
  loading,
  title,
  visible,
}) => (
  <Modal
    visible={visible}
    title={null}
    closable={false}
    width={400}
    footer={null}
  >
    <ModalBody>
      <ModalIcon />
      <ModalTitle>{title}</ModalTitle>
      <ModalContent>{children}</ModalContent>
    </ModalBody>
    <ButtonsContainer>
      <ActionButton
        disabled={loading}
        key="keep"
        onClick={handleKeep}
        type="primary"
      >
        {keepText}
      </ActionButton>
      <ActionButton
        key="go"
        onClick={handleGo}
        loading={loading}
        type="primary"
      >
        {goText}
      </ActionButton>
    </ButtonsContainer>
  </Modal>
)

WarningModal.propTypes = {
  handleKeep: PropTypes.func.isRequired,
  handleGo: PropTypes.func.isRequired,
  keepText: PropTypes.string.isRequired,
  goText: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  visible: PropTypes.bool,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
}

WarningModal.defaultProps = {
  loading: false,
  visible: false,
}

export default WarningModal
