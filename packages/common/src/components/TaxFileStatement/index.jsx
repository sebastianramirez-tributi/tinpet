import React, { Fragment, useMemo } from 'react'
import { ARANEA_STATUS_CODES } from '../../constants/dian'
import { FILE_STATES } from '../../constants/filings'
import { useConfig } from '../../helpers/hooks'
import Widget from '../TributiWidget'
import FileInit from './FileInit'
import AraneaLogin from './AraneaLogin'
import FileSignInit from './FileSignInit'
import AraneaFile from './AraneaFile'
import FileFinished from './FileFinished'
import FileError from './FileError'
import ESignAwareness from './ESignAwareness'
import InPersonFile from './InPersonFile'
import ESignInput from './ESignInput'
import { FileStatementTemplate, FileProcessResultTemplate } from './Template'
const {
  ARANEA_LOGIN,
  FILE_SIGN_INIT,
  FILE_INIT,
  ARANEA_FILE,
  FILE_ERROR,
  FILE_FINISHED,
  ESIGN_AWARENESS,
  IN_PERSON_FILE,
  ESIGN_INPUT,
} = FILE_STATES

function TaxFileStatement(props) {
  const { assets } = useConfig()
  const { logo } = assets || {}
  const { src: brandLogoSrc } = logo || {}
  const WIDGET_CONFIG = useMemo(
    () => [
      {
        name: FILE_INIT,
        component: FileInit,
        template: FileStatementTemplate,
        modalProps: {
          closable: true,
          showBackButton: false,
        },
        transition: [ARANEA_LOGIN, FILE_SIGN_INIT, ARANEA_FILE, IN_PERSON_FILE],
        templateProps: {
          image: '../../images/file/send.svg',
          title: translate('payment.success.online.fileInit.title'),
          logo: 'https://' + process.env.CDN_BASE_URL + brandLogoSrc,
          subtitle: translate('payment.success.online.fileInit.subtitle'),
        },
      },
      {
        name: ARANEA_LOGIN,
        component: AraneaLogin,
        template: FileStatementTemplate,
        modalProps: {
          closable: true,
          showBackButton: true,
          title: translate('payment.success.online.araneaLogin.modal.title'),
          onBackButtonClick: (setTransition) => () => {
            setTransition(FILE_INIT)
          },
        },
        templateProps: {
          logo: '../../images/logo_dian.svg',
        },
        transition: [FILE_SIGN_INIT, FILE_INIT],
      },
      {
        name: FILE_SIGN_INIT,
        component: FileSignInit,
        template: FileStatementTemplate,
        modalProps: {
          closable: true,
          showBackButton: true,
          title: translate('payment.success.online.title'),
          onBackButtonClick: (setTransition) => () => {
            setTransition(FILE_INIT)
          },
        },
        templateProps: {
          image: '../../images/file/launch.svg',
          title: translate('payment.success.online.fileSignInit.title'),
          subtitle: translate('payment.success.online.fileSignInit.subtitle'),
        },
        transition: [ARANEA_FILE, FILE_INIT, ESIGN_AWARENESS, ESIGN_INPUT],
      },
      {
        name: ESIGN_AWARENESS,
        component: ESignAwareness,
        template: FileStatementTemplate,
        modalProps: {
          closable: true,
          showBackButton: true,
          title: translate('payment.success.online.title'),
          onBackButtonClick: (setTransition) => () => {
            setTransition(FILE_SIGN_INIT)
          },
        },
        templateProps: {
          image: '../../images/file/awareness.svg',
          title: translate('payment.success.online.eSignAwareness.title'),
          subtitle: (
            <div
              dangerouslySetInnerHTML={{
                __html: translate(
                  'payment.success.online.eSignAwareness.subtitle'
                ),
              }}
            />
          ),
        },
        transition: [ARANEA_FILE, FILE_SIGN_INIT, IN_PERSON_FILE],
      },
      {
        name: ESIGN_INPUT,
        component: ESignInput,
        template: FileStatementTemplate,
        modalProps: {
          closable: true,
          showBackButton: true,
          title: translate('payment.success.online.title'),
          onBackButtonClick: (setTransition) => () => {
            setTransition(FILE_SIGN_INIT)
          },
        },
        templateProps: {
          image: '../../images/file/awareness.svg',
          title: translate('payment.success.online.eSignInput.title'),
        },
        transition: [ARANEA_FILE, FILE_SIGN_INIT],
      },
      {
        name: IN_PERSON_FILE,
        component: InPersonFile,
        template: FileStatementTemplate,
        modalProps: {
          closable: true,
          showBackButton: false,
          title: translate('payment.success.online.title'),
        },
        templateProps: {
          image: '../../images/file/in-person.svg',
          longImage: true,
          title: translate('payment.success.online.inPersonFile.title'),
          subtitle: translate('payment.success.online.inPersonFile.subtitle'),
        },
        transition: [ESIGN_AWARENESS, FILE_INIT],
      },
      {
        name: ARANEA_FILE,
        component: AraneaFile,
        template: FileStatementTemplate,
        modalProps: {
          closable: false,
          showBackButton: false,
          title: translate('payment.success.online.title'),
        },
        templateProps: {
          image: '../../images/file/process.svg',
        },
        transition: [FILE_ERROR, FILE_FINISHED, ESIGN_INPUT],
      },
      {
        name: FILE_ERROR,
        component: FileError,
        template: FileProcessResultTemplate,
        modalProps: {
          closable: true,
          showBackButton: false,
          title: translate('payment.success.online.title'),
        },
        templateProps: {
          image: '../../images/file/error.svg',
          title: translate('payment.success.online.fileError.title'),
          subtitle: ({ statusCode }) => {
            if (statusCode === ARANEA_STATUS_CODES.FILING_FILED) {
              return translate(
                'payment.success.online.fileError.filed.subtitle'
              )
            }
            if (statusCode === ARANEA_STATUS_CODES.UNAUTHORIZED) {
              return translate(
                'payment.success.online.fileError.unauthorized.subtitle'
              )
            }
            return translate(
              'payment.success.online.fileError.general.subtitle'
            ).split`|`
          },
        },
        transition: [FILE_INIT, ARANEA_LOGIN],
      },
      {
        name: FILE_FINISHED,
        component: FileFinished,
        template: FileProcessResultTemplate,
        modalProps: {
          closable: true,
          showBackButton: false,
          title: translate('payment.success.online.title'),
        },
        templateProps: {
          image: '../../images/file/confirmed.svg',
          title: translate('payment.success.online.fileFinished.title'),
          subtitle: [translate('payment.success.online.fileFinished.subtitle')],
        },
      },
    ],
    []
  )
  return <Widget config={WIDGET_CONFIG} initialState={FILE_INIT} {...props} />
}

export default TaxFileStatement
