import pickBy from 'lodash/pickBy'

function provideFormContextValues() {
  return async (request, h) => {
    const response = request.response

    if (response.variety === 'view') {
      // Pull session from Redis directly using creatureId
      const sessionValue =
        request.params?.creatureId &&
        (await request.redis.getData(request.params.creatureId))

      if (sessionValue) {
        request.logger.debug({ sessionValue }, 'Session context info:')
      }

      const validationFailure = request.yar.flash('validationFailure')?.at(0)

      if (!response.source?.context) {
        response.source.context = {}
      }

      if (validationFailure) {
        response.source.context.isError = true
      }

      // Override order for formValues:
      // 1 - formValues from validationFailure session - (The highest priority)
      // 2 - if sessionValue exists, values from sessionValue
      // 3 - formValues from h.view() context          - (The lowest priority)

      response.source.context.formValues = {
        ...(response.source.context?.formValues &&
          response.source.context.formValues),
        ...(sessionValue?.fields && pickBy(sessionValue.fields)),
        ...(validationFailure?.formValues && validationFailure.formValues)
      }

      if (validationFailure?.formErrors) {
        response.source.context.formErrors = validationFailure?.formErrors
      }
    }

    return h.continue
  }
}

export { provideFormContextValues }
