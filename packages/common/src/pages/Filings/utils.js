import PropTypes from 'prop-types'

export const noop = () => null

export const getInputValue = ({ target: { value } }) => value

export const getDateInputValue = (value, format) =>
  value && value.format(format)

export const overwrite = (originalActions = {}, overwriteActions = {}) =>
  Object.keys(overwriteActions).reduce(
    (actions, current) => ({
      ...actions,
      [current]: (...args) =>
        overwriteActions[current](originalActions[current], ...args),
    }),
    originalActions
  )

export const FILTER_PROP_TYPES = {
  taxableYearsOptions: PropTypes.object.isRequired,
  onFilter: PropTypes.func.isRequired,
}

export const TABLE_PROP_TYPES = {
  persons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      is_own_person: PropTypes.bool,
    }).isRequired
  ).isRequired,
  filingsFiltered: PropTypes.array.isRequired,
  tableLoading: PropTypes.bool.isRequired,
  onSort: PropTypes.func.isRequired,
  onEditPerson: PropTypes.func.isRequired,
  onDeletePerson: PropTypes.func.isRequired,
  onStartFiling: PropTypes.func.isRequired,
  onContinueFiling: PropTypes.func.isRequired,
  onDeleteFiling: PropTypes.func.isRequired,
  onChangeSubmitStatus: PropTypes.func.isRequired,
}
