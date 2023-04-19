import {
  SectionContainer,
  Summary,
  RPAContainer,
  icons,
} from '@tributi-co/common/components'

import { ON_BOARDING, ENGINE } from '@tributi-co/common/constants'

const {
  Bienes,
  Deducciones,
  Financieros,
  Ingresos,
  InformacionPersonal,
  Resumen,
} = icons

const { AFFIRMATIVE, NEGATIVE } = ON_BOARDING
const { ENGINE_STATUS_ERROR_CODE } = ENGINE

const constants = {
  IGNORE_TAX_INPUTS_DIAN: ['1.1.1.69', '1.1.1.1', '1.1.1.2'],
  INCLUDE_LITHOGRAPHIC: false,
  ESIGNATURE_TAX_INPUT_CODE: '1.1.1.45',
}

const config = {
  default: {
    iconsPath: 'images/icons/onboarding/2022/',
    lastTab: '0.0',
    personalInfoTab: '1.',
    dianTab: '1.',
    currentTab: '1.',
    calculatedDueDate: '1.1.1.18',
    navObject: [
      {
        name: 'Información Personal',
        icon: InformacionPersonal,
        groupCode: '1.',
        content: RPAContainer,
        sectionTitle: 'Información personal',
        sectionSubtitle:
          'El primer paso para elaborar tu declaración de renta es conectar tu cuenta de la DIAN para personalizar la experiencia según tu historial tributario. La conexión es completamente segura y automática, no tienes de qué preocuparte.',
        showModalToConfirm: true,
        helpLink: 'https://youtu.be/n_mXSupww90',
      },
      {
        name: 'Bienes',
        icon: Bienes,
        groupCode: '2.',
        content: SectionContainer,
        sectionTitle: 'Bienes',
        sectionSubtitle:
          'Selecciona los bienes que tenías al 31 de diciembre 2022',
        helpLink: 'https://youtu.be/AdvL4zh5bAk',
      },
      {
        name: 'Ingresos',
        icon: Ingresos,
        groupCode: '3.',
        content: SectionContainer,
        sectionTitle: 'Ingresos',
        sectionSubtitle:
          'Selecciona los tipos de ingresos que tuviste durante el 2022',
        helpLink: 'https://youtu.be/z0fZkj0PXg4',
      },
      {
        name: 'Deducciones',
        icon: Deducciones,
        groupCode: '4.',
        content: SectionContainer,
        sectionTitle: 'Deducciones',
        sectionSubtitle:
          'Selecciona los casos que te aplicaron durante el 2022.\n 👛 Recuerda que estas deducciones harán que pagues menos impuestos, entonces es muy importante que las ingreses.',
        helpLink: 'https://youtu.be/9yiJAX_AZhQ',
      },
      {
        name: 'Ahorros y préstamos',
        icon: Financieros,
        groupCode: '5.',
        content: SectionContainer,
        sectionTitle: 'Ahorros y préstamos',
        sectionSubtitle: 'Selecciona los productos que tuviste durante el 2022',
        helpLink: 'https://youtu.be/9fTC-HH8XNs',
      },
      {
        name: 'Resumen',
        icon: Resumen,
        groupCode: '0.0',
        content: Summary,
        sectionTitle: 'Resumen',
        sectionSubtitle:
          'Selecciona los casos que te aplicaron durante el 2022',
        followPath: ['1.', '2.', '3.', '4.', '5.', '7.'],
        // Used in the component DueDateChecker to update the Nit and Due date based on the RUT
        dueDateCheckerConfig: {
          personalInfoInvisibleNITCode: '1.1.1.6',
          personalInfoCalculatedNITCode: '1.1.1.16',
          personalInfoDueDateCode: '1.1.1.18',
          DianNITCode: '1.1.1.8',
          RUTCertificate: '1.2.2.1',
        },
        helpLink: 'https://youtu.be/s2CcRemqaEQ',
        ignorableInputs: [
          {
            code: '1.1.1.65',
            label: 'exógena',
            errorCodes: [
              ENGINE_STATUS_ERROR_CODE.EXOGENA,
              ENGINE_STATUS_ERROR_CODE.RUT_AND_EXOGENA,
            ],
          },
          {
            code: '1.1.1.68',
            label: 'conciliación patrimonial',
            errorCodes: [
              ENGINE_STATUS_ERROR_CODE.CONCILIATION,
              ENGINE_STATUS_ERROR_CODE.RUT_AND_CONCILIATION,
            ],
          },
        ],
      },
    ],
    accessType: ['summary'],
  },
}

const alerts = {
  limitDateInput: true,
  dateInputWithoutLimit: ['1.1.1.23', '1.1.1.10'], // This value is used to handle which date inputs should not be limited
  modalWarnings: [
    {
      codes: ['1.1.1.27'],
      trigger: {
        on: 'change',
        when: ({ selectedValue, answer }) =>
          selectedValue === AFFIRMATIVE && !answer,
        title: 'Confirmación',
        plainContent: `Estás indicando que SÍ tienes bienes, deudas, o ingresos en el exterior. Por favor confirma que efectivamente este sí es el caso. Si sí, prosigue normalmente; Si no, por favor corrige la pregunta.`,
      },
    },
    {
      codes: ['1.1.1.45'],
      trigger: {
        on: 'change',
        when: ({ selectedValue }) => selectedValue === AFFIRMATIVE,
        title: 'Firma electrónica',
        plainContent: `Recuerda que por tener habilitado el mecanismo de firma electrónica la DIAN únicamente aceptará la presentación de tu declaración de renta por este mecanismo`,
      },
    },
    {
      codes: ['1.1.1.45'],
      dependencies: ['1.1.1.34'],
      trigger: {
        on: 'change',
        when: ({ selectedValue, values: [dependency1] }) =>
          selectedValue === NEGATIVE && dependency1 === AFFIRMATIVE,
        title: 'Debes habilitar el mecanismo de firma electrónica',
        plainContent: `Dado que eres residente fiscal en el exterior, debes presentar tu declaración de renta en el formulario 110. Este formulario únicamente se puede presentar mediante el mecanismo de firma electrónica, en el siguiente artículo te explicamos como habilitar este mecanismo: \n`,
        link: 'https://www.tributi.com/ayuda/como-habilitar-instrumento-firma-electronica',
      },
    },
    {
      codes: ['1.1.1.29'],
      dependencies: ['1.1.1.45', '1.1.1.34'],
      trigger: {
        on: 'change',
        when: ({ selectedValue, values: [dependency1, dependency2] }) =>
          selectedValue === AFFIRMATIVE &&
          dependency1 === NEGATIVE &&
          dependency2 === AFFIRMATIVE,
        title: 'Debes habilitar el mecanismo de firma electrónica',
        plainContent: `Dado que eres residente fiscal en el exterior, debes presentar tu declaración de renta en el formulario 110. Este formulario únicamente se puede presentar mediante el mecanismo de firma electrónica, en el siguiente artículo te explicamos como habilitar este mecanismo: \n`,

        link: 'https://www.tributi.com/ayuda/como-habilitar-instrumento-firma-electronica',
      },
    },
    {
      codes: ['1.1.1.28'],
      trigger: {
        on: 'save',
        when: ({ selectedValue, oldValue }) =>
          oldValue && selectedValue !== oldValue,
        plainContent:
          'Acabas de cambiar algunas preguntas sobre tus actividades en el exterior, en consecuencia se reiniciarán varias respuestas que ya habías diligenciado. ¿Estás seguro de que deseas guardar los cambios?',
      },
    },
  ],
}

export { config, constants, alerts }
