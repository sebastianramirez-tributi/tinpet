import React, { forwardRef } from 'react'

import { usePersonalInfo } from '../helpers/hooks'

const withPersonalInfo = (Component) =>
  forwardRef(function WithPersonalInfoComponent(props, ref) {
    const personalInfo = usePersonalInfo()
    return <Component {...props} {...personalInfo} ref={ref} />
  })

export default withPersonalInfo
