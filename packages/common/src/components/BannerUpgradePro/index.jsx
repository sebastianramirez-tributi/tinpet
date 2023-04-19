import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Modal from 'antd/lib/modal'

import {
  ModalBody,
  ModalIcon,
  ModalTitle,
  Text,
  ChangePlanButton,
  ChangePlanModalFooter,
} from './style'

const BannerUpgradePro = ({ onCancel, showModal, onChangePlan }) => {
  useEffect(() => {
    if (showModal) {
      onChangePlan()
    }
  }, [showModal, onChangePlan])

  return (
    <Modal
      visible={showModal}
      width={450}
      closable={false}
      footer={
        <ChangePlanModalFooter>
          <ChangePlanButton variant="outlined" onClick={onCancel}>
            Atrás
          </ChangePlanButton>
          <ChangePlanButton onClick={onChangePlan}>
            Cambiar Plan
          </ChangePlanButton>
        </ChangePlanModalFooter>
      }
    >
      <ModalBody>
        <ModalIcon />
        <ModalTitle>Cambiar a plan Pro</ModalTitle>
      </ModalBody>
      <Text>
        Con el plan Pro un contador profesional será asignado a tu declaración
        para atenderte en vivo y hacer todo por ti.
      </Text>
    </Modal>
  )
}

BannerUpgradePro.propTypes = {
  onCancel: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  onChangePlan: PropTypes.func.isRequired,
}

export default BannerUpgradePro
