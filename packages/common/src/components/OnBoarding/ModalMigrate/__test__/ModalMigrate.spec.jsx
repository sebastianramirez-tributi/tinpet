import React from 'react'
import { fireEvent, act } from '@testing-library/react'
import ModalMigrate from '../index'

import {
  mockWithProviders,
  themeProvider,
} from '../../../../helpers/__mocks__/mock-providers'

const propsMock = {
  onCancelPreload: jest.fn(),
  onPreload: jest.fn(),
  onContinue: jest.fn(),
  onClearErrorFlag: jest.fn(),
  visible: true,
}

const setup = (baseProps) => {
  const props = {
    ...propsMock,
    ...baseProps,
  }
  const wrapper = mockWithProviders(<ModalMigrate {...props} />, [
    themeProvider(),
  ])
  const { rerender } = wrapper
  return { props, wrapper, rerender }
}

describe('<ModalMigrate/>', () => {
  it('should ModalMigrate be visible', () => {
    const propsMock = {
      wasMigrated: false,
      migrationError: false,
    }
    const { wrapper } = setup({ ...propsMock })

    expect(
      wrapper.getByText('¿Quieres cargar la información del año anterior?')
    ).toBeInTheDocument()

    expect(
      wrapper.getByRole('button', { name: 'No, continuar sin carga' })
    ).toBeInTheDocument()

    expect(
      wrapper.getByRole('button', { name: 'Sí, cargar información' })
    ).toBeInTheDocument()
  })

  it('should show onContinue migrate Modal', async () => {
    const propsMigrate = {
      wasMigrated: false,
      migrationError: false,
    }
    const { props, wrapper, rerender } = setup({ ...propsMigrate })
    const { onPreload } = props
    const buttonYesMigrate = wrapper.getByRole('button', {
      name: 'Sí, cargar información',
    })
    await act(async () => {
      await fireEvent.click(buttonYesMigrate)
    })
    expect(onPreload).toBeCalled()

    const propsMigrateTrue = {
      ...propsMock,
      wasMigrated: true,
      migrationError: false,
    }
    rerender(<ModalMigrate {...propsMigrateTrue} />) // same wrappe.setProps
    expect(
      wrapper.getByText('Carga de información completada')
    ).toBeInTheDocument()
    expect(wrapper.getByText('Continuar')).toBeInTheDocument()
  })

  it('should show error migration', async () => {
    const propsMigrate = {
      wasMigrated: false,
      migrationError: false,
    }
    const { props, wrapper, rerender } = setup({ ...propsMigrate })
    const { onClearErrorFlag, onPreload } = props
    const buttonYesMigrate = wrapper.getByRole('button', {
      name: 'Sí, cargar información',
    })
    await act(async () => {
      await fireEvent.click(buttonYesMigrate)
    })
    expect(onPreload).toBeCalled()

    const propsMigrateError = {
      ...propsMock,
      wasMigrated: false,
      migrationError: true,
    }
    rerender(<ModalMigrate {...propsMigrateError} />) // same wrappe.setProps
    expect(onClearErrorFlag).toBeCalled()

    expect(
      wrapper.getByText('Carga de información no exitosa')
    ).toBeInTheDocument()

    expect(
      wrapper.getByRole('button', { name: 'Continuar sin carga' })
    ).toBeInTheDocument()

    expect(
      wrapper.getByRole('button', { name: 'Reintentar Carga' })
    ).toBeInTheDocument()
  })
})
