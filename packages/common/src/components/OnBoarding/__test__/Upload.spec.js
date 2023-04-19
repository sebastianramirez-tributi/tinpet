import React from 'react'
import { mount } from 'enzyme'
import axios from 'axios'
import message from 'antd/lib/message'

import Upload from '../Upload/content'
import { ROLES } from '../../../constants/person'

import {
  blankCertificate,
  exogenaCertificate,
  failedCertificate,
  missingInfoCertificate,
  partialAutomatedCertificate,
  passwordCerticate,
  processingCertificate,
  uploadedCertificate,
  manualCompletedCertificate,
} from './mockData/Upload'
import {
  MockWithProvidersLegacy,
  themeProvider,
  reduxProvider,
  routerProvider,
  rootContextProvider,
} from '../../../helpers/__mocks__/mock-providers'
import { overwriteStore } from '../../../helpers/__mocks__/mock-reducer'
import { refCertificates } from '../../../config/firebase'
import { captureSentryException } from '../../../sentry'
import { CERTIFICATE_TYPES } from '../../../constants/certificates'

const setup = (role, newProps = {}) => {
  const FILING_ID = 'test-filing-id'
  const props = {
    certificateCode: '1.',
    fillingId: FILING_ID,
    onClickDontHave: jest.fn(),
    instanceId: '123',
    removeCertificates: jest.fn(),
    notifyLoading: jest.fn(),
    syncInstanceCertificates: jest.fn(),
    updateCertificatePassword: jest.fn(),
    loadSummary: jest.fn(),
    markCertificateAsCancel: jest.fn(),
    personalInfo: {
      id: 'testing-id',
      consumer_app: 'testing-consumer-app',
      role,
      currentFiling: {
        id: FILING_ID,
      },
    },
    ...newProps,
  }

  const store = overwriteStore({})

  const wrapper = MockWithProvidersLegacy(<Upload {...props} />, mount, [
    themeProvider(),
    routerProvider(),
    reduxProvider(store),
    rootContextProvider({ isAccountantApp: false }),
  ])

  return { wrapper, props }
}

