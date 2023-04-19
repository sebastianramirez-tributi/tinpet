import { CANCEL_STATUS } from '../../../constants/certificates'
const { SUCCESS, ERROR } = CANCEL_STATUS

export default {
  [SUCCESS]: {
    modalConfig: {
      title: 'Cancelar documento',
      content: 'Documento cancelado exitosamente',
    },
    type: 'info',
  },
  [ERROR]: {
    modalConfig: {
      title: 'Cancelar documento',
      content:
        'Documento No pudo ser cancelado debido a que el proceso terminó por completo',
    },
    type: 'error',
  },
}
