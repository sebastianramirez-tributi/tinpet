import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'

import Filing from '../Filing'
import FilingsFilter from '../FilingsFilter'

import { Filter, Table, Header, HeaderItem } from './style'

const RESIZE_WAIT = 200

const isMobileView = () => (window ? window.innerWidth < '768' : false)

const FilingTable = ({
  filings,
  onDelete,
  onContinue,
  onChangePlan,
  onChangeYear,
  year,
}) => {
  const [renderFilings, setRenderFilings] = useState()

  const updateFilings = useCallback(() => {
    const filteredFilings =
      filings &&
      filings.filter(
        (filing) => !isMobileView() || filing.tax_year === parseInt(year)
      )
    setRenderFilings(filteredFilings)
  }, [year, filings])

  useEffect(() => {
    const debouncedUpdateFilings = debounce(updateFilings, RESIZE_WAIT)
    window.addEventListener('resize', debouncedUpdateFilings)
    return () => {
      window.removeEventListener('resize', debouncedUpdateFilings)
    }
  }, [updateFilings])

  useEffect(() => {
    updateFilings()
  }, [updateFilings])

  return (
    <>
      <Filter>
        <span>{translate('filings.table.year')}</span>
        <FilingsFilter onChange={onChangeYear} />
      </Filter>
      <Table>
        <Header>
          <HeaderItem>{translate('filings.table.taxYear')}</HeaderItem>
          <HeaderItem className="due-date">
            {translate('filings.table.dueDate')}
          </HeaderItem>
          <HeaderItem>{translate('filings.table.plan')}</HeaderItem>
          <HeaderItem>{translate('filings.table.actions')}</HeaderItem>
        </Header>
        {renderFilings &&
          renderFilings.map((filing) => (
            <Filing
              key={filing.id}
              {...filing}
              onDelete={onDelete}
              onContinue={onContinue}
              onChangePlan={() => onChangePlan(filing)}
            />
          ))}
      </Table>
    </>
  )
}

FilingTable.propTypes = {
  filings: PropTypes.array,
  onDelete: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  onChangePlan: PropTypes.func.isRequired,
  onChangeYear: PropTypes.func.isRequired,
  year: PropTypes.number.isRequired,
}

FilingTable.defaultProps = {
  filings: [],
}

export default FilingTable
