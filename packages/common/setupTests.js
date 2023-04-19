/** Used in jest.config.js */
import 'regenerator-runtime/runtime'
import '@testing-library/jest-dom/extend-expect'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import dotenv from 'dotenv'

dotenv.config({ path: './config/environments/.env.dev' })

process.env.IS_PLAN_PRO_ENABLED = true
process.env.EARLY_ADOPTER_SEASON = true

const locales = {
  'personalInfo.fetchPersonalInfo.error': 'No se pudo cargar la información',
  'forumButton.title': 'Foro de Soporte',
  'header.title': 'Menú',
  'header.myAccount': 'Mi cuenta',
  'header.goToForum': 'Foro de Soporte',
  'header.myFilings': 'Mis declaraciones',
  'header.currentFiling': 'Declaración actual',
  'header.goLanding': 'Ir a tributi.com',
  'header.logout': 'Cerrar sesión',
  'header.transactions': 'Trámites',
  'header.assistantView': 'Vista de asistentes',
  'header.filingOwner': 'Declaración de $firstName $lastName | $email',
  'header.dueDate': 'Tu declaración vence el $dueDateMoment',
  'header.taxYear': 'Año gravable $taxYear',
  'referral.footer.share': 'Compartir:',
  'referral.content.message':
    'Compártelo y gana <span>$30,000</span> a favor de tu próxima declaración por cada persona que use tu código. Además, esas personas recibirán un <span>descuento del 20%</span> en su declaración si es la primera vez usando Tributi.',
  'referral.content.yourCode': 'Tu código es',
  'referral.content.earn': 'Hasta ahora has ganado',
  'referral.content.referrals': 'Amigos referidos',
  'referral.content.balance': 'Saldo disponible',
  'referral.header.title': '$name, ¡refiere a tus amigos y gana!',
  'referral.socials.whatsapp':
    'https://api.whatsapp.com/send?phone=&text=¡Acabo de hacer mi declaración de renta con tributi.com y fue facilísimo, súper recomendado! Si usas el código {referral_code} te dan 20% de descuento.',
  'referral.socials.facebook':
    'https://www.facebook.com/sharer/sharer.php?u=https://www.tributi.com/',
  'referral.socials.linkedin':
    'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwww.tributi.com%2F',
  'referral.socials.twitter':
    'https://twitter.com/intent/tweet?text=%C2%A1Acabo%20de%20hacer%20mi%20declaraci%C3%B3n%20de%20renta%20con%20tributi.com%20y%20fue%20facil%C3%ADsimo%2C%20s%C3%BAper%20recomendado%20%40tributi_online%21%20%F0%9F%8E%89%0A%0A%F0%9F%9A%80%20Si%20usas%20mi%20c%C3%B3digo%20{referral_code}%20te%20dan%2020%25%20de%20descuento%20%23DeclaraConTributi',
  'referralButton.title': 'Gana $30.000 por cada referido',
  'filings.awareness.title': 'Declaración $maxYear',
  'filings.awareness.content':
    'En este momento no es posible realizar la declaración del año $maxYear. Te avisaremos tan pronto como puedas diligenciar este año gravable.',
  'filings.header.heading': 'Mis declaraciones',
  'filings.header.accountant.createClient': 'Crear cliente',
  'filings.header.taxFiler.dek':
    'Acá puedes gestionar tus declaraciones de renta',
  'filings.header.taxFiler.dekExpanded': ' y elaborar la de otras personas',
  'filings.header.accountant.dek':
    'Acá puedes gestionar las declaraciones de los clientes que vas a asistir',
  'filings.footer.title':
    'También puedes gestionar las declaraciones de otras personas o familiares',
  'filings.footer.dek': 'Elaborar declaración de otra persona',
  'filings.table.edit': 'Editar',
  'filings.table.enhancePlan': '⭐️ Cambiar plan',
  'filings.table.deletePerson.cancel': 'Cancelar',
  'filings.table.deletePerson.ok': 'Eliminar',
  'filings.table.deletePerson.title': '¿Quieres eliminar a esta persona?',
  'filings.table.year': 'Año:',
  'filings.table.taxYear': 'Año Gravable',
  'filings.table.dueDate': 'Fecha de vencimiento',
  'filings.table.plan': 'Plan',
  'filings.table.actions': 'Acciones',
  'filings.onboarding.selectedObjectsTitle': '$object seleccionados',
  'filings.onboarding.relevantObjectsTitle': '$object por seleccionar',
  'filings.onboarding.selectedObjectSubtitle':
    'Estos son los $object que se han seleccionado para el año $year',
  'filings.onboarding.relevantObjectSubtitle':
    'Estos son $object que puedes seleccionar',
  'filings.onboarding.partialMessageTop':
    'Algunas preguntas deben completarse, puedes hacerlo ahora o avanzar a las próximas pestañas.',
  'filings.onboarding.partialMessageBottom':
    'Recuerda que no puedes tener pendientes al momento de elaborar tu declaración.',
  'filings.personForm.addNew': 'Agregar nueva',
  'filings.personForm.edit': 'Editar',
  'filings.personForm.person': 'persona',
  'filings.personForm.create': 'Crear',
  'filings.personForm.save': 'Guardar',
  'filings.personForm.id.rule.message': 'El documento no es válido',
  'filings.personForm.passport.rule.message': 'El pasaporte no es válido',
  'filings.personForm.id.rule.minLength':
    'Este campo debe ser de mínimo de $minDigitsDocument carácteres.',
  'filings.filing.button.start': 'Comenzar',
  'filings.filing.button.continue': 'Continuar',
  'filings.filing.popConfirmRemove.cancel': 'Cancelar',
  'filings.filing.popConfirmRemove.ok': 'Eliminar',
  'filings.filing.popConfirmRemove.text': '¿Quieres eliminar esta declaración?',
  'filings.filing.buttonRemove.tooltip':
    'Esta declaración ya tiene un pago aprobado, así que no puede ser eliminada',
  'filings.filing.pendingPayment': 'Pago pendiente',
  'filings.filing.changePlan': '⭐️ Cambiar Plan',
  'filings.onboarding.modal.declarationWithoutPlan.title':
    'Declaración sin plan',
  'filings.onboarding.modal.declarationWithoutPlan.text':
    'Esta declaración no tiene un plan seleccionado, por favor indicale al usuario que seleccione un plan para que puedas continuar normalmente.',
  'filings.onboarding.modal.warningMessageErrorDeclaration':
    'Error en la declaración del $MAX_TAX_YEAR',
  'filings.onboarding.modal.warnigPreviousMaxTaxYear.title':
    'Declaración de renta año $taxYear',
  'filings.onboarding.modal.warnigPreviousMaxTaxYear.button.keep':
    'Sí, continuar con la declaración para el $taxYear',
  'filings.onboarding.modal.warnigPreviousMaxTaxYear.button.go':
    'No, deseo iniciar la declaración para el $MAX_TAX_YEAR',
  'filings.onboarding.modal.warnigPreviousMaxTaxYear.text':
    'Las siguientes preguntas y opciones corresponden a la declaración de renta del año $taxYear. ¿Estas seguro de continuar con la declaración del año $taxYear?',
  'login.title': 'Inicia sesión',
  'login.email.placeholder': 'Correo Electrónico',
  'login.email.rule.message.valid':
    'Por favor ingresa un formato válido de email',
  'login.email.rule.message.empty': 'Por favor ingresa tu correo electrónico',
  'login.password.placeholder': 'Contraseña',
  'login.password.rule.message': 'Por favor ingresa tu contraseña',
  'login.button.login': 'Ingresar',
  'login.link.forgotPassword': '¿Olvidaste tu contraseña?',
  'authbuttons.gmail': 'Gmail',
  'authbuttons.hotmail': 'Hotmail',
  'authbuttons.registerWith': 'Regístrate con tu',
  'authbuttons.loginWith': 'Ingresa con tu',
  'authbuttons.email': 'correo electrónico',
  'signUp.title.owner': 'Regístrate para comenzar',
  'signUp.title.client': 'Registra aquí los datos del cliente',
  'signUp.name.placeholder': 'Nombres',
  'signUp.name.rule.message': 'Por favor ingresa tus nombres.',
  'signUp.lastname.placeholder': 'Apellidos',
  'signUp.lastname.rule.message': 'Por favor ingresa tus apellidos.',
  'signUp.email.placeholder': 'Email personal',
  'signUp.email.rule.message.valid':
    'Por favor ingresa un formato válido de email personal.',
  'signUp.email.rule.message.empty': 'Por favor ingresa tu email personal.',
  'signUp.emailConfirm.placeholder': 'Confirma tu email personal',
  'signUp.emailConfirm.rule.message.valid':
    'Por favor confirma tu email personal.',
  'signUp.cc.placeholder': 'Cédula',
  'signUp.ccConfirm.placeholder': 'Confirmar cédula',
  'signUp.ccConfirm.placeholder.previous': 'Por favor confirma tu',
  'signUp.password.placeholder': 'Contraseña',
  'signUp.password.rule.message.previous': 'Por favor ingresa tu',
  'signUp.password.rule.message.cc': 'cédula',
  'signUp.password.rule.message.password': 'contraseña',
  'signUp.password.rule.message.maxLength':
    'La contraseña no puede tener mas de 20 caracteres',
  'signUp.passwordConfirm.placeholder': 'Confirma contraseña',
  'signUp.button.register.owner': 'Registrarme',
  'signUp.button.register.client': 'Crear cuenta del cliente',
  'signUp.signInHere': 'Ingresa aquí',
  'signUp.question.youHaveAccount': '¿ Ya tienes cuenta ?',
  'signUp.select.rule.message': 'Por favor selecciona un canal de ventas.',
  'signUp.salesChannel': 'Canal de ventas',
  'signUp.select.chanel.1': 'Alkosto',
  'signUp.select.chanel.2': 'Seguros Exito',
  'signUp.advisorCode.placeholder': 'Código del asesor',
  'signUp.advisorCode.rule.message': 'Por favor ingresa tu código de vendedor.',
  'signUp.documentId.invalid': 'Este documento no es válido',
  'termsAndConditionsControl.IAgree': 'Acepto los',
  'termsAndConditionsControl.text':
    'Términos y condiciones y la Política de privacidad y de tratamiento de datos',
  'plans.title': 'Declarar la renta nunca fue tan fácil y rápido',
  'plans.yourDueDate': 'Tu declaración se vence el',
  'plans.couponRedeemed':
    '¡Felicitaciones! El cupón fue redimido. Ahora puedes seleccionar el plan que quieras',
  'plans.planProTextHighlight':
    'Un contador certificado te atiende en vivo \ny hace todo por ti',
  'plans.planRegularTextHighlight':
    'Hazlo con el soporte de nuestro chat en vivo',
  'plans.requestNotProcessed':
    'No se pudo procesar la solicitud, por favor intenta más tarde',
  'plans.modalEarlyAdpoters.title': 'Has llegado temprano',
  'plans.modalEarlyAdpoters.text.first':
    'Recientemente habilitamos la elaboración de la declaración de renta para el año gravable 2021. Sin embargo, algunas funcionalidades, como la de validación automática de certificados, todavía no están disponibles.',
  'plans.modalEarlyAdpoters.text.second':
    'Puedes regresar en unos días o si deseas continuar te obsequiamos un descuento del 25% para agradecerte la comprensión.',
  'plans.modalEarlyAdpoters.coupon': 'Cupón:',
  'plans.modalEarlyAdpoters.codeCoupon': 'MADRUGADORPROMO',
  'plans.modalEarlyAdpoters.text.thanks': '¡Gracias!',
  'plans.modalEarlyAdpoters.button.ok': 'Ok',
  'plans.modalAssitedPlan.title': 'Proceso Tributi Pro',
  'plans.modalAssitedPlan.button.back': 'Atrás',
  'plans.modalAssitedPlan.button.readyToSchedule': 'Estoy listo para agendar',
  'plans.modalAssitedPlan.subtitle': 'En resumen:',
  'plans.modalAssitedPlan.orderList.item1':
    'Te mostraremos un calendario para que selecciones el día y la hora en la que quieres tu asistencia.',
  'plans.modalAssitedPlan.orderList.item2': 'Realiza el pago de tu plan Pro.',
  'plans.modalAssitedPlan.orderList.item3':
    'Listo, solo resta esperar al día de tu cita para iniciar el proceso con tu contador asignado.',
  'plans.modaCancelCalendly.title': 'No pudimos agendar tu cita',
  'plans.modaCancelCalendly.text.yourDeclarationExpire':
    'Tu declaración vence el',
  'plans.modaCancelCalendly.text.youSelectedCloseDate':
    'y seleccionaste una fecha muy cercana.',
  'plans.modaCancelCalendly.text.toGiveYouBetterAdvice':
    'Para darte una mejor asesoría te recomendamos agendar la cita antes del',
  'plans.modaCancelCalendly.text.orBeforeDueDate':
    'o después de la fecha de vencimiento de tu declaración.',
  'plans.modaCancelCalendly.button': 'Entendido',
  'filings.onboarding.summary.pendingQuestions':
    'Tienes preguntas pendientes por responder',
  'filings.onboarding.summary.pendingQuestionsDek':
    'Estas preguntas nos ayudan a determinar qué certificados son necesarios para tu declaración de renta, por favor revisa las pestañas listadas a continuación:',
  'filings.onboarding.section.objectSubtitle':
    'por favor responde las siguientes preguntas',
  'filings.onboarding.section.objectSubtitlePartial':
    'Revisa los items pendientes para completar la información',
  'filings.onboarding.welcome.assistedPlan.title':
    'Ten en cuenta las siguientes instrucciones para el día de tu cita',
  'filings.onboarding.welcome.assistedPlan.text.first':
    'Tu cita ya quedó agendada para el día $appointmentDate. Es muy importante que consigas la siguiente información para ese día, ya que de esto depende que el proceso fluya con normalidad y presentes tu declaración a tiempo:',
  'filings.onboarding.welcome.assistedPlan.text.second.part1':
    '1. Busca tus credenciales de la DIAN (Plataforma MUISCA). Si no te acuerdas de ellas, no te preocupes, ',
  'filings.onboarding.welcome.assistedPlan.text.second.part2':
    ' te damos una guía de como conseguirlas.',
  'filings.onboarding.welcome.assistedPlan.text.third':
    '2. Por último, el día de tu cita puedes hacer clic en la opción INGRESA A TU CITA, que se encuentra mas abajo, para entrar a la reunión para que comience tu asistencia.',
  'filings.onboarding.welcome.assistedPlan.text.fourth':
    'El botón ¡Ya estoy con mi contador! te lleva a los primeros pasos de Tributi. Este paso solo debes hacerlo cuando estés en tu asistencia',
  'filings.onboarding.welcome.assistedPlan.link.instructive': 'AQUÍ',
  'filings.onboarding.welcome.assistedPlan.link.enterYourAppointment':
    'Ingresa a tu cita',
  'filings.onboarding.welcome.assistedPlan.button':
    '¡Ya estoy con mi contador!',
  'filings.onboarding.welcome.regularPlanVideo.title':
    '¡Estás por empezar tu declaración de renta!',
  'filings.onboarding.welcome.regularPlanVideo.text':
    'Mira este video para conocer lo fácil y rápido que es el proceso.',
  'filings.onboarding.welcome.regularPlanVideo.button': '¡Comencemos!',
  'filings.onboarding.welcome.regularPlan.title':
    '¡Queremos saber un poco más de ti!',
  'filings.onboarding.welcome.regularPlan.text.first':
    'Vamos a comenzar haciéndote unas preguntas sobre tu vida. Con esta información prepararemos tu lista personalizada de documentos necesarios para tu declaración de renta.',
  'filings.onboarding.welcome.regularPlan.text.second':
    'Guardamos tu información en todo momento, así que podrás retomar tu proceso más adelante desde donde lo dejaste, incluso desde un dispositivo diferente.',
  'filings.onboarding.welcome.regularPlan.button': '¡Comencemos!',
  'filings.onboarding.modalMigrate.uploadPreviousYearInfo.title':
    '¿Quieres cargar la información del año anterior?',
  'filings.onboarding.modalMigrate.uploadPreviousYearInfo.text':
    'Vamos a cargar la información de tu declaración del año anterior para que no la tengas que diligenciar otra vez 😃',
  'filings.onboarding.modalMigrate.uploadPreviousYearInfo.button.notContinue':
    'No, continuar sin carga',
  'filings.onboarding.modalMigrate.uploadPreviousYearInfo.button.uploadInfo':
    'Sí, cargar información',
  'filings.onboarding.modalMigrate.successfulUpload.title':
    'Carga de información completada',
  'filings.onboarding.modalMigrate.successfulUpload.text.part1':
    'Tu información ya está cargada. Puedes identificar los valores que cargamos por el icono ',
  'filings.onboarding.modalMigrate.successfulUpload.text.part2':
    ' al lado del campo',
  'filings.onboarding.modalMigrate.successfulUpload.button': 'Continuar',
  'filings.onboarding.modalMigrate.unsuccessfulUpload.title':
    'Carga de información no exitosa',
  'filings.onboarding.modalMigrate.unsuccessfulUpload.text':
    'La carga de información no se pudo completar exitosamente. Por favor intenta nuevamente.',
  'filings.onboarding.modalMigrate.unsuccessfulUpload.button.continueWithoutUpload':
    'Continuar sin carga',
  'filings.onboarding.modalMigrate.unsuccessfulUpload.button.retryUpload':
    'Reintentar Carga',
  'filings.onboarding.modalConfirm.title': 'Confirmación',
  'filings.onboarding.modalConfirm.text.first':
    'Al no conectar tu cuenta de la DIAN tendrás que hacer varios pasos manuales a lo largo del proceso. La experiencia será mucho mejor si conectas tu cuenta ¡te lo prometemos! Con la conexión podremos:',
  'filings.onboarding.modalConfirm.unordereList.item1':
    'Personalizar la aplicación para que solo veas lo relevante para ti según tu historial tributario.',
  'filings.onboarding.modalConfirm.unordereList.item2':
    'Precargar muchísima información para que tú no la tengas que buscar y adjuntar',
  'filings.onboarding.modalConfirm.unordereList.item3': ' ',
  'filings.onboarding.modalConfirm.text.second':
    'Recuerda que la conexión es totalmente segura.',
  'filings.onboarding.modalConfirm.link.recoverPassword':
    '¿Cómo recuperar la contraseña?',
  'filings.onboarding.modalConfirm.text.third':
    'Si no recuerdas tu contraseña, te mostramos cómo puedes recuperarla haciendo clic en',
  'filings.onboarding.modalConfirm.text.thirdComplement': ' ',
  'filings.onboarding.modalConfirm.button.fourth':
    '¿Estás seguro que deseas responder las preguntas manualmente?',
  'filings.onboarding.modalConfirm.button.back': 'Atrás',
  'filings.onboarding.modalConfirm.button.answerQuestions':
    'Responder preguntas',
  'filings.onboarding.rpaContainer.title': 'Conecta tu cuenta de la DIAN',
  'filings.onboarding.rpaContainer.subtitle':
    'La conexión es completamente segura y automática',
  'filings.onboarding.rpaContainer.successTitle': '¡Felicitaciones!',
  'filings.onboarding.rpaContainer.successSubtitle':
    'Tu información ha sido descargada exitosamente.',
  'filings.onboarding.rpaContainer.dianWidget.subtitle':
    'Puedes descargar los certificados para guardarlos en tus registros.',
  'filings.onboarding.rpaContainer.dianWidget.downloadButton':
    'Descargar archivos',
  'filings.onboarding.rpaContainer.dianWidget.resetButton':
    'Reiniciar conexión',
  'filings.onboarding.rpaContainer.dianWidget.text':
    'A continuación puedes revisar las respuestas que obtuvimos de la conexión a la DIAN, <b>por favor verifica que tu información esté correcta</b>.',
  'filings.onboarding.rpaContainer.button.connect': 'Conectar con DIAN',
  'filings.onboarding.rpaContainer.button.answerManually':
    'Responder manualmente',
  'filings.onboarding.rpaContainer.questionRender.titleRpaConnection':
    'Si no deseas descargar tu información automáticamente',
  'filings.onboarding.rpaContainer.questionRender.titleDefault': 'DIAN',
  'filings.onboarding.rpaContainer.modalCancelDian.title': 'Eliminar conexión',
  'filings.onboarding.rpaContainer.modalCancelDian.text':
    '¿Estás seguro que deseas eliminar la conexión con la DIAN? Al eliminarla podrás volver a intentarlo o tendrás que responder las preguntas manualmente',
  'filings.onboarding.rpaContainer.modalCancelDian.button.ok': 'Si',
  'filings.onboarding.rpaContainer.modalCancelDian.button.cancel': 'No',
  'filings.onboarding.rpaContainer.connectionProgress':
    'Conectando con tu cuenta de la DIAN',
  'filings.onboarding.rpaContainer.customAnswers.subtitle':
    'Por favor responde las siguientes preguntas:',
  'filigns.onboarding.Belvo.title': 'Conecta tu cuenta',
  'filigns.onboarding.Belvo.text':
    'Para obtener automáticamente tus certificados tributarios, la conexión es totalmente segura y automática',
  'filigns.onboarding.Belvo.button.connect': 'Conectar',
  'filigns.onboarding.Belvo.button.retryConnect': 'Reintentar conexión',
  'filigns.onboarding.Belvo.button.doNotConnect':
    'No quiero conectar mi cuenta',
  'filigns.onboarding.Belvo.button.downloadCertificates':
    'Descargar certificados',
  'filigns.onboarding.Belvo.button.cancel': 'Cancelar',
  'filigns.onboarding.Belvo.button.delete': 'Eliminar',
  'filigns.onboarding.Belvo.modalCancelOrDeleteConnection.titleCancel':
    'Cancelar conexión',
  'filigns.onboarding.Belvo.modalCancelOrDeleteConnection.titleDelete':
    'Eliminar conexión',
  'filigns.onboarding.Belvo.modalCancelOrDeleteConnection.contentCancel':
    '¿Estás seguro que deseas cancelar la conexión con el banco? Al cancelarla podrás volver a intentarlo o tendrás que responder las preguntas manualmente',
  'filigns.onboarding.Belvo.modalCancelOrDeleteConnection.contentDelete':
    '¿Estás seguro que deseas eliminar la conexión con el banco? Al elminarla podrás volver a intentarlo o tendrás que responder las preguntas manualmente',
  'filigns.onboarding.Belvo.gettingCertificates.title':
    'Obteniendo tus certificados tributarios',
  'filigns.onboarding.Belvo.downloadedInfo.title': '¡Felicidades!',
  'filigns.onboarding.Belvo.button.connectWithBank': 'conexión con el banco',
  'filigns.onboarding.summary.title': 'Tu lista de certificados personalizada',
  'filigns.onboarding.summary.text':
    'Esta es la lista de certificados que necesitamos para elaborar tu declaración según tus respuestas. Si no estás seguro cómo conseguir los certificados, recuerda que al lado de cada uno está el botón "Cómo conseguirlo" en el cual te explicamos el paso a paso para cada uno. <br/>🎉 ¡Ya casi terminamos! 🎉',
  'filings.onboarding.summary.howToCompleteSection':
    '¿Cómo completar esta sección?',
  'filings.onboarding.summary.button.reviewAsTaxfiler':
    'Quiero revisar mi declaración',
  'filings.onboarding.summary.button.reviewAsUser':
    'Elaborar declaración como Usuario',
  'filings.onboarding.summary.button.reviewAsAssistant':
    'Quiero revisar la declaración',
  'filings.onboarding.summary.button.reviewAsAccountantApp':
    'Elaborar declaración',
  'filings.onboarding.summary.button.reviewAsAccountant':
    'Elaborar declaración como contador',
  'filings.onboarding.summary.button.sendDocuments':
    'Enviar lista de documentos al usuario',
  'filings.onboarding.summary.tootltip.hasNoPayment':
    'No se puede elaborar como usuario porque la declaración no tiene pago',
  'filings.onboarding.summary.textFooter':
    'Podrás revisar y editar tu declaración todas las veces que quieras antes de presentarla',
  'filings.onboarding.summary.modalDeleteCertificate.title':
    'Eliminar Certificado',
  'filings.onboarding.summary.modalDeleteCertificate.text':
    '¿Estás seguro que deseas eliminar este certificado?',
  'filings.onboarding.summary.modalDeleteCertificate.buttonOk': 'Si',
  'filings.onboarding.summary.modalDeleteCertificate.buttonCancel': 'No',
  'filings.onboarding.summary.modalDeleteCertificate.error':
    'No se pudo eliminar el certificado, intentalo de nuevo más tarde',
  'filings.onboarding.summary.modalDeleteInstance.title': 'Eliminar Elemento',
  'filings.onboarding.summary.modalDeleteInstance.text':
    '¿Estás seguro que deseas eliminar este elemento?',
  'filings.onboarding.summary.modalDeleteInstance.buttonOk': 'Si',
  'filings.onboarding.summary.modalDeleteInstance.buttonCancel': 'No',
  'filings.onboarding.summary.partiallySavedAnswers':
    'Tus respuestas han sido guardadas parcialmente',
  'filings.onboarding.summary.answersSavedSuccessfully':
    'Tus respuestas han sido guardadas exitosamente',
  'filings.onboarding.summary.errorSavingAnswers':
    'Ocurrió un error, por favor intentalo nuevamente.',
  'filings.onboarding.summary.modalPendingInfo.title': 'Información pendiente',
  'filings.onboarding.summary.modalPendingInfo.text':
    'Tienes información pendiente en la pestaña de "$message". Por favor complétala antes de continuar.',
  'filings.onboarding.summary.modalPendingInfo.button': 'Ok',
  'filings.onboarding.summary.modalWithoutPlan.title': 'Declaración sin plan',
  'filings.onboarding.summary.modalWithoutPlan.text':
    'Esta declaración no tiene un plan seleccionado, por favor indicale al usuario que seleccione un plan para que puedas continuar normalmente.',
  'filings.onboarding.summary.modalConfirmWithoutVideo.title':
    'Elaborar declaración',
  'filings.onboarding.summary.modalConfirmWithoutVideo.text':
    '¿Estás seguro de que quieres elaborar tu declaración? En caso de hacerlo, no recibirás el video explicativo de la declaración por parte de tu contador, deberás contactarlo para que te asista con lo que necesites.',
  'filings.onboarding.summary.modalConfirmWithoutVideo.buttonCancel': 'Cerrar',
  'filings.onboarding.summary.modalConfirmWithoutVideo.buttonOk':
    'Estoy seguro',
  'filings.onboarding.summary.modalVerifyCetificates.title':
    'Elaborar declaración',
  'filings.onboarding.summary.modalVerifyCetificates.text':
    'Verifica tus certificados, aún tienes algunos pendientes por procesar.',
  'filings.onboarding.summary.modalVerifyCetificates.button': 'Ok',
  'filings.onboarding.summary.modalUsedCoupon.title': 'Oops, lo sentimos',
  'filings.onboarding.summary.defaultError.markup':
    '<p>Encontramos un error inesperado en la información que ingresaste a nuestra plataforma, por favor vuelve a intentar elaborarla. Si el error persiste, escríbenos por nuestro foro para ayudarte a solucionar el problema.</p>',
  'filings.onboarding.summary.modalUsedCoupon.text.first':
    'El cupón que usó tu cliente es solo válido para la primera compra y vemos que ya ha elaborado declaraciones con nosotros antes.',
  'filings.onboarding.summary.modalUsedCoupon.text.second':
    'Te invitamos a indicarle a tu cliente que realice el pago.',
  'filings.onboarding.summary.modalUsedCoupon.text.third':
    'El cupón que usaste es solo válido para tu primera compra y vemos que ya has elaborado declaraciones con nosotros antes.',
  'filings.onboarding.summary.modalUsedCoupon.text.fourth':
    'Te invitamos a realizar el pago para continuar.',
  'filingStatus.engine.title': '¡Ya estamos elaborando tu declaración!',
  'filingStatus.engine.text':
    'Ya recibimos tus documentos y los estamos revisando. Tu declaración de renta estará <b>lista en un máximo de $expectedDeadline horas. </b> Puedes cerrar el navegador, no se perderá la información que ingresaste y tampoco se detendrá el proceso de elaboración. Por favor regresa para poder descargar tu declaración de renta una vez esté lista.',
  'filingStatus.engine.error':
    'Error al volver a la declaración, verifica tu conexión e intenta de nuevo',
  'filingStatus.engine.realLoad':
    'Esto carga en tiempo real, no refresques la pantalla',
  'filingStatus.engine.subtitleSteps': 'Revisa el estado de tu declaración:',
  'filingStatus.engine.steps':
    'Recibida|Revisión de documentos|Elaborando|Revisión de declaración|Elaborando anexos|Terminada',
  'filingStatus.engine.buttonCancel':
    'Cancelar elaboración y editar información',
  'payment.success.titleCustomer':
    '¡Felicitaciones, tu declaración de renta ya está lista!',
  'payment.success.titleAccountant': '¡La declaración de renta ya está lista!',
  'payment.succes.subtitleCustomer':
    'Sigue los pasos a continuación para presentar tu declaración de renta:',
  'payment.success.titleAssited':
    'La declaración de renta del usuario está lista, revísala y confirma que todo esté bien para finalizar el proceso',
  'payment.succes.lastStepCustomer.title':
    '¡Listo! has terminado todo el proceso',
  'payment.succes.lastStepCustomer.text':
    'Si te ha gustado hacer tu declaración con <b>Tributi</b>, no dudes en recomendarnos con tus amistades para también hacerles la vida más fácil.<br/><br/>Tienes el código <b>$code</b> para ganar $30,000 en efectivo por cada declaración que preparen tus amistades. Además, esas personas recibirán un descuento del 20% en la preparación de su declaración.',
  'payment.succes.lastStepCustomer.sharedSocial': 'Compartir:',
  'payment.succes.button.editStatement': 'Editar Declaración',
  'validateEmail.title': 'Todavía no has validado tu email',
  'validateEmail.subtitle':
    'Es necesario validar tu email antes de poder descargar tu declaración.',
  'validateEmail.callToAction': 'Haz clic en el link del email enviado a:',
  'validateEmail.button.send': 'Reenviar correo',
  'validateEmail.button.sendAgainTimer': 'Reenviar en $time',
  'validateEmail.wrongAddress': '¿Esa dirección está mal?',
  'validateEmail.reviewOnGmail': 'Ver correo en Gmail',
  'validateEmail.sentMessage':
    'Hemos enviado un correo electrónico para validar tu email',
  'validateEmail.errorMessage':
    'Ocurrió un error al enviar el correo de validación',
  'validateEmail.changeEmail.title': 'Actualizar email',
  'validateEmail.changeEmail.description': 'Ingresa tu correo 2 veces',
  'validateEmail.changeEmail.emailInput.placeholder': 'Ingresar email',
  'validateEmail.changeEmail.confirmEmailInput.placeholder': 'Confirmar email',
  'validateEmail.changeEmail.backButton': 'Atrás',
  'validateEmail.changeEmail.updateButton': 'Actualizar',
  'validateEmail.changeEmail.formMessage.required': 'Este campo es obligatorio',
  'validateEmail.changeEmail.formMessage.email':
    'Por favor ingresa un formato válido de email',
  'validateEmail.changeEmail.formMessage.unmatchingEmails':
    'Las direcciones de email que ingresaste no coinciden',
  'validateEmail.changeEmail.request.success':
    'Email actualizado exitosamente. Revisa el correo que acabamos de enviarte al nuevo email.',
  'validateEmail.changeEmail.request.error':
    'No pudimos cambiar tu email, intenta nuevamente',
  'validateEmail.changeEmail.request.forbidden':
    'Ese email ya se encuentra registrado.',
  'payment.success.taxPlaning.title':
    'Podrías pagar menos impuesto el próximo año 🤩',
  'payment.success.taxPlaning.subtitle':
    'De acuerdo con tu información, podrías reducir el valor a pagar en tu impuesto de renta del 2024. ¡Nosotros te ayudamos! Agenda hoy tu cita y recibe asesoría gratuita con Tributi Finanzas Personales.',
  'payment.success.statement.filePendingAccountant':
    'Presenta la declaración de renta cuando tu cliente la apruebe',
  'payment.success.user.fileStatement.title':
    'Presenta tu declaración de renta',
  'payment.success.accountant.step1.title':
    'Revisa que los valores usados en la declaración sean correctos y completos',
  'payment.success.user.step1.title':
    'Revisa que los valores usados en tu declaración sean correctos y completos',
  'payment.success.accountant.step1.subtitle':
    'Puedes ingresar a editar y recalcular la declaración todas las veces que quieras.',
  'payment.success.user.step1.subtitle':
    'Puedes ingresar a editar y recalcular tu declaración todas las veces que quieras.',
  'payment.success.taxPayment.title': 'Paga tu impuesto',
  'payment.success.manual.taxPayment.subtitle':
    'Revisa las instrucciones para que puedas realizar el pago de tu declaración.',
  'payment.success.manual.file.downloadDraft.title': 'Descargar información',
  'payment.success.online.fileInit.title':
    'Presentemos tu declaración de renta. Nosotros hacemos todo por ti',
  'payment.success.online.fileInit.subtitle':
    '¡Ahorra tiempo! Vamos a conectar tu cuenta de la DIAN para presentar tu declaración de forma online y automática.',
  'payment.success.online.inPersonFile.title':
    'Prefieres presentarla manualmente, ¡muy bien!',
  'payment.success.online.inPersonFile.subtitle':
    'Te ayudamos con el documento que necesitas llevar para presentar en el banco y una guía completa con el paso a paso que debes seguir para presentarla.',
  'payment.success.online.araneaLogin.title': 'Conecta tu cuenta de la DIAN',
  'payment.success.online.araneaLogin.progressTitle':
    'Conectando con tu cuenta de la DIAN',
  'payment.success.online.fileSignInit.title':
    'Todo listo para presentar tu declaración',
  'payment.success.online.fileSignInit.subtitle':
    'Ya estamos conectados a tu cuenta de la DIAN y está todo listo para finalizar el proceso de presentación. La presentación de tu declaración es definitiva.',
  'payment.success.online.eSignAwareness.title':
    'Necesitamos habilitar tu firma electrónica',
  'payment.success.online.eSignAwareness.subtitle':
    '<p>Detectamos que no tienes habilitado el mecanismo de firma electrónica para presentar tu declaración de renta en el portal de la DIAN. No te preocupes, con tu permiso, vamos a hacer este proceso por ti. ¿Está bien?</p><p><b>¿Por qué habilitar tu firma electrónica?</b></p><ul><li>Pago online rápido y fácil</li><li>Al no tenerla, tendrás que ir presencialmente al banco</li><li>Tu contraseña estará segura y tus datos están protegidos</li></ul>',
  'payment.success.online.eSignInput.title':
    'Se requiere la contraseña de tu firma electrónica',
  'payment.success.online.fileError.title': 'Lo sentimos...',
  'payment.success.online.fileError.filed.subtitle':
    'Tu declaración no pudo ser presentada porque ya tienes otra declaración presentada para este mismo año. Escríbenos a soporte si deseas que te ayudemos a presentar esta declaración.',
  'payment.success.online.fileError.unauthorized.subtitle':
    'La contraseña de tu cuenta de la DIAN que utilizaste previamente ya no es válida. Por favor conecta tu cuenta de la DIAN nuevamente.',
  'payment.success.online.fileError.general.subtitle':
    'Tu declaración no pudo ser presentada. Se presentaron fallas técnicas con la plataforma de la DIAN.|Por favor intenta nuevamente.',
  'payment.success.online.fileFinished.title':
    '¡Listo, tu declaración fue presentada!',
  'payment.success.online.fileFinished.subtitle':
    'Descarga y guarda la declaración en tus archivos',
  'payment.success.online.araneaLogin.modal.title': 'Conexión DIAN',
  'payment.success.online.title': 'Presentar declaración de renta',
  'payment.success.statement.filed.title':
    '¡Tu declaración de renta ha sido presentada exitosamente!',
  'payment.success.statement.filed.subtitle':
    'Descarga y guarda el formulario de tu declaración de renta presentada.',
  'payment.success.taxPayment.pendingSubmit.subtitle':
    'Aquí te daremos instrucciones de pago cuando termines el paso anterior de presentación.',
  'payment.success.taxPayment.submitted.subtitle':
    'Ahora puedes pagar online sin salir de casa.',
  'payment.success.howToFile.title': '¿Cómo presentarla?',
  'payment.succces.dueDatePassedPenalty.subtitle':
    'Tu fecha de vencimiento fue el <strong>$formattedDueDate</strong>. Preséntala antes del <strong>$lastDayOfMonth</strong> para evitar incremento en la sanción a pagar',
  'payment.succces.dueDatePassed.subtitle':
    'Tu fecha de vencimiento fue el <strong>$formattedDueDate</strong>. Preséntala hoy mismo para evitar incremento en los intereses a pagar.',
  'payment.succces.statementFiled.subtitle':
    'Ya tienes una declaración de renta presentada, si quieres presentar una corrección te ayudamos con el borrador y las instrucciones.',
  'payment.success.onTime.subtitle':
    'Preséntala antes del <strong>$formattedDueDate.</strong>',
  'payment.success.taxPaymentOther.title': '¿Cómo pagar?',
  'payment.success.taxPaymentOther.link':
    'https://www.tributi.com/ayuda/como-puedes-pagar-por-otros-metodos-de-pago',
  'payment.success.online.taxPayment.linkGenerated.subtitle': '',
  'payment.success.online.taxPayment.linkGenerated.title': '',
  'payment.success.online.taxPayment.linkGenerated.text': '',
  'payment.success.online.taxPayment.dek':
    'Vamos a usar el formulario de pago correspondiente a tu declaración de renta presentada para realizar el pago en el portal de pagos PSE de la DIAN',
  'payment.success.online.taxPayment.subtitle': 'Formulario de pago:',
  'payment.success.online.taxPayment.link.title': 'Descargar formulario',
  'payment:success.online.taxPayment.taxDue.title': 'Valor del pago:',
  'payment:success.online.taxPayment.formId.title': 'Número de formulario:',
  'payment.success.online.taxPayment.bankLabel.title':
    'Por favor selecciona el banco con el que harás el pago PSE',
  'payment.success.online.taxPayment.caveat.text':
    '<b>Importante: </b> vas a salir de Tributi e irás a la página de pagos de la DIAN. Después que tengas tu comprobante de pago, guárdalo y <b>¡habrás terminado!</b>',
  'payment.success.online.taxPayment.bankSelect.required.text':
    'Debes seleccionar un banco para realizar el pago.',
  'payment.success.online.taxPayment.bankSelect.placeholder.text':
    'Seleccionar un banco',
  'payment.success.online.taxPayment.submit.text': 'Ir a pagar',
  'payment.success.taxPayment.downloadForm.text': '',
  'payment.success.taxPayment.openModal.text': 'Pagar online',
  'payment.sucesss.taxPayment.stepOption1.text': ' ',
  'payment.sucesss.taxPayment.stepOption2.text': ' ',
  'payment.success.taxPayment.paymentManual.text':
    '¿Cómo pagar con otros métodos?',
  'payment.success.taxPayment.downloadReceipt.text': 'Descargar recibo de pago',
  'payment.sucesss.loading': 'Generando...',
  'payment.succcess.taxPayment.receiptAwareness.text':
    'Ten en cuenta que este recibo de pago solo te sirve para hacer el pago hasta el <strong>$formatted490Date</strong> ',
  'payment.couponRedeemed.text': '¡Felicitaciones! El cupón fue redimido.',
  'payment.caption.text':
    '$name, el valor del servicio de Tributi por tu $serviceDescription es',
  'payment.captionComplement.text':
    'Para continuar el proceso, solo debes completar el pago por el servicio para comenzar a elaborar tu declaración.',
}

configure({ adapter: new Adapter() })
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
global.translate = (key) => {
  return locales[key]
}
