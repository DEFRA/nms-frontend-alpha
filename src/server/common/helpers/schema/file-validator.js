import Joi from 'joi'

const defaultFileName = 'The selected file'

const fileValidator = Joi.extend((joi) => {
  return {
    type: 'file',
    base: joi.object(),
    validate(value, helpers) {
      const filename = helpers.schema.$_getFlag('showFileName')
        ? value.filename
        : defaultFileName

      // Errors from the uploader
      if (value?.hasError === true) {
        return {
          value,
          errors: helpers.message(
            value?.errorMessage.replace(defaultFileName, filename)
          )
        }
      }
      return { value }
    },
    rules: {
      // Include the filename in the error message
      showFileName: {
        method() {
          return this.$_setFlag('showFileName', true)
        }
      }
    }
  }
})

export { fileValidator }
