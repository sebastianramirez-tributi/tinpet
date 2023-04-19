export const ruleVimeoValidator = (setInputError, inputName) => ({
  warningOnly: true,
  validator: (_, value) => {
    const regURL = /^https\*?:\/\/(www.)?(vimeo|loom).com\/\w+/

    if (value && regURL.test(value)) {
      setInputError(inputName, false)
      return Promise.resolve()
    } else if (value) {
      setInputError(inputName, true)
      return Promise.reject(
        new Error(
          'Debes ingresar una URL válida. Revisa las instrucciones en el video.'
        )
      )
    } else {
      setInputError(inputName, true)
      return Promise.reject(
        new Error('Es necesario ingresar el link del video')
      )
    }
  },
})
