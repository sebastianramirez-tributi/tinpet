import React, { Fragment } from 'react'
import { DownloadOutlined } from '@ant-design/icons'
import { stringFormat } from '@tributi-co/core-fe'

import { formatPrice } from '../../../helpers/collections'
import { DownloadStep, LegacyDownloadStep } from './DownloadStep'
import PaymentMethods from './PaymentMethods'
import StepFooterHelperItem from './StepFooterHelper'
import {
  Button,
  ButtonsWrapper,
  DetailedBoldedPrice,
  StepOption,
  Tooltip,
} from './styles'
import { ruleVimeoValidator } from './InputURLValidator/validations'
import VideoStep from './VideoStep'
import ManualPayment from './ManualPayment'

const VIDEO_LINK =
  'https://sites.google.com/tributi.com/tributi-pro/servicio-al-cliente/vimeo?authuser=0'
const TAX_PLANNING_SCHEDULE_LINK =
  'https://wa.me/573009007655?text=Hola,%20quiero%20planear%20mi%20proxima%20declaraci%C3%B3n%20para%20pagar%20menos%20impuestos'

const GENERIC_FOOTER_TITLE = 'Preguntas frecuentes:'

const IS_ENABLE_SEND_DRAFT_TAX_FILE =
  process.env.IS_ENABLE_SEND_DRAFT_TAX_FILE === 'true'

const DETAILED_STEP_1_PRICE = [
  ({ taxDue }) => ({
    component: DetailedBoldedPrice,
    children: `Impuesto a pagar: $${formatPrice(taxDue || 0)}`,
  }),
  ({ taxRefundDue }) =>
    taxRefundDue && parseInt(taxRefundDue) !== 0
      ? {
          component: DetailedBoldedPrice,
          children: `Saldo a favor: $${formatPrice(taxRefundDue || 0)}`,
        }
      : {
          component: Fragment,
        },
]

// This only shows when  the last engine was ran by an accountant
export const PRO_PLAN_USER_STEP_1 = {
  layout: DownloadStep,
  id: 'plan-pro-user',
  when: ({ isUserAndRanByAccountant }) => isUserAndRanByAccountant,
  title: {
    component: Fragment,
    children: translate('payment.success.accountant.step1.title'),
  },
  subtitle: {
    component: Fragment,
    children: translate('payment.success.accountant.step1.subtitle'),
  },
  body: [
    ...DETAILED_STEP_1_PRICE,
    {
      component: ButtonsWrapper,
      laptop: true,
      children: [
        ({ downloadSummary }) => ({
          component: Button,
          size: 'md',
          variant: 'solid',
          children: 'Revisar valores y sugerencias',
          startIcon: DownloadOutlined,
          laptop: true,
          onClick: downloadSummary,
        }),
        ({ reviewRequested }) => ({
          component: Tooltip,
          title: !reviewRequested
            ? 'Si no estás de acuerdo con tu declaración, tu contador buscará un espacio para poder resolver tus dudas y hacer las modificaciones de ser necesarias.'
            : 'Tu contador se va a poner en contacto contigo para agendar la reunión. Igual, si lo deseas, puedes comunicarte con él a través de email o los otros canales disponibles.',
          forButton: true,
          children: [
            ({ askForRevision }) => ({
              component: Button,
              size: 'md',
              variant: 'outlined',
              disabled: reviewRequested,
              children: !reviewRequested
                ? 'Solicitar revisión con mi contador'
                : 'Solicitud de revisión enviada',
              laptop: true,
              onClick: askForRevision,
            }),
          ],
        }),
      ],
    },
  ],
}

