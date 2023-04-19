import React from 'react'
import PropTypes from 'prop-types'

import { ROLES } from '../../../constants/person'
import { TAX_YEAR_VIDEO_FROM, PLANS } from '../../../constants/filings'
import { Card, CardBody } from '../../Card'
import { usePersonalInfo } from '../../../helpers/hooks'
import RegularPlan from './regular-plan'
import AssistedPlan from './assisted-plan'
import RegularPlanVideo from './regular-plan-video'
import { Container, ContainerInfoPlan, ImageCard } from './style'

const Welcome = ({ letsStart }) => {
  const { personalInfo } = usePersonalInfo()
  // we don't need to re-fetch filing since we are fetching that info in OB component
  const { currentFiling } = personalInfo || {}
  const {
    scheduling,
    tax_year: taxYear,
    product_plan: productPlan,
  } = currentFiling || {}
  const { is_assisted: isAssisted = false } = productPlan || {}
  const isUser = personalInfo.role === ROLES.TAX_FILER
  const isPlanName = productPlan ? productPlan.name : {}

  if (isUser && scheduling && isAssisted) {
    return (
      <Card>
        <CardBody>
          <Container>
            <ContainerInfoPlan>
              <AssistedPlan letsStart={letsStart} scheduling={scheduling} />
            </ContainerInfoPlan>
            <ImageCard src="/images/home-onboarding.png" />
          </Container>
        </CardBody>
      </Card>
    )
  }
  const showVideo =
    isPlanName === PLANS.EXPRESS || isPlanName === PLANS.STANDARD

  // Maria: Pending hide video to personal finances
  if (taxYear >= TAX_YEAR_VIDEO_FROM && showVideo) {
    return (
      <Card>
        <CardBody>
          <RegularPlanVideo letsStart={letsStart} />
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardBody>
        <Container>
          <ContainerInfoPlan>
            <RegularPlan letsStart={letsStart} />
          </ContainerInfoPlan>
          <ImageCard src="/images/home-onboarding.png" />
        </Container>
      </CardBody>
    </Card>
  )
}

Welcome.propTypes = {
  letsStart: PropTypes.func.isRequired,
}

export default Welcome
