import React, { useEffect, useRef } from 'react'
const HEIGHT_ARRANGEMENT_DELAY = 200

const ScrollView = ({ children, enabled }) => {
  const scrollRef = useRef(null)
  useEffect(() => {
    if (enabled) {
      // It will be executed in the next stack of events since
      // we are getting back to the top of the page and we need to
      // the element if it's required.
      setTimeout(() => {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' })
      }, HEIGHT_ARRANGEMENT_DELAY)
    }
  }, [enabled])
  return <div ref={scrollRef}>{children}</div>
}

export default ScrollView