export const GENERAL_PLAN_USER_STEP_1 = {
  layout: DownloadStep,
  id: 'step-1',
  when: ({ isUserAndRanByAccountant }) => !isUserAndRanByAccountant,
  title: ({ isAccountant }) => ({
    component: Fragment,
    children: isAccountant
      ? translate('payment.success.accountant.step1.title')
      : translate('payment.success.user.step1.title'),
  }),
  subtitle: ({ isAccountant }) => ({
    component: Fragment,
    children: isAccountant
      ? translate('payment.success.accountant.step1.subtitle')
      : translate('payment.success.user.step1.subtitle'),
  }),
  body: [
    ...DETAILED_STEP_1_PRICE,
    {
      component: ButtonsWrapper,
      children: [
        ({ downloadSummary }) => ({
          component: Button,
          size: 'md',
          variant: 'solid',
          children: 'Revisar valores y sugerencias',
          startIcon: DownloadOutlined,
          onClick: downloadSummary,
        }),
        ({ editFiling }) => ({
          component: Button,
          size: 'md',
          variant: 'outlined',
          children: `Editar mi declaración`,
          onClick: editFiling,
        }),
      ],
    },
  ],
  footerVisible: ({ isAccountantApp }) => !isAccountantApp,
  footer: {
    title: {
      component: Fragment,
      children: GENERIC_FOOTER_TITLE,
    },
    helpItems: {
      component: Fragment,
      children: [
        {
          component: StepFooterHelperItem,
          text: '¿Qué debo hacer si necesito editar la información de mi declaración de renta?',
          link: 'https://www.tributi.com/ayuda/como-editar-declaracion',
        },
        {
          component: StepFooterHelperItem,
          text: '¿Tienes dudas sobre tu impuesto a pagar?',
          link: 'https://www.tributi.com/blog/dudas-frecuentes-sobre-el-impuesto-a-pagar-obtenido-en-tributi',
        },
        {
          component: StepFooterHelperItem,
          text: '¿Cómo disminuir mi impuesto a cargo?',
          link: 'https://www.tributi.com/blog/como-disminuir-mi-impuesto-a-cargo',
        },
      ],
    },
  },
}

const PRO_PLAN_VIDEO_EXPLANATION_STEP = {
  layout: DownloadStep,
  key: 'pro-plan-video-explanation',
  when: ({ isUserAndRanByAccountant }) => isUserAndRanByAccountant,
  title: {
    component: Fragment,
    children: 'Puedes ver el video con la explicación de tu contador',
  },
  subtitle: {
    component: Fragment,
    children:
      'Tu contador asignado preparó un video para explicar el resultado de tu declaración. Revisa muy bien las explicaciones de tu situación',
  },
  body: [
    ({ videoExplainURL }) => ({
      component: VideoStep,
      videoURL: videoExplainURL,
    }),
  ],
}

const PRO_PLAN_USER_STEP_2_BASE = {
  layout: DownloadStep,
  title: ({ isAccountant, isFiled }) => ({
    component: Fragment,
    children: !isFiled
      ? isAccountant
        ? translate('payment.success.statement.filePendingAccountant')
        : translate('payment.success.user.fileStatement.title')
      : translate('payment.success.statement.filed.title'),
  }),
  subtitle: ({
    isSubmittedByApp,
    lastDayOfMonth,
    formattedDueDate,
    isOverDue,
    taxDue,
    isFiled,
  }) => {
    let component

    if (isFiled && isSubmittedByApp) {
      component = <>{translate('payment.success.statement.filed.subtitle')}</>
    } else if (isFiled && !isSubmittedByApp) {
      component = <>translate('payment.succces.statementFiled.subtitle')</>
    } else if (!isOverDue) {
      component = (
        <div
          dangerouslySetInnerHTML={{
            __html: stringFormat(translate('payment.success.onTime.subtitle'), {
              formattedDueDate,
            }),
          }}
        />
      )
    } else if (!taxDue) {
      component = (
        <div
          dangerouslySetInnerHTML={{
            __html: stringFormat(
              translate('payment.succces.dueDatePassedPenalty.subtitle'),
              { formattedDueDate, lastDayOfMonth }
            ),
          }}
        />
      )
    } else {
      component = (
        <div
          dangerouslySetInnerHTML={{
            __html: stringFormat(
              translate('payment.succces.dueDatePassed.subtitle'),
              { formattedDueDate }
            ),
          }}
        />
      )
    }

    return {
      component: () => component,
    }
  },
  footerVisible: ({ isAccountantApp }) => !isAccountantApp,
  footer: {
    title: {
      component: Fragment,
      children: GENERIC_FOOTER_TITLE,
    },
    helpItems: ({ isFiled, isSubmittedByApp }) => ({
      component: Fragment,
      children: isFiled
        ? [
            {
              component: StepFooterHelperItem,
              text: '¿Qué ocurre si ya se venció mi declaración de renta y debo hacer una corrección?',
              link: 'http://www.tributi.com/ayuda/preguntas-frecuentes-sobre-la-correccion-de-mi-declaracion-de-renta?utm_source=faq_summary',
            },
            {
              component: StepFooterHelperItem,
              text: '¿Tengo alguna sanción por realizar la corrección de mi declaración de renta?',
              link: 'http://www.tributi.com/ayuda/preguntas-frecuentes-sobre-la-correccion-de-mi-declaracion-de-renta?utm_source=faq_summary',
            },
          ]
        : [
            {
              component: StepFooterHelperItem,
              text: '¿Qué pasa si no presento mi declaración de renta a tiempo?',
              link: 'https://www.tributi.com/ayuda/que-pasa-si-declaro-tarde',
            },
          ],
    }),
  },
}

