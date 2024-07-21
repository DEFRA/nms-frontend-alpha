import { config } from '~/src/config/index.js'
import { fetchProxyWrapper } from '~/src/server/common/helpers/fetchProxyWrapper.js'

/**
 * Initializes an upload process by interacting with an external uploader service.
 *
 * This function sends a request to an external service to initiate the upload process. It configures various options
 * such as redirect URLs, S3 bucket details, MIME types, maximum file size, and metadata. The function then returns
 * the response from the uploader service.
 *
 * @async
 * @function initializeUpload
 * @param {Object} [options={}] - The configuration options for initializing the upload.
 * @param {string} [options.redirect] - The URL to redirect to after the upload is complete.
 * @param {string} [options.callback] - The URL for the callback to be triggered after upload.
 * @param {string} [options.s3Bucket] - The S3 bucket where the files will be uploaded.
 * @param {string} [options.s3Path] - The path within the S3 bucket where files will be stored.
 * @param {Array<string>} [options.mimeTypes] - The allowed MIME types for the upload.
 * @param {number} [options.maxFileSize] - The maximum file size allowed for the upload (in bytes).
 * @param {Object} [options.metadata] - Additional metadata to be associated with the uploaded files.
 * @returns {Promise<Object>} The response body from the uploader service, containing details of the upload initiation.
 *
 * @example
 * const uploadOptions = {
 *   redirect: 'https://example.com/upload-complete',
 *   callback: 'https://example.com/callback',
 *   s3Bucket: 'my-bucket',
 *   s3Path: 'uploads',
 *   mimeTypes: ['image/png', 'image/jpeg'],
 *   maxFileSize: 10485760, // 10 MB
 *   metadata: { description: 'User profile picture' }
 * };
 *
 * const uploadResponse = await initializeUpload(uploadOptions);
 * console.log(uploadResponse);
 * // Output: { uploadUrl: 'https://uploader.example.com/upload', ... }
 */
const initializeUpload = async (options = {}) => {
  const {
    redirect,
    callback,
    s3Bucket,
    s3Path,
    mimeTypes,
    maxFileSize,
    metadata
  } = options

  // Endpoint URL for initiating the upload process
  const endpointUrl = config.get('cdpUploaderUrl') + '/initiate'

  // Send a POST request to the external service to initiate the upload
  const response = await fetchProxyWrapper(
    endpointUrl,
    {
      method: 'POST',
      body: JSON.stringify({
        redirect,
        callback,
        s3Bucket,
        s3Path,
        mimeTypes,
        maxFileSize,
        metadata
      })
    },
    true
  )

  // Return the response body from the external service
  return await response.body
}

export { initializeUpload }
