import React, { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import { CurrentView, ProgressView, ErrorView } from './'
import { REQUEST_ATTEMPTS } from '../constants'
import { Container } from './styles'

const TaxFilePayment = ({
  taxDue,
  paymentBankList,
  getTaxFilePayment,
  taxFile490,
  downloadTaxFile,
  hiddenPaymentModal,
  isAccountantApp,
}) => {
  const [selectedBankLink, setSelectedBankLink] = useState('')
  const [progress, setProgress] = useState({
    currentProgress: 0,
    showProgress: true,
  })

  const [bankLink, setBankLink] = useState()

  const { numerado, pdfBase64, isCurrent490, attempt, payDate } =
    taxFile490 || {}

  const { currentProgress, showProgress } = progress

  const progressByStep = 100 / REQUEST_ATTEMPTS

  useEffect(() => {
    let nextProgress = currentProgress + progressByStep
    if (currentProgress === 100 && attempt === 0) {
      nextProgress = progressByStep
    }
    if (!isCurrent490 && attempt <= REQUEST_ATTEMPTS) {
      setProgress({
        showProgress: true,
        currentProgress: nextProgress,
      })
      if (
        Math.trunc(currentProgress) === Math.trunc(100 - progressByStep) &&
        attempt === REQUEST_ATTEMPTS
      ) {
        setProgress({
          showProgress: false,
          currentProgress: 100,
        })
      } else {
        getTaxFilePayment(attempt)
      }
    } else {
      setProgress({
        showProgress: false,
        currentProgress: 100,
      })
    }
  }, [isCurrent490, attempt])

  const handleChangeBank = (value) => {
    setSelectedBankLink(value)
  }

  const bankUrlFormatted = (selectedBankLink, simbol, number) => {
    return `${selectedBankLink}${simbol}numReciboPago=${number}`
  }

  const redirectToBank = useCallback(() => {
    const isBankParam = selectedBankLink.toUpperCase().indexOf('BANCO=')
    let urlBank =
      isBankParam >= 0
        ? bankUrlFormatted(selectedBankLink, '&', numerado)
        : bankUrlFormatted(selectedBankLink, '?', numerado)

    urlBank += `&urlDian=${process.env.API_URL}/payment/success`
    if (isAccountantApp) {
      setBankLink(urlBank)
      return
    }
    window.open(urlBank, 'noopener,noreferrer,_blank')
  }, [selectedBankLink, numerado])

  return (
    <Container>
      {showProgress ? (
        <ProgressView currentPercent={currentProgress} />
      ) : isCurrent490 ? (
        <CurrentView
          handleChange={handleChangeBank}
          taxDue={taxDue}
          paymentBankList={paymentBankList}
          handleClickButton={redirectToBank}
          numberId={numerado}
          downloadTaxFile={downloadTaxFile}
          pdfBase64={pdfBase64}
          currentPayDate={payDate}
          handleClose={hiddenPaymentModal}
          getTaxFilePayment={getTaxFilePayment}
          isAccountantApp={isAccountantApp}
          bankLink={bankLink}
        />
      ) : (
        !showProgress && <ErrorView handleClose={hiddenPaymentModal} />
      )}
    </Container>
  )
}

TaxFilePayment.propTypes = {
  taxDue: PropTypes.string,
  paymentBankList: PropTypes.arrayOf(
    PropTypes.shape({
      created_at: PropTypes.string,
      entity_name: PropTypes.string,
      id: PropTypes.string,
      is_active: PropTypes.bool,
      updated_at: PropTypes.string,
      url: PropTypes.string,
    })
  ),
  getTaxFilePayment: PropTypes.func.isRequired,
  taxFile490: PropTypes.shape({
    numerado: PropTypes.number,
    pdfBase64: PropTypes.string,
  }),
  downloadTaxFile: PropTypes.func.isRequired,
  hiddenPaymentModal: PropTypes.func.isRequired,
  isAccountantApp: PropTypes.bool,
}

const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.paymentBankList === nextProps.paymentBankList &&
    prevProps.taxFile490 === nextProps.taxFile490 &&
    prevProps.paymentRequestError === nextProps.paymentRequestError &&
    prevProps.showPaymentModal === nextProps.showPaymentModal
  )
}
export default React.memo(TaxFilePayment, areEqual)
