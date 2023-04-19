import { connect } from 'react-redux'
import FileFinished from './content'

const mapStateToProps = ({ aranea: { file } }) => ({ file })

export default connect(mapStateToProps)(FileFinished)