const PRO_PLAN_USER_STEP_2_ONLINE = {
  ...PRO_PLAN_USER_STEP_2_BASE,
  when: ({ onlineEnabled }) => onlineEnabled,
  key: 'step-2-online',
  body: [
    ({
      startFilingPresentation,
      downloadFiledFiling,
      isSubmittedByApp,
      form,
      loadingLithographic,
      isFiled,
      handleOpenLiveHelp,
    }) => {
      if (form === '110') {
        return {
          component: ButtonsWrapper,
          children: [
            ({ howToFile, isAccountantApp }) =>
              !isAccountantApp && {
                component: Button,
                size: 'md',
                variant: 'solid',
                children: translate('payment.success.howToFile.title'),
                as: 'a',
                href: howToFile,
                target: '_blank',
                rel: 'noopener noreferrer',
              },
            ({ downloadDeclaration }) => ({
              component: Button,
              size: 'md',
              variant: 'solid',
              children: `Descargar información`,
              startIcon: DownloadOutlined,
              onClick: downloadDeclaration,
            }),
          ],
        }
      } else {
        const onClick = !isFiled ? startFilingPresentation : downloadFiledFiling
        const downloadButton = {
          component: Button,
          size: 'md',
          variant: 'solid',
          loading: loadingLithographic,
          spin: loadingLithographic,
          children: !isFiled
            ? 'Comenzar presentación'
            : isSubmittedByApp
            ? 'Descargar declaración presentada'
            : 'Descargar borrador',
          onClick,
        }
        if (!isFiled || (isFiled && isSubmittedByApp)) {
          return downloadButton
        }
        return {
          component: ButtonsWrapper,
          children: [
            downloadButton,
            {
              component: Button,
              size: 'md',
              variant: 'solid',
              children: 'Escribir al chat',
              onClick: handleOpenLiveHelp,
            },
          ],
        }
      }
    },
  ],
}

