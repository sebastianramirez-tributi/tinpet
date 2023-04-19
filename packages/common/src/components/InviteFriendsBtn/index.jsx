import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Image } from './style'
import { useConfig } from '../../helpers/hooks'
import InviteFriends from '../InviteFriends'
import BannerButton from '../BannerButton'

const InviteFriendsBtn = ({ reverse, isMenuBtn, forceMenuBtn }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { assets } = useConfig()
  const { src: referralImgSource } = assets.referralBtn || {}

  const openModal = () => {
    setIsOpen(true)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <>
      <BannerButton
        reverse={reverse}
        forceMenuBtn={forceMenuBtn}
        isMenuBtn={isMenuBtn}
        onClick={openModal}
        image={
          <Image
            src={'https://' + process.env.CDN_BASE_URL + referralImgSource}
            small
          />
        }
      >
        {translate('referralButton.title')}
      </BannerButton>
      <InviteFriends
        filerReferredPrice={30000}
        showModal={isOpen}
        handleCancel={handleCancel}
      />
    </>
  )
}

InviteFriendsBtn.propTypes = {
  /**
   * @property {boolean} isMenuBtn tells the button to invert positions between icon and label
   */
  reverse: PropTypes.bool,
  /**
   * @property {boolean} isMenuBtn tells when the button should have styles to display in side bar menu
   */
  isMenuBtn: PropTypes.bool,
  /**
   * @property {boolean} forceMenuBtn tells when to force the styles of `isMenuBtn` and hide other styles
   */
  forceMenuBtn: PropTypes.bool,
}

InviteFriendsBtn.defaultProps = {
  isMenuBtn: false,
  forceMenuBtn: false,
}

export default InviteFriendsBtn
