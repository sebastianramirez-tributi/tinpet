import { compose } from 'redux'
import { connect } from 'react-redux'
import FileSignInit from './content'
import {
  cleanStatus,
  createFileProcess,
  getElectronicSignatureValue,
} from '../../../redux/aranea/actions'
import withFeedback from '../../../HOC/withFeedback'

const mapStateToProps = ({
  aranea: {
    signProcessSignatureEnabled,
    loading,
    errorMessage,
    errorTimestamp,
    nationalId,
    nationalIdType,
    hasElectronicSignature,
  },
  general: { constants },
}) => ({
  signProcessSignatureEnabled,
  nationalId,
  nationalIdType,
  loading,
  errorMessage,
  errorTimestamp,
  constants,
  hasElectronicSignature,
})

const mapDispatchToProps = {
  cleanStatus,
  createFileProcess,
  getElectronicSignatureValue,
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFeedback
)(FileSignInit)
