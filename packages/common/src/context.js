import React, { useContext } from 'react'
import { getSubdomain, getMaxTaxYear } from './helpers/collections'

export const RootContext = React.createContext()

export const useRootContext = () => useContext(RootContext)

export const getContextValue = (
  defaultSubdomain,
  subdomains = {},
  isCustomerApp = true
) => {
  const subdomain = getSubdomain ? getSubdomain() : null
  return {
    isTributi: isCustomerApp,
    MAX_TAX_YEAR: getMaxTaxYear(),
    subdomainConfig: subdomains[subdomain] ||
      subdomains[defaultSubdomain] || { key: defaultSubdomain },
  }
}
