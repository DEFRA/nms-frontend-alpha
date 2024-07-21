import { populateErrorFlashMessage } from '~/src/server/common/helpers/populate-error-flash-message.js'
import { provideUploadStatus } from '../pre/provide-upload-status.js'
import { sessionTransaction } from '~/src/server/common/helpers/session-transactions.js'
import { routePaths } from '~/src/server/common/helpers/constants.js'
import upload from '../schema.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { config } from '~/src/config/index.js'
import { fetchProxyWrapper } from '~/src/server/common/helpers/fetchProxyWrapper.js'

// Retrieve NMS configuration and API path from the application settings
const nmsConfig = config.get('nms')
const apiPath = nmsConfig.apiPath

/**
 * Controller for handling the status of file uploads.
 *
 * This controller checks the status of file uploads, validates the uploaded file, and manages the subsequent
 * actions based on the validation result and upload status. It also handles session transactions and communicates
 * with an external API to update the submission status.
 *
 * @constant {Object} statusController - The controller object with `options` and `handler` properties.
 * @property {Object} options - Configuration options for the controller.
 * @property {Array} options.pre - Array of functions to execute before the handler. Includes `provideUploadStatus('submission')`.
 * @property {Function} handler - Asynchronous function that processes the incoming request and generates a response.
 */
const statusController = {
  /**
   * Configuration options for the controller.
   *
   * @type {Object}
   * @property {Array<Function>} pre - Array of functions to be executed before the handler. Includes `provideUploadStatus('submission')`.
   */
  options: {
    pre: [provideUploadStatus('submission')]
  },

  /**
   * Handles the request for checking the status of an upload.
   *
   * @async
   * @function handler
   * @param {Object} request - The request object containing route parameters, pre-handler data, and other request data.
   * @param {Object} h - The response toolkit used to generate a response.
   * @returns {Promise<Object>} The response object, which can be a view or a redirect based on the upload status and validation results.
   */
  handler: async (request, h) => {
    // Extract `id` from the request parameters
    const { id } = request.params

    // Populate the flash message for errors
    const setError = populateErrorFlashMessage(request)
    // Retrieve the upload status from pre-handler data
    const uploadStatus = request.pre.uploadStatus
    // Check if the upload status indicates that the file has been virus checked
    const hasBeenVirusChecked = uploadStatus?.uploadStatus === 'ready'

    if (hasBeenVirusChecked) {
      // Validate the form data associated with the upload
      const validationResult = upload.validate(uploadStatus.form, {
        abortEarly: false
      })

      if (validationResult?.error) {
        // Build error details and flash validation errors
        const errorDetails = buildErrorDetails(validationResult?.error?.details)
        request.yar.flash('validationFailure', {
          formValues: uploadStatus.form,
          formErrors: errorDetails
        })
        // Redirect to the upload page with errors
        return h.redirect(`${routePaths.upload}/${id}`)
      }

      // Check if there are errors in the file input
      const fileInputStatus = uploadStatus?.form?.file
      const fileInputHasError = fileInputStatus?.hasError

      if (fileInputStatus && fileInputHasError) {
        // Set the error message and redirect
        setError(fileInputStatus.errorMessage)
        return h.redirect(`${routePaths.upload}/${id}`)
      }

      // Retrieve file details from the form data
      const file = uploadStatus?.form?.file
      // Perform a session transaction to log file details
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

      // Prepare options for the API request to update the submission status
      const options = {
        method: 'PUT',
        body: JSON.stringify({
          file: {
            filename: file.filename,
            fileUrl: file.s3Key
          },
          entity: 'upload',
          status: 'incomplete'
        })
      }

      try {
        // Send the request to update the submission status
        const response = await fetchProxyWrapper(
          `${apiPath}update/submission/${id}`,
          options,
          true
        )
        const { message } = await response.body
        if (message === 'success') {
          // Redirect to review page if the update was successful
          return h.redirect(`${routePaths.review}/${id}`)
        } else {
          // Redirect to upload page if the update failed
          return h.redirect(`${routePaths.upload}/${id}`)
        }
      } catch (error) {
        // Redirect to upload page in case of an error
        return h.redirect(`${routePaths.upload}/${id}`)
      }
    }

    // Render view indicating that the upload is still in progress
    return h.view('submissions/file-upload/views/index', {
      pageTitle: 'Upload in progress',
      heading: 'Scanning your files'
    })
  }
}

export { statusController }
