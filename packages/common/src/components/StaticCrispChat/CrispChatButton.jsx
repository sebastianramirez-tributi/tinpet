import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { Button } from './styles'

const CRISP_STATIC_CHAT_BASE = 'https://go.crisp.chat/chat/embed/?website_id='

const CrispChatButton = ({ websiteId }) => {
  const link = useMemo(() => CRISP_STATIC_CHAT_BASE + websiteId, [websiteId])
  return <Button as="a" target="_blank" rel="noopener noreferrer" href={link} />
}

CrispChatButton.propTypes = {
  websiteId: PropTypes.string.isRequired,
}

export default CrispChatButton
