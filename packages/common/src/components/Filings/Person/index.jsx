import React, { useMemo, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import PopConfirm from 'antd/lib/popconfirm'
import { UserOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button } from '@tributi-co/tributi-components'

import { useConfig } from '../../../helpers/hooks'
import { PAYMENT_STATUS } from '../../../constants/payment'
import FilingTable from '../FilingTable'
import IsAccountant from '../IsAccountant'

import {
  Container,
  ContainerPerson,
  ContainerInfo,
  DeleteButton,
  ButtonsContainer,
  UpgradePlanButton,
} from './style'

const Person = ({
  id,
  isOwnPerson,
  name,
  filings,
  onEdit,
  onDelete,
  onContinueFiling,
  onDeleteFiling,
  onChangePlan,
  owner,
}) => {
  const { denyAddPersons, MAX_TAX_YEAR } = useConfig()
  const [year, setYear] = useState(MAX_TAX_YEAR)
  const filteredFilings = useMemo(
    () => filings.filter(({ kind }) => kind !== 'SDSURA'),
    [filings]
  )
  const currentFiling = useMemo(() => {
    return (
      filteredFilings &&
      filteredFilings.find(({ tax_year: taxYear }) => taxYear === year)
    )
  }, [filteredFilings, year])
  const handleChangePlanMobile = useCallback(() => {
    onChangePlan(currentFiling)
  }, [currentFiling, onChangePlan])
  const handleContinueFiling = (filingId) => onContinueFiling(id, filingId)
  const handleDeleteFiling = (filingId) => onDeleteFiling(id, filingId)
  const handleDelete = () => onDelete(id)
  const handleEdition = () => onEdit(id)

  const { payment_status: paymentStatus, product_plan: productPlan } =
    currentFiling || {}
  const { is_rush: isPlanRush } = productPlan || {}
  const isPlanPaymentApproved = paymentStatus === PAYMENT_STATUS.APPROVED

  return (
    <Container data-testid={`filing-person`}>
      <ContainerPerson>
        <ContainerInfo>
          <UserOutlined />
          <span data-testid="filing-person-name">
            <IsAccountant>
              {isOwnPerson
                ? name
                : `${owner.first_name} ${owner.last_name} (${name})`}
            </IsAccountant>
            <IsAccountant hide>{name}</IsAccountant>
          </span>
        </ContainerInfo>
        <ButtonsContainer>
          <IsAccountant hide>
            {!denyAddPersons && (
              <Button
                data-testid="filing-person-edit-button"
                onClick={handleEdition}
                size="sm"
                variant="outlined"
              >
                {translate('filings.table.edit')}
              </Button>
            )}
            {productPlan && (!isPlanPaymentApproved || !isPlanRush) && (
              <UpgradePlanButton leftIcon onClick={handleChangePlanMobile}>
                <span>{translate('filings.table.enhancePlan')}</span>
              </UpgradePlanButton>
            )}
            {!isOwnPerson && (
              <PopConfirm
                data-testid="filing-person-delete-confirm"
                cancelText={translate('filings.table.deletePerson.cancel')}
                okText={translate('filings.table.deletePerson.ok')}
                title={translate('filings.table.deletePerson.title')}
                onConfirm={handleDelete}
              >
                <DeleteButton
                  data-testid="filing-person-delete-button"
                  icon={DeleteOutlined}
                  color="danger"
                  size="md"
                  variant="outlined"
                />
              </PopConfirm>
            )}
          </IsAccountant>
        </ButtonsContainer>
      </ContainerPerson>
      <FilingTable
        filings={filteredFilings}
        onDelete={handleDeleteFiling}
        onContinue={handleContinueFiling}
        onChangePlan={onChangePlan}
        year={year}
        onChangeYear={setYear}
      />
    </Container>
  )
}

Person.propTypes = {
  filings: PropTypes.array,
  id: PropTypes.string.isRequired,
  isOwnPerson: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onChangePlan: PropTypes.func.isRequired,
  onContinueFiling: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDeleteFiling: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  owner: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }),
}

Person.defaultProps = {
  filings: [],
  owner: {},
}

export default Person
