import { config } from '~/src/config/index.js'
import { initializeUpload } from '../services/initialize-upload.js'
import { routePaths } from '~/src/server/common/helpers/constants.js'
import { sessionTransaction } from '~/src/server/common/helpers/session-transactions.js'

/**
 * Controller for handling file upload requests.
 *
 * This controller manages the initialization of file uploads and sets up the necessary parameters for handling
 * file upload operations. It also handles session transactions and renders the appropriate view for the upload process.
 *
 * @constant {Object} indexController - The controller object with `handler` property.
 * @property {Function} handler - Asynchronous function that processes the incoming request and generates a response.
 */
const indexController = {
  /**
   * Handles the request for initializing a file upload.
   *
   * @async
   * @function handler
   * @param {Object} request - The request object containing route parameters and other request data.
   * @param {Object} h - The response toolkit used to generate a response.
   * @returns {Promise<Object>} The response object, which renders the upload view with the necessary parameters.
   */
  handler: async (request, h) => {
    // Extract `id` from the request parameters
    const { id } = request.params
    // Retrieve the S3 bucket configuration from the application settings
    const s3Bucket = config.get('bucket')

    // Initialize the upload process with specified parameters
    const uploadDetail = await initializeUpload({
      redirect: `${routePaths.uploadComplete}/${id}`, // URL to redirect after upload completion
      s3Bucket, // The S3 bucket where files will be uploaded
      s3Path: 'submission', // Path within the S3 bucket
      maxFileSize: 1024 * 1024 * 100, // Maximum file size in bytes (100 MB)
      mimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'application/pdf'] // Allowed MIME types for uploads
    })

    // Perform a session transaction to handle upload details
    await sessionTransaction(
      request,
      h,
      uploadDetail,
      'submission', // Transaction type
      'Submission' // Description of the transaction
    )

    // Render the view with upload details and relevant URLs
    return h.view('submissions/file-upload/views/index', {
      pageTitle: 'Upload',
      heading: 'Upload',
      action: uploadDetail.uploadUrl, // URL to initiate the upload
      reviewUrl: `${routePaths.review}/${id}`, // URL to review the submission
      contactPath: `${routePaths.contact}/${id}` // URL to contact related to the submission
    })
  }
}

export { indexController }
