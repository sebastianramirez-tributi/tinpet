import React, { useMemo } from 'react'
import { Card, CardBody } from '../../Card'
import Header from '../Header'
import Section from '../Section'

import { useUserInfo } from '../../../helpers/hooks'
import { Container, Divider } from './style'
import { APP_HEADER_TITLE, APP_HEADER_SUBTITLE } from '../constants'

const SummaryApp = ({ data = [] }) => {
  const userInfo = useUserInfo()
  const tabs = useMemo(() => {
    return (
      data &&
      data
        .filter((item) => item.type === 'tab')
        .map((tab) => {
          const children = data
            .filter(
              (item) => item.type === 'group' && item.code.startsWith(tab.code)
            )
            .map((group) => group.instances)
            .flat()
          return { ...tab, children }
        })
    )
  }, [data])
  return (
    <div className="container">
      <Container className="row center-xs">
        <div className="col-xs-12 col-md-10 col-lg-12">
          <Card>
            <CardBody>
              <div className="row">
                {userInfo && (
                  <Header
                    title={APP_HEADER_TITLE}
                    subtitle={APP_HEADER_SUBTITLE}
                    {...userInfo}
                  />
                )}
                <Divider />
                <div className="col-xs-12">
                  {tabs.map((tab) => (
                    <Section key={tab.code} {...tab} />
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </Container>
    </div>
  )
}

export default SummaryApp
