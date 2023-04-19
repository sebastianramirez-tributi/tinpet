import React, { useState, useEffect, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import Modal from 'antd/lib/modal'
import { useSelector } from 'react-redux'
import { stringFormat } from '@tributi-co/core-fe'

import { MAX_TAX_YEAR as maxYear, MIN_TAX_YEAR } from '../../constants/filings'
import ImageSupervised from '../../components/ImageSupervised'
import { Card } from '../../components/Card'
import { DrawerPerson, PersonForm } from '../../components/PersonForm'
import { usePersonalInfo, useConfig } from '../../helpers/hooks'
import { range } from '../../helpers/array'
import useFilingConfig from './useFilingConfig'
import useFilingPerson from './useFilingPerson'
import useFilings from './useFilings'
import { INITIAL_FILTER_STATE } from './useFilingFilters'
import { Container, Content } from './style'
import { overwrite } from './utils'

const Filings = ({ appName, clearMigrateFlags, clearPaymentOrderInfo }) => {
  const { personalInfo } = usePersonalInfo()
  const { role } = personalInfo

  const [personsLoaded, markPersonsLoaded] = useState(false)
  const hasComingSeason = useMemo(
    () =>
      process.env.HAS_COMING_SEASON === 'true' &&
      process.env.SHOW_NEW_SEASON_MODAL === 'true',
    []
  )

  const { MAX_TAX_YEAR } = useConfig()
  // modal to aware the user about taxable year
  useEffect(() => {
    const awarePerson = personalInfo || {}
    const awarenessKey = localStorage.getItem(`tyawareness${awarePerson.id}`)
    if (!awarenessKey && hasComingSeason)
      Modal.warning({
        title: stringFormat(translate('filings.awareness.title'), { maxYear }),
        content: stringFormat(translate('filings.awareness.content'), {
          maxYear,
        }),
        onOk: () => {
          localStorage.setItem(`tyawareness${awarePerson.id}`, true)
        },
      })
  }, [])

  const taxableYearsOptions = useMemo(
    () =>
      range(MIN_TAX_YEAR, MAX_TAX_YEAR).reduce((acc, key) => {
        acc[key] = key
        return acc
      }, {}),
    []
  )

  const {
    tableLoading,
    persons,
    filingsFiltered = [],
  } = useSelector(({ filings }) => ({
    tableLoading: filings.tableLoading,
    persons: filings.persons,
    filingsFiltered: filings.filtered,
  }))

  /**
   * This is a side effect executed when click on continue button of a filing
   */
  const continueFilingSideEffect = useCallback(() => {
    clearPaymentOrderInfo()
    clearMigrateFlags()
  }, [clearPaymentOrderInfo, clearMigrateFlags])

  const {
    formConfig,
    loadPersons,
    handleFormatFilings,
    handleFilterFilings,
    overwriteActions = {},
    Filters,
    Header,
    Table,
    Footer,
  } = useFilingConfig(`${appName}.${role}`)

  const filingPerson = useFilingPerson(loadPersons, handleFormatFilings)
  const {
    formVisible,
    formData,
    onCloseForm,
    onSubmitForm,
    onNewPerson,
    onEditPerson,
    onDeletePerson,
  } = overwrite(filingPerson, overwriteActions)

  const filingActions = useFilings(loadPersons, { continueFilingSideEffect })
  const {
    onChangePlan,
    onStartFiling,
    onContinueFiling,
    onDeleteFiling,
    onChangeSubmitStatus,
    onChange160FormSubmission,
    onChangeMustDeclareStatus,
  } = overwrite(filingActions, overwriteActions)

  const [filters, setFilters] = useState(INITIAL_FILTER_STATE)
  const [sort, setSort] = useState(false)

  useEffect(() => {
    loadPersons()
  }, [loadPersons])

  // mark persons as loaded, when persons are more than 0.
  // we cant rely on `loadPersons` to tell when the persons are loaded,
  // because maybe is a `noop` function
  useEffect(() => {
    if (filingsFiltered.length) markPersonsLoaded(true)
  }, [filingsFiltered, markPersonsLoaded])

  useEffect(() => {
    if (personsLoaded) handleFilterFilings({ filters, sort })
  }, [handleFilterFilings, filters, sort, personsLoaded])

  return (
    <>
      <DrawerPerson
        destroyOnClose
        visible={formVisible}
        width={null}
        onClose={onCloseForm}
      >
        <PersonForm
          new={!formData}
          data={formData}
          onSubmit={onSubmitForm}
          formConfig={formConfig}
        />
      </DrawerPerson>
      <div className="container">
        <Container className="row center-xs">
          <div className="col-xs-12 col-md-12 col-lg-12">
            <Card>
              <Content>
                <Header onCreatePerson={onNewPerson} />
                <Filters
                  taxableYearsOptions={taxableYearsOptions}
                  onFilter={setFilters}
                />
                <Table
                  tableLoading={tableLoading}
                  persons={persons}
                  filingsFiltered={filingsFiltered}
                  onSort={setSort}
                  onEditPerson={onEditPerson}
                  onDeletePerson={onDeletePerson}
                  onChangePlan={onChangePlan}
                  onStartFiling={onStartFiling}
                  onContinueFiling={onContinueFiling}
                  onDeleteFiling={onDeleteFiling}
                  onChangeSubmitStatus={onChangeSubmitStatus}
                  onChange160FormSubmission={onChange160FormSubmission}
                  onChangeMustDeclareStatus={onChangeMustDeclareStatus}
                />
                <Footer onCreatePerson={onNewPerson} />
              </Content>
            </Card>
          </div>
          <ImageSupervised />
        </Container>
      </div>
    </>
  )
}

Filings.propTypes = {
  appName: PropTypes.string.isRequired,
  clearMigrateFlags: PropTypes.func.isRequired,
  clearPaymentOrderInfo: PropTypes.func.isRequired,
}

export default Filings
