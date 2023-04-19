import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

import { CHANGE_PLAN } from '../../config/routes/constants'
import BannerButton from '../BannerButton'
import BannerUpgradePro from '../BannerUpgradePro'
import { Container, Image } from './style'

const BUTTON_COPY = `¡Ayuda! Quiero que un contador haga todo por mí`

const BannerUpgradeProBtn = ({ isMenuBtn, forceMenuBtn }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const openModal = () => {
    setIsOpen(true)
  }
  const onCancel = () => {
    setIsOpen(false)
  }
  const onChangePlan = () => {
    navigate(CHANGE_PLAN)
  }

  return (
    <>
      <Container>
        <BannerButton
          isMenuBtn={isMenuBtn}
          forceMenuBtn={forceMenuBtn}
          onClick={openModal}
        >
          {BUTTON_COPY}
        </BannerButton>
        <Image
          isMenuBtn={isMenuBtn || forceMenuBtn}
          src={'/images/icons/icon-referal.svg'}
        />
      </Container>
      <BannerUpgradePro
        showModal={isOpen}
        onCancel={onCancel}
        onChangePlan={onChangePlan}
      />
    </>
  )
}

BannerUpgradeProBtn.propTypes = {
  /**
   * @property {boolean} updgradebtn tells when the button should have styles to display in side bar menu
   */
  isMenuBtn: PropTypes.bool,
  /**
   * @property {boolean} forceMenuBtn tells when to force the styles of `isMenuBtn` and hide other styles
   */
  forceMenuBtn: PropTypes.bool,
}

BannerUpgradeProBtn.defaultProps = {
  updgradebtn: false,
  forceMenuBtn: false,
}

export default BannerUpgradeProBtn
