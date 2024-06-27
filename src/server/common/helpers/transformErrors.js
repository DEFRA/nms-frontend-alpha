const transformErrors = async (formOptions, error) => {
  const newFormOptions = { ...formOptions }
  Object.keys(error._original).forEach((field) => {
    let fieldOptions = { ...newFormOptions[field] }
    fieldOptions = {
      ...fieldOptions,
      value: error._original[field]
    }
    let errorMessage = ''
    const hasError = error.details.filter((item) => {
      if (item?.context?.errors) {
        return item.context.errors.includes(field)
      } else {
        return item.path.includes(field)
      }
    })

    if (hasError && hasError.length > 0 && hasError[0]?.message) {
      errorMessage = `${hasError[0].message}.`
      const updatedClasses = fieldOptions.classes
        ? `${fieldOptions.classes} govuk-input--error`
        : 'govuk-input--error'
      fieldOptions = {
        ...fieldOptions,
        classes: updatedClasses,
        errorMessage: {
          ...fieldOptions.errorMessage,
          text: errorMessage
        }
      }
    }
    newFormOptions[field] = { ...fieldOptions }
  })
  return newFormOptions
}

export default transformErrors
