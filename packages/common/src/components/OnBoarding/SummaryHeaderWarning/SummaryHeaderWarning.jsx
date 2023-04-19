import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { AFFIRMATIVE } from '../../../constants/strings'
import SummaryHeaderWarningTitle from './SummaryHeaderWarningTitle'
import SummaryHeaderWarningItem from './SummaryHeaderWarningItem'
import { HeaderWarning } from './styles'

const DEFAULT_ERROR_MARKUP = translate(
  'filings.onboarding.summary.defaultError.markup'
)

function SummaryHeaderWarning({
  filing,
  taxEngineCreationDate,
  getMultipleAnswers,
  ignoreEngineErrorWithInput,
  config,
  ...props
}) {
  const {
    id: filingId,
    last_engine_status_code: errorCode,
    last_engine_status_message: errorHtml,
  } = filing || {}

  const parsedErrorCode = parseInt(errorCode) || errorCode

  const errorIgnorable = useMemo(() => {
    return config.some((item) => item.errorCodes.includes(parsedErrorCode))
  }, [parsedErrorCode, config])

  // used to fetch ignorable tax inputs after any of them changes
  const [refetchData, setRefetchData] = useState(Date.now())

  // creates an array with length equals to config and false values
  const [ignoreStatus, setIgnoreStatus] = useState(
    Array(config.length).fill(false)
  )

  const taxEngineDate = useMemo(
    () =>
      taxEngineCreationDate
        ? moment(taxEngineCreationDate, 'YYYY-MM-DDTHH:mmZ').format(
            '(hh:mma DD/MM/YYYY)'
          )
        : '',
    [taxEngineCreationDate]
  )

  const handleIgnoreError = async (code, shouldIgnore) => {
    await ignoreEngineErrorWithInput(filingId, code, shouldIgnore)
    setRefetchData(Date.now())
  }

  useEffect(() => {
    const asyncEffect = async () => {
      const codes = config.map((item) => item.code)
      const result = await getMultipleAnswers(codes, filingId)
      const codeAnswerMap = Object.fromEntries(
        result.map((answer) => [answer.code, answer.value])
      )
      const newIgnoreStatus = config.map(
        (item) => codeAnswerMap[item.code] === AFFIRMATIVE
      )
      setIgnoreStatus(newIgnoreStatus)
    }
    asyncEffect()
  }, [filingId, getMultipleAnswers, setIgnoreStatus, refetchData, config])

  if (!filing) return null

  return (
    <HeaderWarning {...props} data-testid="summary-header-warning">
      {!errorIgnorable && parsedErrorCode ? (
        <SummaryHeaderWarningTitle
          showError
          errorHtml={errorHtml || DEFAULT_ERROR_MARKUP}
          title={`Encontramos un error en la declaración ${taxEngineDate}`}
        />
      ) : null}

      {config.map((item, index) => (
        <SummaryHeaderWarningItem
          {...item}
          key={item.code}
          isIgnored={ignoreStatus[index]}
          engineErrorHtml={errorHtml || DEFAULT_ERROR_MARKUP}
          engineErrorCode={parsedErrorCode}
          taxEngineDate={taxEngineDate}
          onIgnoreError={handleIgnoreError}
        />
      ))}
    </HeaderWarning>
  )
}

SummaryHeaderWarning.propTypes = {
  config: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
      errorCodes: PropTypes.arrayOf(PropTypes.number).isRequired,
    })
  ),
  filing: PropTypes.shape({
    id: PropTypes.string,
    last_engine_status_code: PropTypes.string,
    last_engine_status_message: PropTypes.string,
  }),
  taxEngineCreationDate: PropTypes.string,
  getMultipleAnswers: PropTypes.func.isRequired,
  ignoreEngineErrorWithInput: PropTypes.func.isRequired,
}

SummaryHeaderWarning.defaultProps = {
  filing: null,
  config: [],
  taxEngineCreationDate: '',
}

export default SummaryHeaderWarning
