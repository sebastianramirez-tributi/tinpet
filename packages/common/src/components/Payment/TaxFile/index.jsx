import React, { Fragment } from 'react'
import {
  StyledButton,
  Title,
  Text,
  ContainerButton,
  ContainerText,
} from './style'

const TaxFile = ({ filing_info, goBack, openFile }) => {
  const is_assisted = filing_info.is_assisted || filing_info.is_rush

  return (
    <Fragment>
      <div className="row">
        {is_assisted ? (
          <Text>
            Aquí puedes descargar un borrador del formulario de tu declaración
            de renta, por si quieres revisarlo, Sin embargo, el formulario final
            100% diligenciado y listo para llevar al banco lo recibirás en un
            correo de parte de &nbsp;
            {filing_info.is_rush ? (
              <label>camilo@tributi.com</label>
            ) : (
              <label>roberto@tributi.com</label>
            )}
            .
          </Text>
        ) : (
          <Fragment>
            <ContainerText className="col-xs-12 col-lg-7">
              <Title>
                {'¡Tu declaración de renta ya está diligenciada y optimizada!'}
              </Title>
              <Text>
                En este momento la página de la DIAN está congestionada y solo
                podemos entregarte un borrador de tu declaración. Por favor
                revísalo e intenta de nuevo en 10 minutos para que descargues tu
                declaración de renta lista para ser llevada al banco.
              </Text>
            </ContainerText>
            <iframe
              className="col-xs-12 col-lg-5"
              src="https://www.youtube.com/embed/0fsCjde78R4"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </Fragment>
        )}
      </div>
      <ContainerButton className="row center-xs">
        <StyledButton fullWidth onClick={goBack} size="lg" variant="outlined">
          Editar mi información
        </StyledButton>
        <StyledButton fullWidth onClick={openFile} size="lg">
          Descargar Borrador
        </StyledButton>
      </ContainerButton>
    </Fragment>
  )
}

export default TaxFile
