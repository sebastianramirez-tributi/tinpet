import { logged } from './actions'

const authInitialState = {
  loading: false,
  error: null,
  userInfo: null,
  isAuthenticated: logged,
}

export default authInitialState
