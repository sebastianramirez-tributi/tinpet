import {
  SingleContainer,
  SectionContainer,
  RPAContainer,
  Summary,
  icons,
} from '@tributi-co/common/components'
import { ON_BOARDING, ENGINE } from '@tributi-co/common/constants'

const {
  Bienes,
  Deducciones,
  Dian,
  Financieros,
  InformacionPersonal,
  Ingresos,
  Resumen,
} = icons

const { AFFIRMATIVE, NEGATIVE } = ON_BOARDING
const { ENGINE_STATUS_ERROR_CODE } = ENGINE

const constants = {
  IGNORE_TAX_INPUTS_DIAN: ['6.1.1.1', '6.1.1.2'],
}

const config = {
  default: {
    iconsPath: 'images/icons/onboarding/2019/',
    lastTab: '0.0',
    personalInfoTab: '1.',
    dianTab: '6.',
    currentTab: '1.',
    calculatedDueDate: '1.1.1.7',
    navObject: [
      {
        name: 'Información personal',
        icon: InformacionPersonal,
        groupCode: '1.',
        content: SingleContainer,
        sectionTitle: 'Información personal',
        sectionSubtitle:
          'Cuéntanos un poco más sobre ti respondiendo las siguientes preguntas',
        onLoad: 'validatePersonalInfo',
      },
      {
        name: 'Bienes',
        icon: Bienes,
        groupCode: '2.',
        content: SectionContainer,
        sectionTitle: 'Bienes',
        sectionSubtitle:
          'Selecciona los bienes que tenías al 31 de diciembre 2019',
      },
      {
        name: 'Ingresos',
        icon: Ingresos,
        groupCode: '3.',
        content: SectionContainer,
        sectionTitle: 'Ingresos',
        sectionSubtitle:
          'Selecciona los tipos de ingresos que tuviste durante el 2019',
      },
      {
        name: 'Deducciones',
        icon: Deducciones,
        groupCode: '4.',
        content: SectionContainer,
        sectionTitle: 'Deducciones',
        sectionSubtitle:
          'Selecciona los casos que te aplicaron durante el 2019.\n 👛 Recuerda que estas deducciones harán que pagues menos impuestos, entonces es muy importante que las ingreses.',
      },
      {
        name: 'Ahorros y préstamos',
        icon: Financieros,
        groupCode: '5.',
        content: SectionContainer,
        sectionTitle: 'Ahorros y préstamos',
        sectionSubtitle: 'Selecciona los productos que tuviste durante el 2019',
      },
      {
        name: 'DIAN',
        groupCode: '6.',
        content: RPAContainer,
        icon: Dian,
        sectionImage: 'dian/logo_dian.svg',
        sectionSubtitle: [
          'Conecta tu cuenta de la DIAN y automáticamente descargaremos toda tu información',
          'Para elaborar tu declaración necesitamos información que podemos obtener desde el portal de la DIAN como tus declaraciones pasadas si las hay, tu RUT, si haz reclamado algún saldo a favor, entre otros. A continuación podemos descargar toda esta información de forma automática por ti, o si lo deseas, también puedes ingresar la información manualmente.',
          'Esta sección es solo para descargar información, más adelante te daremos las instrucciones para terminar de presentar tu declaración.',
        ],
      },
      {
        name: 'Resumen',
        icon: Resumen,
        groupCode: '0.0',
        content: Summary,
        sectionTitle: 'Resumen',
        sectionSubtitle:
          'Selecciona los casos que te aplicaron durante el 2019',
        followPath: ['1.', '2.', '3.', '4.', '5.', '6.'],
        // Used in the component DueDateChecker to update the Nit and Due date based on the RUT
        dueDateCheckerConfig: {
          personalInfoInvisibleNITCode: '1.1.1.24',
          personalInfoCalculatedNITCode: '1.1.1.5',
          personalInfoDueDateCode: '1.1.1.7',
          DianNITCode: '6.1.1.2',
          RUTCertificate: '6.2.1.1',
        },
        ignorableInputs: [
          {
            code: '6.1.1.23',
            label: 'exógena',
            errorCodes: [
              ENGINE_STATUS_ERROR_CODE.EXOGENA,
              ENGINE_STATUS_ERROR_CODE.RUT_AND_EXOGENA,
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
  dateInputWithoutLimit: ['1.1.1.22'], // This value is used to handle which date inputs should not be limited
  modalWarnings: [
    {
      codes: ['1.1.1.12'],
      trigger: {
        on: 'change',
        when: ({ selectedValue, answer }) =>
          selectedValue === AFFIRMATIVE && !answer,
        title: 'Confirmación',
        plainContent: `Estás indicando que SÍ tienes bienes, deudas, o ingresos en el exterior. Por favor confirma que efectivamente este sí es el caso. Si sí, prosigue normalmente; Si no, por favor corrige la pregunta.`,
      },
    },
    {
      codes: ['6.1.1.31'],
      trigger: {
        on: 'change',
        when: ({ selectedValue }) => selectedValue === AFFIRMATIVE,
        title: 'Firma electrónica',
        plainContent: `Recuerda que por tener habilitado el mecanismo de firma electrónica la DIAN únicamente aceptará la presentación de tu declaración de renta por este mecanismo`,
      },
    },
    {
      codes: ['6.1.1.31'],
      dependencies: ['6.1.1.28'],
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
      codes: ['6.1.1.23'],
      dependencies: ['6.1.1.31', '6.1.1.28'],
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
      codes: ['1.1.1.12'],
      trigger: {
        on: 'save',
        when: ({ selectedValue, oldValue }) => selectedValue !== oldValue,
        plainContent:
          'Acabas de cambiar algunas preguntas sobre tus actividades en el exterior, en consecuencia se reiniciarán varias respuestas que ya habías diligenciado. ¿Estás seguro de que deseas guardar los cambios?',
      },
    },
  ],
}

export { config, constants, alerts }
