import { useEffect } from 'react'

import { popupCallback } from '../../helpers/auth'

export default () => {
  useEffect(() => {
    popupCallback()
  }, [])
  return null
}
