import React from 'react'
import { Card, CardBody } from '../../Card'
import Header from '../Header'
import DeclareSura from '../DeclareSura'
import { Container, Divider, ContainerInfo, Print } from './style'

import { useUserInfo } from '../../../helpers/hooks'

import {
  SURA_DECLARE_OPTIONS,
  SURA_DECLARE_MESSAGE,
  SURA_HEADER_TITLE,
} from '../constants'

const SummarySura = ({ context, data = [] }) => {
  const userInfo = useUserInfo()
  return (
    <div className="container">
      <Container className="row center-xs">
        <div className="col-xs-12 col-md-10 col-lg-12">
          <Card>
            <CardBody>
              <Print className="row">
                {userInfo && <Header title={SURA_HEADER_TITLE} {...userInfo} />}
                <Divider className="col-xs-12" />
                <ContainerInfo className="col-xs-12">
                  <p>
                    {
                      'Según las respuestas que indicaste, determinamos si debes declarar renta o no para el año gravable 2018.'
                    }
                  </p>
                  {SURA_DECLARE_OPTIONS.map((option) => (
                    <DeclareSura
                      key={option}
                      title={SURA_DECLARE_MESSAGE[option].title}
                      detail={SURA_DECLARE_MESSAGE[option].detail}
                      big={option === 'any'}
                      {...data[option]}
                    />
                  ))}
                </ContainerInfo>
              </Print>
            </CardBody>
          </Card>
        </div>
      </Container>
    </div>
  )
}

export default SummarySura
