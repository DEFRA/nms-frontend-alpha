import { populateErrorFlashMessage } from '~/src/server/common/helpers/populate-error-flash-message.js'
import { provideUploadStatus } from '../pre/provide-upload-status.js'
import { sessionTransaction } from '~/src/server/common/helpers/session-transactions.js'
import { routePaths } from '~/src/server/common/helpers/constants.js'
import upload from '../schema.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'

const statusController = {
  options: {
    pre: [provideUploadStatus('submission')]
  },
  handler: async (request, h) => {
    const { id } = request.params

    const setError = populateErrorFlashMessage(request)
    const uploadStatus = request.pre.uploadStatus
    const hasBeenVirusChecked = uploadStatus?.uploadStatus === 'ready'

    if (hasBeenVirusChecked) {
      const validationResult = upload.validate(uploadStatus.form, {
        abortEarly: false
      })

      if (validationResult?.error) {
        const errorDetails = buildErrorDetails(validationResult?.error?.details)

        request.yar.flash('validationFailure', {
          formValues: uploadStatus.form,
          formErrors: errorDetails
        })

        return h.redirect(`${routePaths.upload}/${id}`)
      }

      const fileInputStatus = uploadStatus?.form?.file
      const fileInputHasError = fileInputStatus?.hasError

      if (fileInputStatus && fileInputHasError) {
        setError(fileInputStatus.errorMessage)
        return h.redirect(`${routePaths.upload}/${id}`)
      }

      const file = uploadStatus?.form?.file
      await sessionTransaction(
        request,
        h,
        {
          file: {
            filename: file.filename,
            fileUrl: file.s3Key
          }
        },
        'submission',
        'Submission'
      )

      return h.redirect(`${routePaths.review}/${id}`)
    }

    return h.view('form-submission/upload/views/status', {
      pageTitle: 'Upload in progress',
      heading: 'Scanning your files'
    })
  }
}

export { statusController }
