import React, { Component, useMemo } from 'react'
import { Button } from '@tributi-co/tributi-components'
import SectionTitle from '../SectionTitle'

import { getDeclarationStatus } from '../../../helpers/pdf-summary'
import DeclareSura from '../../GeneratePDF/DeclareSura'

import {
  SURA_DECLARE_OPTIONS,
  SURA_DECLARE_MESSAGE,
} from '../../GeneratePDF/constants'

const SummaryShouldDeclare = ({ validateDeclare, completeSura, navigate }) => {
  const printPDF = (e) => {
    e.preventDefault()
    const win = window.open(
      `${window.location.origin}/generate-pdf/summarySura`,
      '_blank'
    )
    win.focus()
  }

  const complete = (e) => {
    e.preventDefault()
    completeSura(validateDeclare.should_declare_any)
    navigate('/filings')
  }

  const data = useMemo(
    () =>
      validateDeclare
        ? getDeclarationStatus(
            {
              any: (declare) => declare.should_declare_any,
              belongings: (declare) => declare.should_declare_belongings,
              consignations: (declare) => declare.should_declare_consignations,
              purchases: (declare) => declare.should_declare_purchases,
              salary: (declare) => declare.should_declare_salary,
            },
            validateDeclare
          )
        : validateDeclare,
    [validateDeclare]
  )

  return (
    <div className={'summary_should_container'}>
      <SectionTitle
        title={''}
        subtitle={
          'Según las respuestas que indicaste, determinamos si debes declarar renta o no para el año gravable 2018.'
        }
      />
      <div className={'summary_should_content'}>
        {SURA_DECLARE_OPTIONS.map((option) => (
          <DeclareSura
            key={option}
            title={SURA_DECLARE_MESSAGE[option].title}
            detail={SURA_DECLARE_MESSAGE[option].detail}
            big={option === 'any'}
            {...data[option]}
          />
        ))}
      </div>
      <div className={'content_button_next'}>
        <Button
          fullWidth
          color="primary"
          variant="outlined"
          onClick={(e) => printPDF(e)}
        >
          <img
            className={'img_print'}
            src={'/images/icons/onboarding/nav/print.svg'}
          />
          {'Imprimir'}
        </Button>
        <Button
          fullWidth
          color="primary"
          variant="solid"
          onClick={(e) => complete(e)}
        >
          {'Terminar asesoría'}
        </Button>
      </div>
    </div>
  )
}

export default SummaryShouldDeclare
