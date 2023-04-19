import React from 'react'

import { fireEvent, act } from '@testing-library/react'
import {
  mockWithProviders,
  themeProvider,
} from '../../../helpers/__mocks__/mock-providers'

import ExpandableMessage from '../index'

const setup = () => {
  const props = {
    message:
      '<p>Revisamos la información que ingresaste y la comparamos con la información que la DIAN reporta sobre ti y parece que te faltó ingresar la siguiente información:</p><ul><li>Indicaste que los ingresos totales que obtuviste por honorarios, servicios y comisiones fueron de $43,840,000, pero en la DIAN este ingreso esta reportado por $70,840,000, en un total de 2 reportes hechos por las siguientes empresas o personas: GAMEOS, ALMICAVA S.A.S <a target="_blank" href="https://www.tributi.com/ayuda/registro-unico-tributario-rut">¿Cómo solucionarlo?</a></li></ul><p>Una vez hayas ingresado la información faltante, vuelve a dar click en el botón de <b>Elaborar declaración</b> y elaboraremos tu declaración de nuevo. Si necesitas ayuda ingresando esta nueva información, no dudes en escribirnos por el chat en vivo en la página</p>',
  }
  const wrapper = mockWithProviders(<ExpandableMessage {...props} />, [
    themeProvider(),
  ])
  return { wrapper }
}

describe('ExpandableMessage spec', () => {
  it('should render component correctly', () => {
    const { wrapper } = setup()
    expect(wrapper.getByRole('button').textContent).toContain('Mostrar más')
  })

  it('should render correctly when text expanded', async () => {
    const { wrapper } = setup()
    const button = wrapper.getByRole('button')
    await act(async () => {
      fireEvent.click(button)
    })
    expect(wrapper.getByRole('button').textContent).toContain('Mostrar menos')
  })

  it('should render correctly when click text compressed', async () => {
    const { wrapper } = setup()
    const buttonExpanded = wrapper.getByRole('button')
    await act(async () => {
      fireEvent.click(buttonExpanded)
    })
    expect(wrapper.getByRole('button').textContent).toContain('Mostrar menos')

    const buttonCompressed = wrapper.getByRole('button')
    await act(async () => {
      fireEvent.click(buttonCompressed)
    })

    expect(wrapper.getByRole('button').textContent).toContain('Mostrar más')
  })
})
