import { compose } from 'redux'
import { connect } from 'react-redux'
import withFeedback from '../../../HOC/withFeedback'
import { createFileProcess } from '../../../redux/aranea/actions'
import ESignInput from './content'

const mapStateToProps = ({
  aranea: {
    errorMessage,
    errorTimestamp,
    loading,
    signProcessSignatureEnabled,
    signaturePasssword,
  },
}) => ({
  loading,
  errorMessage,
  errorTimestamp,
  signProcessSignatureEnabled,
  signaturePasssword,
})

const mapDispatchToProps = {
  createFileProcess,
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFeedback
)(ESignInput)
