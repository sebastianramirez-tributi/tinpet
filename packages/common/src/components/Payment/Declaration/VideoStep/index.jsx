import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { Frame, FrameContainer } from './styles'

function VideoStep({ videoURL }) {
  const videoSource = useMemo(() => {
    if (!videoURL) return ''
    const url = new URL(videoURL)
    if (url.host.includes('vimeo')) {
      url.host = `player.${url.host}`
      if (!url.pathname.startsWith('/video/')) {
        url.pathname = `/video${url.pathname}`
      }
    } else if (url.host.includes('loom')) {
      url.pathname = url.pathname.replace('share', 'embed')
    }
    return url.href
  }, [videoURL])
  return (
    <>
      <FrameContainer>
        <Frame
          src={videoSource}
          frameborder="0"
          webkitallowfullscreen
          mozallowfullscreen
          allowfullscreen
        ></Frame>
      </FrameContainer>
    </>
  )
}

VideoStep.propTypes = {
  videoURL: PropTypes.string.isRequired,
}

export default VideoStep
