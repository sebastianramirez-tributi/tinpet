import { connect } from 'react-redux'

import { summary, getSummarySura } from '../../redux/onboarding/actions'
import GeneratePDF from './content'

const mapStateToProps = ({ onboardingReducer }) => ({
  summaryData: onboardingReducer.summaryData,
})

const mapDispatchToProps = {
  summary,
  getSummarySura,
}

export default connect(mapStateToProps, mapDispatchToProps)(GeneratePDF)
