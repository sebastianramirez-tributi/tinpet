import React, { Fragment } from 'react'
import { useUserInfo } from '../../../helpers/hooks'
import {
  Header,
  Container,
  ContainerInfo,
  ContainerText,
  Card,
  TextStrong,
  Text,
  Step,
  Number,
  ImageSura,
  TextSecondary,
  ImageCall,
  Paragraph,
  Print,
  Image,
  Logo,
  Footer,
} from './style'

const textCards = [
  `Ingresa, haz click en “Comencemos” y responde unas breves preguntas sobre tus bienes,
  ingresos, deudas y deducciones. No necesitas tener ningún documento`,
  `Termina las preguntas, verás una lista personalizada con todos los documentos que
   necesitas para tu declaración e instrucciones de cómo obtenerlos.`,
  `Una vez tengas tus documentos, ingresa nuevamente a la plataforma y carga tu información.`,
  `Finalmente, haz click en el botón “Elaborar declaración” y recibirás tu declaración de renta
    en un promedio de 3 horas y máximo 2 días hábiles.`,
]

const SuraInfo = () => {
  const userInfo = useUserInfo()

  return (
    <div className="container">
      <Container className="row">
        <div className="col-xs-12 col-md-12">
          <ContainerInfo>
            <Card>
              <Header>
                <Fragment>
                  <Text>
                    Ya estás más cerca de tener lista
                    <strong>
                      {' '}
                      tu declaración de renta con garantía de por vida,
                    </strong>{' '}
                    gracias a la alianza:
                  </Text>
                </Fragment>
                <img src="/images/tributi-sura-logo.svg" />
                <TextStrong>
                  {'Para terminar el proceso, sigue estos pasos:'}
                </TextStrong>
              </Header>
              <Step>
                <Number>{'1'}</Number>
                <ContainerText>
                  <Paragraph>{'Desde un computador, ingresa a:'}</Paragraph>
                  <TextSecondary>{'segurosexito.tributi.com'}</TextSecondary>
                </ContainerText>
                <Image src="/images/sura-check.svg" />
              </Step>
              <Step>
                <Number>{'2'}</Number>
                <ContainerText>
                  <TextSecondary>
                    {
                      'Haz click en “Ingresa acá”, e inicia sesión con tus datos personales:'
                    }
                  </TextSecondary>
                  <div>
                    <Text>{'Usuario:'}</Text>
                    <Text>{userInfo.email}</Text>
                  </div>
                  <div>
                    <Text>{'Contraseña:'}</Text>
                    <Text>{userInfo.documentId}</Text>
                  </div>
                </ContainerText>
                <Image src="/images/sura-check.svg" />
              </Step>
              {textCards.map((text, index) => {
                return (
                  <Step key={index}>
                    <Number>{index + 3}</Number>
                    <TextSecondary>{text}</TextSecondary>
                    <Image src="/images/sura-check.svg" />
                  </Step>
                )
              })}
              <Print onClick={print}>
                <img src="/images/print-hover.png" alt="Button icon" />
                {'Imprimir'}
              </Print>
              <Footer>
                <ImageCall src="/images/question-icon.svg" />
                <TextSecondary>
                  Si quieres acompañamiento de un experto durante el proceso,
                  escríbenos por el chat en vivo de nuestra página o por
                  Whatsapp al +57 3052556573.
                </TextSecondary>
                <ImageSura
                  className="sura-vigilado"
                  src="/images/sura-vigilado.png"
                />
              </Footer>
              <Logo className="img-garantia" src="/images/garantia.svg" />
            </Card>
          </ContainerInfo>
        </div>
      </Container>
    </div>
  )
}

export default SuraInfo
