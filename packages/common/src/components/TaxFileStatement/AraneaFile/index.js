import { connect } from 'react-redux'
import {
  cleanSignatureTrace,
  flushAranea,
  setDownloadableFile,
} from '../../../redux/aranea/actions'
import AraneaFile from './content'

const mapStateToProps = ({ aranea: { araneaId, details, title } }) => ({
  araneaId,
  details,
  title,
})

const mapDispatchToProps = {
  cleanSignatureTrace,
  setDownloadableFile,
  flushAranea,
}

export default connect(mapStateToProps, mapDispatchToProps)(AraneaFile)
