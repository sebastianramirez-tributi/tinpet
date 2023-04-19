import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@tributi-co/tributi-components'

import { Expandable, Sort } from './style'

const ExpandableMessage = ({ message }) => {
  const [showAllMessage, setShow] = useState(false)
  const sortMessage = message.replace('<p>', '')

  return (
    <>
      {message && showAllMessage ? (
        <Expandable>
          <div
            dangerouslySetInnerHTML={{
              __html: message,
            }}
          />
          <Button size="sm" onClick={() => setShow(false)}>
            Mostrar menos
          </Button>
        </Expandable>
      ) : (
        <Expandable>
          <Sort>{sortMessage}</Sort>
          <Button size="sm" onClick={() => setShow(true)}>
            Mostrar más
          </Button>
        </Expandable>
      )}
    </>
  )
}

ExpandableMessage.propTypes = {
  /**
   * Message to show
   */
  message: PropTypes.string.isRequired,
}

ExpandableMessage.defaultProps = {
  message: '',
}

export default ExpandableMessage
