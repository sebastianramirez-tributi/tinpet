import { connect } from 'react-redux'
import InPersonFile from './content'

const mapStateToProps = ({ paymentReducer }) => ({
  loadingFile: paymentReducer.loadingLithographic,
  fileFiled: paymentReducer.documents.declaration,
})

export default connect(mapStateToProps)(InPersonFile)
