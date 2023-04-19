import { connect } from 'react-redux'

import {
  getQuestionAndAnswers,
  saveAnswers,
  summary,
} from '../../../redux/onboarding/actions'
import Layout from './layout'

const mapStateToProps = ({ onboardingReducer: onboarding }) => ({
  answeredQuestions: onboarding.answeredQuestions,
  answeredQuestionsUpdatedAt: onboarding.answeredQuestionsUpdatedAt,
  certificatesUpdates: onboarding.certificatesUpdates,
})

export default connect(mapStateToProps, {
  getQuestionAndAnswers,
  saveAnswers,
  summary,
})(Layout)
