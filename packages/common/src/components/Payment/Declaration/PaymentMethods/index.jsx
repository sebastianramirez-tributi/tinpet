import React, { useState, useCallback, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'

import { Container, Dropdown, DownOutlined } from './styles'
import ManualPayment from '../ManualPayment'

function PaymentMethods(props) {
  const [open, setOpenState] = useState(false)
  // mark when the tooltip could be visible but still need to validate with `validDate490`
  const toggleOpenState = () => setOpenState((value) => !value)

  return (
    <Container>
      <Dropdown onClick={toggleOpenState} data-testid="dropdown">
        Otros métodos de pago
        <DownOutlined rotate={open ? 180 : 0} />
      </Dropdown>
      {open && <ManualPayment {...props} />}
    </Container>
  )
}

PaymentMethods.propTypes = {
  howToPayOtherMethods: PropTypes.string.isRequired,
  downloadPaymentReceipt: PropTypes.func.isRequired,
  fetchValidDate490: PropTypes.func.isRequired,
  isPaymentReceiptLoading: PropTypes.bool.isRequired,
  validDate490: PropTypes.string,
}

PaymentMethods.defaultProps = {
  validDate490: null,
}

export default PaymentMethods
