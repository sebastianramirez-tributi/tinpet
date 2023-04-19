import React from 'react'

import IsAccountant from '../../../../components/Filings/IsAccountant'
import { useConfig } from '../../../../helpers/hooks'
import { HeaderStyled } from './style'

function Header() {
  const { denyAddPersons } = useConfig()
  return (
    <HeaderStyled>
      <h1>{translate('filings.header.heading')}</h1>
      <span>
        <IsAccountant hide>
          {translate('filings.header.taxFiler.dek')}
          {!denyAddPersons && translate('filings.header.taxFiler.dekExpanded')}
        </IsAccountant>
        <IsAccountant>
          {translate('filings.header.accountant.dek')}
        </IsAccountant>
      </span>
    </HeaderStyled>
  )
}

export default Header
