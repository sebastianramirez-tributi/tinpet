import { connect } from 'react-redux'

import BelvoSectionItem from './BelvoSectionItem'
import {
  getStatus,
  setStatus,
  setInstance,
  getToken,
  clearTokens,
  clear,
  registerBelvoLink,
  deleteConnection,
  cancelPendingConnection,
  logBelvoError,
} from '../../../redux/belvo/actions'

const mapStateToProps = ({
  belvo: {
    status,
    statusCode,
    date,
    linkId,
    refreshToken,
    accessToken,
    institution,
    firebaseId,
    file,
    fileStatus,
    instanceId,
  },
}) => ({
  status,
  statusCode,
  date,
  linkId,
  refreshToken,
  accessToken,
  institution,
  firebaseId,
  file,
  fileStatus,
  instanceId,
})

const dispatchToProps = {
  getStatus,
  setStatus,
  setInstance,
  getToken,
  clearTokens,
  clear,
  registerBelvoLink,
  deleteConnection,
  cancelPendingConnection,
  logBelvoError,
}

export default connect(mapStateToProps, dispatchToProps)(BelvoSectionItem)
