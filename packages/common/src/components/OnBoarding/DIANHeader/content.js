import React from 'react'
import PropTypes from 'prop-types'
import { Content } from './style'
import Image from '../../common/Image'
import SectionTitle from '../SectionTitle'

const Header = ({ iconsPath, helpLink }) => {
  return (
    <Content data-testid="dian-header">
      <Image src={`${iconsPath}dian/logo_dian.svg`} />
      <SectionTitle
        subtitle={
          'Conecta tu cuenta de la DIAN y automáticamente descargaremos toda tu información'
        }
        subtitle2={
          'Para elaborar tu declaración necesitamos información que podemos obtener desde el portal de la DIAN como tus declaraciones pasadas si las hay, tu RUT, si haz reclamado algún saldo a favor, entre otros. A continuación podemos descargar toda esta información de forma automática por ti, o si lo deseas, también puedes ingresar la información manualmente.'
        }
        subtitle3={
          'Esta sección es solo para descargar información, más adelante te daremos las instrucciones para terminar de presentar tu declaración.'
        }
        helpLink={helpLink}
      />
    </Content>
  )
}

Header.propTypes = {
  iconsPath: PropTypes.string.isRequired,
  helpLink: PropTypes.string,
}

Header.defaultProps = {
  helpLink: '',
}

export default Header
