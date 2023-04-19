import { createBrowserHistory } from 'history'

import { createPreservedQueryHistory } from './helpers/query-history'

const history = createPreservedQueryHistory(createBrowserHistory, [
  'coming_soon',
  'enable_belvo',
])()

export default history
