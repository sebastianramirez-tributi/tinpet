import { compose } from 'redux'
import { connect } from 'react-redux'
import { cleanStatus, getAraneaStatus } from '../../../redux/aranea/actions'
import withFeedback from '../../../HOC/withFeedback'
import FileInit from './content'

const mapStateToProps = ({
  aranea: {
    status,
    loading,
    errorMessage,
    errorTimestamp,
    type: connectionType,
  },
}) => ({
  connectionType,
  status,
  loading,
  errorMessage,
  errorTimestamp,
})
const mapDispatchToProps = { cleanStatus, getAraneaStatus }
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFeedback
)(FileInit)
