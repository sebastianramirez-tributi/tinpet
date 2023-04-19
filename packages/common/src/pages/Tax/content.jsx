import React, { useState, useEffect, useMemo, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

import { usePersonalInfo } from '../../helpers/hooks'
import { capitalizeFirstLetter, formatPrice } from '../../helpers/collections'
import { Card, CardBody } from '../../components/Card'
import { NotFoundService } from '../../components/Payment'
import {
  Container,
  Title,
  Text,
  ContainerText,
  Image,
  Row,
  TableService,
  Description,
  ServiceTitle,
  StyledButton,
} from './style'

import { PAYMENT_STATUS } from '../../constants/payment'

const TaxPaymentList = (props) => {
  const {
    taxInfo = [],
    taxReceiveInfo,
    createPaymentOrder,
    loading,
    payment_order,
  } = props
  const [goback, setgoBack] = useState(false)
  const { personalInfo } = usePersonalInfo()
  const name = useMemo(() => {
    const { first_name: name } = personalInfo
    return capitalizeFirstLetter(name)
  }, [])

  const navigate = useNavigate()

  useEffect(() => {
    taxReceiveInfo()
  }, [])

  useEffect(() => {
    if (goback && payment_order && payment_order.id) {
      const { status } = { ...payment_order }
      const route = {
        [PAYMENT_STATUS.APPROVED]: 'success',
        [PAYMENT_STATUS.DECLINED]: 'error',
        [PAYMENT_STATUS.CANCELLED]: 'error',
        [PAYMENT_STATUS.PENDING]: 'pending',
        [PAYMENT_STATUS.CREATED]: 'payment',
      }
      navigate(`/services/${route[status]}/${payment_order.id}`)
    }
  }, [payment_order])

  const createOrder = async (id) => {
    try {
      setgoBack(true)
      await createPaymentOrder(id)
    } catch (e) {
      console.warn(e)
    }
  }

  const columnConfig = () => {
    const actionState = {
      [PAYMENT_STATUS.APPROVED]: {
        button: 'Detalle',
        description: 'Pagado',
        appearance: 'outlined',
      },
      [PAYMENT_STATUS.CANCELLED]: {
        button: 'Pagar',
        description: 'Cancelado',
      },
      [PAYMENT_STATUS.DECLINED]: {
        button: 'Pagar',
        description: 'Rechazado',
      },
      [PAYMENT_STATUS.PENDING]: {
        button: 'Detalle',
        description: 'Pendiente',
      },
      [PAYMENT_STATUS.CREATED]: {
        button: 'Pagar',
        description: 'Creado',
      },
    }
    return [
      {
        title: 'Tramite',
        key: 'service',
        render: ({ product, status }) => (
          <Fragment>
            <ServiceTitle>{product.name}</ServiceTitle>
            <Description>{actionState[status].description}</Description>
          </Fragment>
        ),
      },
      {
        title: 'Precio',
        key: 'price',
        render: (service) => <span>${formatPrice(service.price)}</span>,
      },
      {
        title: 'Estado',
        key: 'state',
        render: (service) => (
          <span>{actionState[service.status].description}</span>
        ),
      },
      {
        key: 'action',
        render: (service) => (
          <StyledButton
            onClick={() => createOrder(service.id)}
            variant={actionState[service.status].appearance}
          >
            {actionState[service.status].button}
          </StyledButton>
        ),
      },
    ]
  }
  return (
    <div className="container">
      <Container className="row center-xs">
        <div className="col-xs-12 col-md-10 col-lg-12">
          <Card>
            <CardBody>
              {taxInfo.length > 0 ? (
                <Fragment>
                  <Row className="row center-xs">
                    <ContainerText className="col-xs-12 col-lg-7">
                      <Title>{'Tramites'}</Title>
                      <Text>
                        Hola {name}, está es la lista de tramites asociados a tu
                        cuenta en Tributi.
                      </Text>
                      <TableService
                        rowKey={(columns) => columns.id}
                        columns={columnConfig()}
                        dataSource={taxInfo}
                        pagination={{
                          hideOnSinglePage: true,
                        }}
                      />
                    </ContainerText>
                    <Image
                      className="col-lg-5"
                      src={'/images/elaboracion.svg'}
                    />
                  </Row>
                </Fragment>
              ) : (
                !loading && <NotFoundService name={name} />
              )}
            </CardBody>
          </Card>
        </div>
      </Container>
    </div>
  )
}

export default TaxPaymentList
