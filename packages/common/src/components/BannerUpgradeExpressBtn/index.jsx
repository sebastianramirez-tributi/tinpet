import React from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { CHANGE_PLAN } from '../../config/routes/constants'
import BannerButton from '../BannerButton'

const BUTTON_COPY = `⭐️ Cambiar Plan Exprés`

const BannerUpgradeExpressBtn = ({ isMenuBtn, forceMenuBtn }) => {
  const navigate = useNavigate()
  const onChangePlan = () => {
    navigate(CHANGE_PLAN)
  }

  return (
    <>
      <BannerButton
        forceMenuBtn={forceMenuBtn}
        isMenuBtn={isMenuBtn}
        onClick={onChangePlan}
      >
        {BUTTON_COPY}
      </BannerButton>
    </>
  )
}

BannerUpgradeExpressBtn.propTypes = {
  isMenuBtn: PropTypes.bool,
  forceMenuBtn: PropTypes.bool,
}

BannerUpgradeExpressBtn.defaultProps = {
  isMenuBtn: false,
  forceMenuBtn: false,
}

export default BannerUpgradeExpressBtn