const PRO_PLAN_USER_STEP_2_MANUAL = {
  ...PRO_PLAN_USER_STEP_2_BASE,
  when: ({ onlineEnabled }) => !onlineEnabled,
  key: 'step-2-manual',
  body: [
    {
      component: ButtonsWrapper,
      children: [
        ({ howToFile, isAccountantApp }) =>
          !isAccountantApp && {
            component: Button,
            size: 'md',
            variant: 'solid',
            children: translate('payment.success.howToFile.title'),
            as: 'a',
            href: howToFile,
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        ({ downloadDeclaration, declarationLoading }) => ({
          component: Button,
          size: 'md',
          variant: 'solid',
          children: declarationLoading
            ? 'Generando...'
            : translate('payment.success.manual.file.downloadDraft.title'),
          startIcon: DownloadOutlined,
          onClick: downloadDeclaration,
          loading: declarationLoading,
          spin: declarationLoading,
        }),
      ],
    },
  ],
}

const STEP_STATEMENT_PAYMENT_MANUAL = {
  layout: DownloadStep,
  id: 'step-3-manual',
  when: ({ taxDue, onlineEnabled }) => parseInt(taxDue) > 0 && !onlineEnabled,
  title: {
    component: Fragment,
    children: translate('payment.success.taxPayment.title'),
  },
  subtitle: {
    component: Fragment,
    children: translate('payment.success.manual.taxPayment.subtitle'),
  },
  body: [
    {
      component: ButtonsWrapper,
      marginless: true,
      children: [
        ({ howToPayOtherMethods }) => ({
          component: Button,
          size: 'md',
          variant: 'solid',
          children: translate('payment.success.taxPaymentOther.title'),
          as: 'a',
          href: howToPayOtherMethods,
          target: '_blank',
          rel: 'noopener noreferrer',
        }),
      ],
    },
  ],
  footerVisible: ({ isAccountantApp }) => !isAccountantApp,
  footer: {
    title: {
      component: Fragment,
      children: GENERIC_FOOTER_TITLE,
    },
    helpItems: {
      component: Fragment,
      children: [
        {
          component: StepFooterHelperItem,
          text: '¿Qué puedo hacer si no tengo toda la plata para pagar mi declaración de renta?',
          link: 'https://www.tributi.com/ayuda/declaracion-que-hacer-si-no-tienes-plata',
        },
      ],
    },
  },
}

const STEP_STATEMENT_PAYMENT_ONLINE = {
  layout: DownloadStep,
  id: 'step-3-online',
  when: ({ taxDue, onlineEnabled }) => parseInt(taxDue) > 0 && onlineEnabled,
  title: {
    component: Fragment,
    children: translate('payment.success.taxPayment.title'),
  },
  subtitle: ({ isSubmittedByApp }) => ({
    component: Fragment,
    children: !isSubmittedByApp ? (
      translate('payment.success.taxPayment.pendingSubmit.subtitle')
    ) : (
      <div
        dangerouslySetInnerHTML={{
          __html: translate('payment.success.taxPayment.submitted.subtitle'),
        }}
      />
    ),
  }),
  bodyVisible: ({ isSubmittedByApp }) => isSubmittedByApp,
  body: [
    ({ openPayment }) => ({
      component: Button,
      size: 'md',
      variant: 'solid',
      children: translate('payment.success.taxPayment.openModal.text'),
      onClick: openPayment,
    }),
    ({
      howToPayOtherMethods,
      downloadPaymentReceipt,
      fetchValidDate490,
      isPaymentReceiptLoading,
      validDate490,
    }) => ({
      component: PaymentMethods,
      howToPayOtherMethods,
      downloadPaymentReceipt,
      fetchValidDate490,
      isPaymentReceiptLoading,
      validDate490,
    }),
  ],
  footerVisible: ({ isAccountantApp }) => !isAccountantApp,
  footer: {
    title: {
      component: Fragment,
      children: GENERIC_FOOTER_TITLE,
    },
    helpItems: {
      component: Fragment,
      children: [
        {
          component: StepFooterHelperItem,
          text: '¿Qué puedo hacer si no tengo toda la plata para pagar mi declaración de renta?',
          link: 'https://www.tributi.com/ayuda/declaracion-que-hacer-si-no-tienes-plata',
        },
      ],
    },
  },
}

const STEP_STATEMENT_PAYMENT_ONLINE_ACCOUNTANT_APP = {
  layout: DownloadStep,
  id: 'step-3-online',
  when: ({ taxDue, onlineEnabled }) => parseInt(taxDue) > 0 && onlineEnabled,
  title: {
    component: Fragment,
    children: translate('payment.success.taxPayment.title'),
  },
  subtitle: ({ isSubmittedByApp }) => ({
    component: Fragment,
    children: !isSubmittedByApp
      ? translate('payment.success.taxPayment.pendingSubmit.subtitle')
      : translate('payment.success.taxPayment.submitted.subtitle'),
  }),
  bodyVisible: ({ isSubmittedByApp }) => isSubmittedByApp,
  body: [
    {
      component: StepOption,
      children: (
        <span
          dangerouslySetInnerHTML={{
            __html: translate('payment.sucesss.taxPayment.stepOption1.text'),
          }}
        />
      ),
    },
    ({ openPayment }) => ({
      component: Button,
      size: 'md',
      variant: 'solid',
      children: translate('payment.success.taxPayment.openModal.text'),
      onClick: openPayment,
    }),
    {
      component: StepOption,
      children: (
        <span
          dangerouslySetInnerHTML={{
            __html: translate('payment.sucesss.taxPayment.stepOption2.text'),
          }}
        />
      ),
    },
    ({
      howToPayOtherMethods,
      downloadPaymentReceipt,
      fetchValidDate490,
      isPaymentReceiptLoading,
      validDate490,
    }) => ({
      component: ManualPayment,
      howToPayOtherMethods,
      downloadPaymentReceipt,
      fetchValidDate490,
      isPaymentReceiptLoading,
      validDate490,
    }),
  ],
}

const ASSETS_ABROAD_STEP = {
  layout: DownloadStep,
  id: 'step-4',
  when: ({ needs160 }) => needs160,
  title: {
    component: Fragment,
    children: 'Reporta tus activos en el exterior',
  },
  subtitle: {
    component: Fragment,
    children:
      'Tus activos en el exterior deben ser reportados porque superan el valor mínimo',
  },
  body: [
    {
      component: ButtonsWrapper,
      children: [
        ({ howToFile160 }) => ({
          component: Button,
          size: 'md',
          variant: 'solid',
          children: 'Instrucciones',
          as: 'a',
          href: howToFile160,
          target: '_blank',
          rel: 'noopener noreferrer',
        }),
        ({ downloadActives }) => ({
          component: Button,
          size: 'md',
          variant: 'solid',
          children: 'Información a reportar',
          onClick: downloadActives,
        }),
      ],
    },
  ],
  footerVisible: ({ isAccountantApp }) => !isAccountantApp,
  footer: {
    title: {
      component: Fragment,
      children: GENERIC_FOOTER_TITLE,
    },
    helpItems: {
      component: Fragment,
      children: [
        {
          component: StepFooterHelperItem,
          text: '¿Tienes dudas sobre cómo reportar tus activos en el exterior?',
          link: 'https://www.tributi.com/ayuda/preguntas-frecuentes-sobre-la-presentacion-de-la-declaracion-de-renta-con-activos-en-el-exterior',
        },
      ],
    },
  },
}

const APPLY_TAX_PLANNING_STEP = {
  layout: DownloadStep,
  id: 'apply-tp',
  iconUrl: 'https://' + process.env.CDN_BASE_URL + '/img/shared/rocket.svg',
  when: ({ applyTp }) => applyTp,
  title: {
    component: Fragment,
    children: translate('payment.success.taxPlaning.title'),
  },
  subtitle: {
    component: Fragment,
    children: translate('payment.success.taxPlaning.subtitle'),
  },
  body: [
    {
      component: ButtonsWrapper,
      children: [
        ({ isAssistant }) => ({
          component: Button,
          size: 'md',
          children: 'Agendar cita',
          as: 'a',
          target: '_blank',
          href: TAX_PLANNING_SCHEDULE_LINK,
          rel: 'noopener noreferrer',
          loading: isAssistant,
        }),
      ],
    },
  ],
}

export const ACCOUNTANT_STEPS = [
  GENERAL_PLAN_USER_STEP_1,
  {
    id: 'accountant-declaration',
    layout: LegacyDownloadStep,
    title:
      'Si la declaración de tu usuario está correcta haz el video con las explicaciones',
    content: `Haz un video con las explicaciones de la declaración de tu usuario,
              deja el link del video abajo y luego haz clic en enviar borrador
              para que tu usuario lo revise. Recuerda seguir las explicaciones
              del video <a href=${VIDEO_LINK} rel="noopener noreferrer" target="_blank">aquí</a>`,
    showInputElement: true,
    inputPlaceholder: 'Inserta el link (URL) del video explicativo',
    inputName: 'video',
    inputValidator: ruleVimeoValidator,
  },
  {
    id: 'accountant-videocall',
    layout: LegacyDownloadStep,
    when: ({ videoCallURLException }) => !videoCallURLException,
    title: 'Link de la Video llamada',
    content: `Agrega el link de la video llamada para que tú y tu usuario puedan tener fácil acceso a ella`,
    showInputElement: true,
    inputPlaceholder: 'Inserta el link (URL) de la video llamada',
    inputName: 'videocall',
    inputValidator: ruleVimeoValidator,
  },
  ASSETS_ABROAD_STEP,
  {
    id: 'accountant-send-declaration',
    layout: DownloadStep,
    title: {
      component: Fragment,
      children:
        'Con la seguridad de que la declaración está bien y el video de explicaciones, solamente queda enviarle el borrador de la declaración al usuario',
    },
    subtitle: {
      component: Fragment,
      children:
        'Haz clic en enviar borrador, y tu usuario recibirá el borrador de la declaración y el video de la explicación. Recuerda que sin video no podemos enviar los documentos al usuario',
    },
    body: [
      {
        component: ButtonsWrapper,
        children: [
          ({ sendFilesToUser, stepFormHasErrors }) => ({
            component: Button,
            size: 'md',
            variant: 'solid',
            children:
              'Enviar borrador de la declaración al usuario para su aprobación',
            disabled: !IS_ENABLE_SEND_DRAFT_TAX_FILE || stepFormHasErrors,
            onClick: sendFilesToUser,
          }),
        ],
      },
    ],
  },
  PRO_PLAN_USER_STEP_2_ONLINE,
  PRO_PLAN_USER_STEP_2_MANUAL,
]

export const USER_STEPS = [
  PRO_PLAN_USER_STEP_1,
  GENERAL_PLAN_USER_STEP_1,
  PRO_PLAN_VIDEO_EXPLANATION_STEP,
  PRO_PLAN_USER_STEP_2_ONLINE,
  PRO_PLAN_USER_STEP_2_MANUAL,
  STEP_STATEMENT_PAYMENT_MANUAL,
  STEP_STATEMENT_PAYMENT_ONLINE,
  ASSETS_ABROAD_STEP,
  APPLY_TAX_PLANNING_STEP,
]

export const ACCOUNTANT_APP_ACCOUNTANT_STEPS = [
  GENERAL_PLAN_USER_STEP_1,
  PRO_PLAN_USER_STEP_2_ONLINE,
  PRO_PLAN_USER_STEP_2_MANUAL,
  STEP_STATEMENT_PAYMENT_MANUAL,
  STEP_STATEMENT_PAYMENT_ONLINE_ACCOUNTANT_APP,
]

export const TAX_PLANNING_STEPS = [
  {
    layout: DownloadStep,
    id: 'step-1',
    title: () => ({
      component: Fragment,
      children:
        'Revisa que los valores usados en la planeación sean correctos y completos',
    }),
    subtitle: () => ({
      component: Fragment,
      children:
        'Puedes ingresar a editar y recalcular la planeación todas las veces que quieras.',
    }),
    body: [
      {
        component: ButtonsWrapper,
        children: [
          ({ viewEngineTaxPlanning }) => ({
            component: Button,
            size: 'md',
            variant: 'solid',
            children: 'Revisar valores y sugerencias',
            startIcon: DownloadOutlined,
            onClick: viewEngineTaxPlanning,
          }),
          ({ editFiling }) => ({
            component: Button,
            size: 'md',
            variant: 'outlined',
            children: `Editar mi declaración`,
            onClick: editFiling,
          }),
        ],
      },
    ],
  },
]
