import {
  SingleContainer,
  SectionContainer,
  RPAContainer,
  Summary,
} from '../../../../components/OnBoarding'
import { icons } from '../../../../components/common'

const {
  Bienes,
  Deducciones,
  Dian,
  Financieros,
  InformacionPersonal,
  Ingresos,
  Resumen,
} = icons

const constants = {
  IGNORE_TAX_INPUTS_DIAN: ['1.1.1.66', '1.1.1.1', '1.1.1.2'],
  INCLUDE_LITHOGRAPHIC: false,
  ESIGNATURE_TAX_INPUT_CODE: '1.1.1.45',
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
            errorCodes: [],
          },
        ],
      },
    ],
    accessType: ['summary'],
  },
}

const alerts = {}

export { config, constants, alerts }
