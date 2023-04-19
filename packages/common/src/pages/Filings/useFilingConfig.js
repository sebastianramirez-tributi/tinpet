import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'

import { startLoading, stopLoading } from '../../redux/general/actions'
import { captureSentryException } from '../../sentry'
import { noop } from './utils'

/**
 * Loads filing config
 *
 * @typedef {Object} FilingConfig
 * @property {array} FilingConfig.formConfig form configuration
 * @property {Function} FilingConfig.loadPersons load, prepare and format person and filing data if needed. Should be called when want to refresh filings data
 * @property {Function} FilingConfig.handleFormatFilings format filings data
 * @property {Function} FilingConfig.handleFilterFilings filter filings data by filter and sort params
 * @property {Function} FilingConfig.Header component
 * @property {Function} FilingConfig.Filters component
 * @property {Function} FilingConfig.Table component
 * @property {Function} FilingConfig.Footer component
 *
 * @param {string} configName is composed by "`app`.`role`" and is used to import config file
 * @returns {FilingConfig} filing config, at some point component and functions are noop
 */
const useFilingConfig = (configName) => {
  const dispatch = useDispatch()
  const [config, setConfig] = useState(null)

  const { formConfig, Filters, Table, Footer, Header } = useMemo(() => {
    const {
      formConfig = [],
      Header = noop,
      Filters = noop,
      Table = noop,
      Footer = noop,
    } = config || {}

    return {
      formConfig,
      Header,
      Filters,
      Table,
      Footer,
    }
  }, [config])

  const {
    loadPersons,
    handleFormatFilings,
    handleFilterFilings,
    overwriteActions,
  } = useMemo(() => {
    const {
      getLoadPersons,
      getFormatFilings,
      getFilterFilings,
      getOverwriteActions,
    } = config || {}

    return {
      loadPersons:
        config && getLoadPersons ? getLoadPersons({ dispatch }) : noop,
      handleFormatFilings:
        config && getFormatFilings ? getFormatFilings({ dispatch }) : noop,
      handleFilterFilings:
        config && getFilterFilings ? getFilterFilings({ dispatch }) : noop,
      overwriteActions:
        config && getOverwriteActions ? getOverwriteActions({ dispatch }) : {},
    }
  }, [config, dispatch])

  useEffect(() => {
    const asyncEffect = async () => {
      try {
        dispatch(startLoading())
        const module = await import(`./config/${configName}`)
        dispatch(stopLoading())
        setConfig(module)
      } catch (error) {
        captureSentryException(error)
      }
    }

    asyncEffect()
  }, [])

  return {
    formConfig,
    loadPersons,
    handleFormatFilings,
    handleFilterFilings,
    overwriteActions,
    Header,
    Filters,
    Table,
    Footer,
  }
}

export default useFilingConfig
