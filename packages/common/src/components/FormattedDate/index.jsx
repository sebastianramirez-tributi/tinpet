import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { NoWrapValue } from './styles'

const FormattedDate = ({ date, format }) => {
  const value = date ? moment(date).format(format) : null
  return <NoWrapValue>{value}</NoWrapValue>
}

FormattedDate.propTypes = {
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment),
  ]),
  format: PropTypes.string,
}

FormattedDate.defaultProps = {
  format: 'MMM D, YYYY, h:mma',
}

export default FormattedDate