describe('<Upload />', () => {
  describe('with tax-filler user', () => {
    describe('with uploaded certificate', () => {
      beforeAll(() => {
        const { id, status } = uploadedCertificate.user_certificate
        refCertificates.doc(id).set(
          {
            id,
            status,
          },
          { merge: true }
        )
      })

      it('Should render properly with default props', async () => {
        const { wrapper, props } = setup(ROLES.TAX_FILER, {
          itemCertificate: uploadedCertificate,
        })
        const { removeCertificates } = props
        const onDelete = wrapper.find('CertificateManager').prop('onDelete')
        onDelete()
        expect(removeCertificates).toBeCalled()
        wrapper.unmount()
      })
    })

    describe('with exogena Certificate', () => {
      it('Should render properly', () => {
        const { wrapper } = setup(ROLES.TAX_FILER, {
          itemCertificate: exogenaCertificate,
        })
        expect(wrapper.find('CertificateManager').prop('certificateType')).toBe(
          CERTIFICATE_TYPES.EXOGENA
        )
      })
    })

    describe('with blank Certificate', () => {
      it('should have two buttons "Adjuntar archivo", "Ingresar info."', () => {
        const { wrapper } = setup(ROLES.TAX_FILER, {
          itemCertificate: blankCertificate,
        })
        const buttons = wrapper.find('Button')
        expect(buttons.at(0).text()).toBe('Adjuntar archivo')
        expect(buttons.at(1).text()).toBe('Ingresar info.')
      })

      it('Should upload successfully and set status', async () => {
        const UPLOAD_STATUS = 'created'
        const mockFile = new Blob(['testing'], { type: 'application/pdf' })
        mockFile.name = 'testfile.pdf'
        const { wrapper } = setup(ROLES.TAX_FILER, {
          itemCertificate: blankCertificate,
        })
        const certManagerEl = wrapper.find('CertificateManager')
        const response = {
          data: {
            id: 'test-id-blank-cert',
            status: UPLOAD_STATUS,
          },
        }
        axios.post.mockResolvedValue(response)
        await certManagerEl.prop('onUpload')('instance', undefined, mockFile)
        expect(wrapper.state('status')).toBe(UPLOAD_STATUS)
        expect(wrapper.state('processing')).toBeTruthy()
      })

      it('Should failed upload', async () => {
        const spy = jest.spyOn(message, 'error')
        const mockFile = new Blob(['testing'], { type: 'application/pdf' })
        mockFile.name = 'testfile.pdf'
        const { wrapper } = setup(ROLES.TAX_FILER, {
          itemCertificate: blankCertificate,
        })
        const certManagerEl = wrapper.find('CertificateManager')
        axios.post.mockRejectedValue({ error: true })
        try {
          await certManagerEl.prop('onUpload')('instance', undefined, mockFile)
        } catch (error) {
          expect(axios.post).toBeCalled()
          expect(message.error).toHaveBeenCalledWith(
            'Tuvimos un problema al subir tu archivo, intentalo nuevamente.'
          )
          expect(captureSentryException).toBeCalled()
          expect(captureSentryException).toHaveBeenCalledWith(error)
          expect(wrapper.state('processing')).toBeFalsy()
          spy.mockRestore()
        }
      })
    })

    describe('with processing Certificate', () => {
      it('should have two buttons "Validando..." and "Ingresar info."', () => {
        const { wrapper } = setup(ROLES.TAX_FILER, {
          itemCertificate: processingCertificate,
        })
        const buttons = wrapper.find('Button')
        expect(buttons.at(0).text()).toBe('Validando...')
        expect(buttons.at(1).text()).toBe('Ingresar info.')
      })
    })

    describe('with failed Certificate', () => {
      it('should have two buttons "Adjuntar archivo" and "Ingresar info."', () => {
        const { wrapper } = setup(ROLES.TAX_FILER, {
          itemCertificate: failedCertificate,
        })
        const buttons = wrapper.find('Button')
        expect(buttons.at(0).text()).toBe('Adjuntar archivo')
        expect(buttons.at(1).text()).toBe('Ingresar info.')
      })
    })

    describe('with password Certificate', () => {
      it('Should render properly and have an input popover with the title "Este documento tiene contraseña"', () => {
        const { wrapper } = setup(ROLES.TAX_FILER, {
          itemCertificate: passwordCerticate,
        })
        const popover = wrapper.find('InputPopover')
        expect(popover.prop('title')).toBe('Este documento tiene contraseña')
      })

      it('Should upload a password certificate properly', () => {
        const { wrapper, props } = setup(ROLES.TAX_FILER, {
          itemCertificate: passwordCerticate,
        })
        const { updateCertificatePassword } = props
        updateCertificatePassword.mockResolvedValue()
        const popover = wrapper.find('InputPopover')
        popover.prop('onDone')('testing-password')
        expect(updateCertificatePassword).toBeCalled()
      })

      it('Should failed with wrong password certificate', async () => {
        const { wrapper, props } = setup(ROLES.TAX_FILER, {
          itemCertificate: passwordCerticate,
        })
        const popover = wrapper.find('InputPopover')
        const { updateCertificatePassword } = props
        updateCertificatePassword.mockRejectedValue({
          response: { status: 400 },
        })
        popover.prop('onDone')('testing-password')
        expect(updateCertificatePassword).toBeCalled()
        try {
          await updateCertificatePassword()
        } catch {
          expect(wrapper.state('passwordFail')).toBe(
            'La contraseña ingresada no es correcta, por favor intentalo nuevamente'
          )
        }
      })

      it('Should failed with not support password certificate', async () => {
        const { wrapper, props } = setup(ROLES.TAX_FILER, {
          itemCertificate: passwordCerticate,
        })
        const popover = wrapper.find('InputPopover')
        const { updateCertificatePassword } = props
        updateCertificatePassword.mockRejectedValue({
          response: { status: 412 },
        })
        popover.prop('onDone')('testing-password')
        expect(updateCertificatePassword).toBeCalled()
        try {
          await updateCertificatePassword()
        } catch {
          expect(wrapper.state('passwordFail')).toBe(
            'No se pudo desencriptar el archivo, trata de subirlo sin contraseña'
          )
        }
      })

      it('Should failed certificate with no response', async () => {
        const spy = jest.spyOn(message, 'error')
        const { wrapper, props } = setup(ROLES.TAX_FILER, {
          itemCertificate: passwordCerticate,
        })
        const popover = wrapper.find('InputPopover')
        const { updateCertificatePassword } = props
        updateCertificatePassword.mockRejectedValue({})
        popover.prop('onDone')('testing-password')
        expect(updateCertificatePassword).toBeCalled()
        await expect(updateCertificatePassword()).rejects.toEqual({})
        expect(wrapper.state('passwordFail')).toBe('')
        expect(spy).toBeCalled()
        expect(spy).toHaveBeenCalledWith(
          'Parece que hay un error de red, intenta de nuevo'
        )
        spy.mockRestore()
      })
    })

    describe('with partial automated certificate', () => {
      it('Should render properly', () => {
        const { wrapper } = setup(ROLES.TAX_FILER, {
          itemCertificate: partialAutomatedCertificate,
        })
        const uploadFeedback = wrapper.find('UploadFeedback')
        expect(uploadFeedback.text()).toBe(
          'Necesitamos tu ayuda verificando algunos valores de este certificado, haz clic en el botón "Validar"'
        )
      })
    })

    describe('with manual completed certificate', () => {
      it('Should render properly', () => {
        const { wrapper } = setup(ROLES.TAX_FILER, {
          itemCertificate: manualCompletedCertificate,
        })
        const buttons = wrapper.find('Button')
        expect(buttons.at(0).text()).toBe('Editar')
        expect(buttons.at(1).text()).toBe('Borrar')
      })
    })

    describe('with missing information certificate', () => {
      it('Should render properly', () => {
        const { wrapper } = setup(ROLES.TAX_FILER, {
          itemCertificate: missingInfoCertificate,
        })
        const buttons = wrapper.find('Button')
        expect(buttons.at(0).text()).toBe('Ingresar info.')
      })
    })
  })

  describe('with assistant user', () => {
    describe('with uploaded certificate', () => {
      it('Should render properly with default props', () => {
        const baseProps = {
          itemCertificate: uploadedCertificate,
          handleClickDontHave: jest.fn(),
        }
        const { wrapper, props } = setup(ROLES.ASSISTANT, baseProps)
        const { onClickDontHave, instanceId } = props
        const buttons = wrapper.find('Button')
        expect(buttons.at(1).text()).toBe('Editar')
        const buttonEdit = buttons.at(1)
        buttonEdit.simulate('click', {})
        expect(onClickDontHave).toBeCalled()
        expect(onClickDontHave).toHaveBeenCalledWith(
          uploadedCertificate,
          instanceId,
          undefined,
          true,
          'processed'
        )
        expect(wrapper.state('is_alternative_questions')).toBe(true)
      })
    })

    describe('with exogena Certificate', () => {
      it('Should render properly', () => {
        const { wrapper } = setup(ROLES.ASSISTANT, {
          itemCertificate: exogenaCertificate,
        })
        const buttons = wrapper.find('Button')
        expect(buttons.at(0).text()).toBe('Adjuntar archivo')
      })
    })
  })
})
