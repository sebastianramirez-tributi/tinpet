import {
  SingleContainer,
  SectionContainer,
  Summary,
  icons,
} from '@tributi-co/common/components'
import { ON_BOARDING } from '@tributi-co/common/constants'

const {
  InformacionPersonal,
  Bienes,
  Deducciones,
  Financieros,
  FondoPensiones,
  Ingresos,
  Resumen,
} = icons

const { AFFIRMATIVE, NEGATIVE } = ON_BOARDING

const constants = {}

const config = {
  default: {
    iconsPath: 'images/icons/onboarding/2018/',
    lastTab: '0.0',
    personalInfoTab: '6.1.1',
    currentTab: '6.1.1',
    navObject: [
      {
        name: 'Info personal',
        icon: InformacionPersonal,
        groupCode: '6.1.1',
        content: SingleContainer,
        onLoad: 'validatePersonalInfo',
        sectionTitle: 'Información personal',
        sectionSubtitle:
          'Cuéntanos un poco más sobre ti respondiendo las siguientes preguntas',
      },
      {
        name: 'Productos financieros',
        icon: Financieros,
        groupCode: '1.',
        content: SectionContainer,
        sectionTitle: 'Productos financieros',
        sectionSubtitle: 'Selecciona los productos que tuviste durante el 2018',
      },
      {
        name: 'Pensiones y cesantías',
        icon: FondoPensiones,
        groupCode: '4.',
        content: SectionContainer,
        sectionTitle: 'Fondo de pensiones y cesantías',
        sectionSubtitle:
          'Selecciona los fondos a los que realizaste aportes o de los que realizaste retiros en el 2018',
      },
      {
        name: 'Bienes',
        icon: Bienes,
        groupCode: '3.',
        content: SectionContainer,
        sectionTitle: 'Bienes',
        sectionSubtitle:
          'Selecciona los bienes que tenías al 31 de diciembre 2018',
      },
      {
        name: 'Ingresos',
        icon: Ingresos,
        groupCode: '2.',
        content: SectionContainer,
        sectionTitle: 'Ingresos',
        sectionSubtitle:
          'Selecciona los tipos de ingresos que tuviste durante el 2018',
      },
      {
        name: 'Deducciones',
        icon: Deducciones,
        groupCode: '5.',
        content: SectionContainer,
        sectionTitle: 'Información personal',
        sectionSubtitle:
          'Selecciona los casos que te aplicaron durante el 2018',
      },
      {
        name: 'Resumen',
        icon: Resumen,
        groupCode: '0.0',
        content: Summary,
        followPath: ['6.1.1', '1.', '4.', '3.', '2.', '5.'],
      },
    ],
    accessType: ['summary'],
  },
}

const alerts = {
  limitDateInput: true,
  modalWarnings: [
    {
      codes: ['6.1.1.22'],
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
      codes: ['6.1.1.22'],
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
