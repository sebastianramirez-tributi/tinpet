import React from 'react'
import { useNavigate } from 'react-router-dom'
import DefaultLayout from '../../layout/Main'
import { BACK_HOME } from '../../constants/strings'
import { ACCOUNTANT_FILLINGS } from '../../config/routes/constants'
import { Container, Content, Info, Title, Message, Button } from './style'

const NotFound = () => {
  const navigate = useNavigate()
  const handleBackClick = () => {
    if (sessionStorage.getItem(BACK_HOME)) {
      sessionStorage.removeItem(BACK_HOME)
      navigate(ACCOUNTANT_FILLINGS)
    } else {
      navigate(-1)
    }
  }
  return (
    <DefaultLayout>
      <div className="container">
        <Container className="row center-xs">
          <Content className="col-xs-12">
            <Info>
              <Title>{'404'}</Title>
              <Message>{'¡Página no encontrada!'}</Message>
              <Button onClick={handleBackClick}>{'Regresar'}</Button>
            </Info>
          </Content>
        </Container>
      </div>
    </DefaultLayout>
  )
}

export default React.memo(NotFound)
