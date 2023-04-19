import { compose } from 'redux'
import { connect } from 'react-redux'
import withRouter from '../../HOC/withRouter'
import { update } from '../../redux/form/actions'
import withPersonalInfo from '../../HOC/withPersonalInfo'
import CreateFillingPage from './content'

const mapStateToProps = ({ registerReducer }) => ({
  error: registerReducer.errorUpdate,
  userInfo: registerReducer.userInfo,
  updateUser: registerReducer.updateUser,
})

const mapDispatchToProps = {
  update,
}

export default compose(
  withRouter,
  withPersonalInfo,
  connect(mapStateToProps, mapDispatchToProps)
)(CreateFillingPage)
