import React from 'react'
import PropTypes from 'prop-types'
import { ButtonContainer, ButtonLabel } from './styles'

function BannerButton({
  reverse,
  isMenuBtn,
  forceMenuBtn,
  image,
  onClick,
  children,
}) {
  return (
    <ButtonContainer
      reverse={reverse}
      forceMenuBtn={forceMenuBtn}
      isMenuBtn={isMenuBtn}
      onClick={onClick}
    >
      <ButtonLabel isMenuBtn={isMenuBtn}>{children}</ButtonLabel>
      {image}
    </ButtonContainer>
  )
}

BannerButton.propTypes = {
  /**
   * @property {boolean} reverse apply styles to change icon and label positions
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
  /**
   * @property {node} image renderable node to show image
   */
  image: PropTypes.node,
  /**
   * @property {function} onClick
   */
  onClick: PropTypes.func.isRequired,
  /**
   * @property {children} children renderable node
   */
  children: PropTypes.node.isRequired,
}

BannerButton.defaultProps = {
  reverse: false,
  isMenuBtn: false,
  forceMenuBtn: false,
  image: null,
}

export default BannerButton
