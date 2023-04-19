import React, { Fragment } from 'react'
import {
  CardUser,
  Text,
  Title,
  Divider,
  ContainerHeader,
  Button,
  ButtonSmall,
  CardInfo,
} from './style'
const Header = ({
  title,
  subtitle,
  firstName,
  lastName,
  documentId,
  phone,
  email,
}) => {
  return (
    <Fragment>
      <ContainerHeader className="col-xs-12 col-md-12">
        <CardUser>
          <div>
            <img src="/images/icons/user-icon.png" alt="User icon" />
            <Divider />
            <ul>
              <li>
                {firstName} {lastName}
              </li>
              <li>{documentId}</li>
              <li>{phone}</li>
              <li>{email}</li>
            </ul>
          </div>
          <ButtonSmall onClick={print}>
            <img src="/images/icons/print.png" alt="Button icon" />
          </ButtonSmall>
        </CardUser>
        <CardInfo>
          <div>
            <img src="/images/tributi.png" alt="Tributi" />
            <Text>{title}</Text>
            <p>{subtitle}</p>
          </div>
          <Button onClick={print}>
            <img src="/images/print-hover.png" alt="Button icon" />
            {'Imprimir'}
          </Button>
        </CardInfo>
      </ContainerHeader>
      <div className="col-xs-12 col-md-12">
        <Title>{title}</Title>
      </div>
    </Fragment>
  )
}

export default Header
