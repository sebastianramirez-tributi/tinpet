import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Select from 'antd/lib/select'
import { range } from '../../../helpers/array'
import { MIN_TAX_YEAR } from '../../../constants/filings'
import { useConfig } from '../../../helpers/hooks'
import { SelectInput } from './style'

const { Option } = Select

const FilingsFilter = ({ onChange }) => {
  const { MAX_TAX_YEAR } = useConfig()
  const TAXABLE_YEARS = useMemo(
    () => range(MIN_TAX_YEAR, MAX_TAX_YEAR),
    [MAX_TAX_YEAR]
  )
  return (
    <SelectInput
      data-testid="filing-filter"
      size="small"
      onChange={(value) => onChange(value)}
      defaultValue={MAX_TAX_YEAR}
    >
      {TAXABLE_YEARS.map((year) => (
        <Option data-testid="filing-filter-option" key={year} value={year}>
          {year}
        </Option>
      ))}
    </SelectInput>
  )
}

FilingsFilter.propTypes = {
  onChange: PropTypes.func.isRequired,
}

export default FilingsFilter
