import { compose } from 'redux'
import { connect } from 'react-redux'
import ESignAwareness from './content'
import { createFileProcess } from '../../../redux/aranea/actions'
import withFeedback from '../../../HOC/withFeedback'

const mapStateToProps = ({
  aranea: {
    signProcessSignatureEnabled,
    loading,
    errorMessage,
    errorTimestamp,
    nationalId,
  },
}) => ({
  signProcessSignatureEnabled,
  nationalId,
  loading,
  errorMessage,
  errorTimestamp,
})

const mapDispatchToProps = {
  createFileProcess,
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFeedback
)(ESignAwareness)
