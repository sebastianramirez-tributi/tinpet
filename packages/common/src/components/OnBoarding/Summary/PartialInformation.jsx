import React from 'react'
import PropTypes from 'prop-types'
import { ToolOutlined } from '@ant-design/icons'
import { PartialList, SummaryHeader } from './styles'

function PartialInformation({ partialData, goToTab }) {
  return (
    <SummaryHeader>
      <h5 className="title">
        <ToolOutlined />
        {translate('filings.onboarding.summary.pendingQuestions')}
      </h5>
      <section className="subtitle__container">
        <p className="subtitle">
          {translate('filings.onboarding.summary.pendingQuestionsDek')}
        </p>
        <PartialList>
          {partialData.map(({ tabCode, tabName }) => (
            <li key={tabName}>
              <a role="button" onClick={goToTab(tabCode)}>
                {tabName}
              </a>
            </li>
          ))}
        </PartialList>
      </section>
    </SummaryHeader>
  )
}

PartialInformation.propTypes = {
  partialData: PropTypes.arrayOf(PropTypes.object),
  goToTab: PropTypes.func,
}

export default PartialInformation
