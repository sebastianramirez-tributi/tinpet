import { Modal } from 'antd'

import { register } from '../registerServiceWorker'

export function registerServiceWorker() {
  register({
    onUpdate: (registration) => {
      if (registration && registration.waiting) {
        Modal.info({
          title: 'Aviso',
          content:
            'Tenemos nuevas actualizaciones en la app. La página se va a refrescar pero no perderás tus cambios.',
          onOk() {
            window.location.reload(true)
          },
          okText: 'Aceptar',
        })
      }
    },
  })
}
