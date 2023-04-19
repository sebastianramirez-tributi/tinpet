export const ruleEmplyField = {
  warningOnly: true,
  validator: (_, value) => {
    if (!value.length)
      return Promise.reject(new Error('El campo no puede estar vacío'))
    return Promise.resolve()
  },
}

export const rulePhoneField = {
  validator: (_, value) => {
    const phone = value || ''
    const ASCII_0 = 48
    const ASCII_9 = 57
    if (!phone.length)
      return Promise.reject(new Error('El campo no puede estar vacío'))

    const noNumbersChars = Array.from(phone).filter((element) => {
      return element.charCodeAt(0) < ASCII_0 || element.charCodeAt(0) > ASCII_9
    })

    const isValidFormat = !noNumbersChars.length

    if (!isValidFormat)
      return Promise.reject(
        new Error('No se admiten letras o signos en el número de teléfono ')
      )

    if (isValidFormat && phone.length === 10) return Promise.resolve()

    return Promise.reject(new Error('El teléfono debe ser de 10 dígitos'))
  },
}
export const ruleDocumentField = {
  validator: (_, value) => {
    const nationalId = value || ''
    const ASCII_0 = 48
    const ASCII_9 = 57
    if (!nationalId.length)
      return Promise.reject(new Error('El campo no puede estar vacío'))

    const noNumbersChars = Array.from(nationalId).filter((element) => {
      return element.charCodeAt(0) < ASCII_0 || element.charCodeAt(0) > ASCII_9
    })

    const isValidFormat = !noNumbersChars.length

    if (!isValidFormat)
      return Promise.reject(
        new Error(
          'No se admiten letras o signos en el número de identificación'
        )
      )

    return Promise.resolve()
  },
}

export const ruleNameField = {
  validator: (_, value) => {
    const firstName = value

    if (!firstName.length)
      return Promise.reject(new Error('El campo no puede estar vacío'))

    const regex =
      /^[\w\.@-\\%_;()\]#?¡[/:{ } *+,$&quot;\sñáéíóúÁÉÍÓÚüÜ\-&quot;]+$/

    if (!regex.test(firstName))
      return Promise.reject(new Error('No se admiten signos'))

    return Promise.resolve()
  },
}

export const ruleIndicativeField = {
  validator: (_, value) => {
    const indicative = value

    if (indicative === ' ')
      return Promise.reject(new Error('Debe seleccionar un indicativo'))

    return Promise.resolve()
  },
}
