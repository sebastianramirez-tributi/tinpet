import React from 'react'
import PropTypes from 'prop-types'
import { Link } from './styles'

function ForumStaticButton({ url }) {
  return (
    <Link href={url} target="_blank" rel="noreferrer">
      {translate('forumButton.title')}
    </Link>
  )
}

ForumStaticButton.propTypes = {
  url: PropTypes.string.isRequired,
}

export default ForumStaticButton
