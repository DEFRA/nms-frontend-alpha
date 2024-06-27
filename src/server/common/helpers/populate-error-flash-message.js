const populateErrorFlashMessage = (request) => (message) =>
  request.yar.flash('validationFailure', {
    formErrors: { file: { message } }
  })

export { populateErrorFlashMessage }
