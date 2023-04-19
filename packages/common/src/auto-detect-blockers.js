import Modal from 'antd/lib/modal'

document.addEventListener('DOMContentLoaded', init, false)

function init() {
  const { adBlockerDeactivated } = window
  if (!adBlockerDeactivated) {
    Modal.info({
      title: 'Mejora tu experiencia',
      content:
        'Parece que tienes un adblocker instalado como extensión de tu navegador. Por favor deshabilita o pausa el adblocker para tener acceso a toda la funcionalidad de Tributi.',
    })
  }
}
