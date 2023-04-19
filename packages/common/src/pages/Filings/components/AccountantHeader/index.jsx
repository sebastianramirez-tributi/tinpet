import React from 'react'
import PropTypes from 'prop-types'

import { useConfig } from '../../../../helpers/hooks'
import { Button, Container, Title } from './style'

function AccountantHeader({ onCreatePerson }) {
  const { denyAddPersons } = useConfig()
  return (
    <Container>
      <Title>{translate('filings.header.heading')}</Title>
      {!denyAddPersons ? (
        <Button color="primary" onClick={onCreatePerson}>
          {translate('filings.header.accountant.createClient')}
        </Button>
      ) : null}
    </Container>
  )
}

AccountantHeader.propTypes = {
  onCreatePerson: PropTypes.func.isRequired,
}

export default AccountantHeader
