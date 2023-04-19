import { compose } from 'redux'
import { connect } from 'react-redux'

import { clearTaxEngine } from '../../redux/payment/actions'
import {
  cleanTaxableYearConfig,
  getTaxableYearConfig,
  updateFilingDueDate,
  enableModalPreloadInfo,
  getMigrationState,
  discardMigration,
  clearMigrationErrorFlag,
  clearMigrate,
  checkLastFiling,
} from '../../redux/onboarding/actions'
import withLoading from '../../HOC/withLoader'
import OnBoarding from './content'

const mapStateToProps = ({
  onboardingReducer: {
    config,
    configLoading,
    configError,
    filingValidToMigrate,
    wasMigrated,
    migrationError,
    hasMigratedAnswers,
  },
  general: { loadingCount },
}) => ({
  config,
  configLoading,
  configError,
  loadingCount,
  filingValidToMigrate,
  wasMigrated,
  migrationError,
  hasMigratedAnswers,
})

const mapDispatchToProps = {
  checkLastFiling,
  cleanTaxableYearConfig,
  clearTaxEngine,
  getTaxableYearConfig,
  updateFilingDueDate,
  enableModalPreloadInfo,
  getMigrationState,
  discardMigration,
  clearMigrationErrorFlag,
  clearMigrate,
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withLoading
)(OnBoarding)
