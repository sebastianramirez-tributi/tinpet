import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { getDeclarationStatus } from '../../helpers/pdf-summary'
import { usePersonalInfo } from '../../helpers/hooks'
import { SummaryApp, SummarySura } from '../../components/GeneratePDF'

const GeneratePDF = ({ summaryData, context, ...props }) => {
  const { personalInfo } = usePersonalInfo()
  const params = useParams()
  const { currentFiling } = personalInfo
  const isSURA = params.type === 'summarySura'

  useEffect(() => {
    if (currentFiling) {
      const { type } = params
      if (type === 'summary') props.summary(currentFiling.id)
      else if (isSURA) props.getSummarySura(currentFiling.id)
    }
  }, [currentFiling])

  const data = useMemo(
    () =>
      isSURA && summaryData
        ? getDeclarationStatus(
            {
              any: (declare) => declare.should_declare_any,
              belongings: (declare) => declare.should_declare_belongings,
              consignations: (declare) => declare.should_declare_consignations,
              purchases: (declare) => declare.should_declare_purchases,
              salary: (declare) => declare.should_declare_salary,
            },
            summaryData
          )
        : summaryData,
    [summaryData]
  )

  if (isSURA) {
    return <SummarySura context={context} data={data} />
  }

  return <SummaryApp context={context} data={data} />
}

export default GeneratePDF
