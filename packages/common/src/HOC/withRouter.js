import React from 'react'
import { useLocation, useParams, useNavigate, useMatch } from 'react-router-dom'

const withRouter = (Component) => {
  return function Wrapper(props) {
    const navigate = useNavigate()
    const params = useParams()
    const location = useLocation()

    return (
      <Component
        navigate={navigate}
        params={params}
        location={location}
        {...props}
      />
    )
  }
}

export default withRouter
