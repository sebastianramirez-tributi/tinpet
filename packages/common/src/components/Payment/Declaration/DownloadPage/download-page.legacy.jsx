import React, { useMemo } from 'react'

import { LegacyDownloadStep } from '../DownloadStep'
import { usePersonalInfo } from '../../../../helpers/hooks'
import { FILE_TYPES } from '../../../../constants/documents'
import { ROLES } from '../../../../constants/person'
import { generateButton } from './utils'
import {
  DOWNLOAD_STEPS_NAMES,
  HOW_TO_FILE_FALLBACK_LINK,
  SHARED_DOWNLOAD_PAGE_PROP_TYPES,
} from './constants'

const DownloadPage = ({
  editFiling,
  howToFile,
  howToFile160,
  needs160,
  verifySanctionBeforeDownload,
  getFile,
  loadingLithographic,
  isOverDue,
  formattedDueDate,
  documents: { summary, declaration, actives },
}) => {
  const { personalInfo } = usePersonalInfo()
  const { currentFiling, role } = personalInfo
  const { tax_year: taxYear } = currentFiling
  const taxYearFileData = `AñoGravable${taxYear}`
  const filingName = `${currentFiling.first_name}-${currentFiling.last_name}`

  const isAssistant = role === ROLES.ASSISTANT
  const fileName = `${taxYearFileData}-${filingName}`

  const ITEMS = useMemo(
    () =>
      [
        {
          id: DOWNLOAD_STEPS_NAMES.SUMMARY,
          title:
            'Revisa el resumen de tu declaración para validar que todo esté bien',
          content:
            'Si necesitas cambiar algo puedes regresar a editarlo y nosotros volveremos a generar la declaración.',
          primaryAction: generateButton(
            'Descargar resumen',
            null,
            verifySanctionBeforeDownload(DOWNLOAD_STEPS_NAMES.SUMMARY, summary)
          ),
          secondaryAction: generateButton(
            'Editar mi declaración',
            null,
            editFiling
          ),
        },
        {
          id: DOWNLOAD_STEPS_NAMES.DECLARATION,
          title:
            'Ahora está todo listo para que presentes tu declaración de renta',
          content: isOverDue
            ? `Descarga tu declaración y revisa las instrucciones sobre cómo presentarla lo más pronto posible dado que tu fecha limite para presentarla era el <strong>${formattedDueDate}.</strong>`
            : `Descarga tu declaración y revisa las instrucciones sobre cómo presentarla hasta el <strong>${formattedDueDate}.</strong>`,
          primaryAction: generateButton(
            'Descargar declaración',
            null,
            verifySanctionBeforeDownload(
              DOWNLOAD_STEPS_NAMES.DECLARATION,
              declaration
            )
          ),
          secondaryAction: generateButton(
            '¿Cómo presentarla?',
            howToFile || HOW_TO_FILE_FALLBACK_LINK
          ),
          thirdAction: generateButton(
            'Reintentar PDF',
            null,
            getFile(FILE_TYPES.LITOGRAFICO)
          ),
        },
        {
          id: DOWNLOAD_STEPS_NAMES.ACTIVES,
          title:
            'Como tienes activos en el exterior, es necesario presentar un formulario adicional para declararlos',
          content:
            'Descarga la información sobre tus activos en el exterior, y revisa las instrucciones sobre cómo presentarlos.',
          primaryAction: generateButton(
            'Descargar Información sobre activos',
            null,
            verifySanctionBeforeDownload(DOWNLOAD_STEPS_NAMES.ACTIVES, actives)
          ),
          secondaryAction: generateButton('¿Cómo presentarla?', howToFile160),
        },
        {
          id: DOWNLOAD_STEPS_NAMES.FAQ,
          title:
            'Finalmente, en caso de que tengas alguna duda, te compartimos las preguntas más frecuentes en caso de que te sean útiles',
          content:
            'En caso de que tengas cualquier otra duda que no esté la respuesta acá, no dudes en escribirnos por el chat en vivo.',
          faqItems: [
            {
              id: 1,
              icon: '/images/payment/faq-1.svg',
              text: '¿Qué puedo hacer si no tengo toda la plata para pagar mi declaración de renta?',
              link: 'https://www.tributi.com/ayuda/declaracion-que-hacer-si-no-tienes-plata',
            },
            {
              id: 2,
              icon: '/images/payment/faq-2.svg',
              text: '¿Qué pasa si no presento mi declaración de renta a tiempo?',
              link: 'https://www.tributi.com/ayuda/que-pasa-si-declaro-tarde',
            },
            {
              id: 3,
              icon: '/images/payment/faq-3.svg',
              text: '¿Qué debo hacer si necesito editar la información de mi declaración de renta?',
              link: 'https://www.tributi.com/ayuda/como-editar-declaracion',
            },
            {
              id: 4,
              icon: '/images/payment/faq-4.svg',
              text: '¿Tienes dudas sobre tu impuesto a pagar?',
              link: 'https://www.tributi.com/blog/dudas-frecuentes-sobre-el-impuesto-a-pagar-obtenido-en-tributi',
            },
          ],
        },
      ].filter(({ id }) => needs160 || id !== DOWNLOAD_STEPS_NAMES.ACTIVES),
    [
      actives,
      declaration,
      formattedDueDate,
      getFile,
      editFiling,
      howToFile,
      howToFile160,
      isOverDue,
      needs160,
      summary,
      verifySanctionBeforeDownload,
    ]
  )

  return (
    <>
      {ITEMS.map((item) => (
        <LegacyDownloadStep
          key={item.id}
          {...item}
          loadingLithographic={loadingLithographic}
          fileName={fileName}
          isAssistant={isAssistant}
        />
      ))}
    </>
  )
}

DownloadPage.propTypes = {
  ...SHARED_DOWNLOAD_PAGE_PROP_TYPES,
}

DownloadPage.defaultProps = {
  documents: {},
  howToFile: null,
  howToFile160: null,
  loadingLithographic: false,
  needs160: false,
}

export default DownloadPage
