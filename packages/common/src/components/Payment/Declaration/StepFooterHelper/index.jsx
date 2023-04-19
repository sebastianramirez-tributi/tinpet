import React from 'react'
import PropTypes from 'prop-types'
import { StepFooterHelperItem, StepFooterHelperLink } from './styles'

function StepFooterHelper({ link, text }) {
  return (
    <StepFooterHelperItem>
      <StepFooterHelperLink
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </StepFooterHelperLink>
    </StepFooterHelperItem>
  )
}

StepFooterHelper.propTypes = {
  link: PropTypes.string.isRequired,
  text: PropTypes.string,
}

StepFooterHelper.defaultProps = {
  link: '',
  text: '',
}

export default StepFooterHelper
