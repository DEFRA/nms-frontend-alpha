import { config } from '~/src/config/index.js'
import { initializeUpload } from '../services/initialize-upload.js'
import { routePaths } from '~/src/server/common/helpers/constants.js'
import { sessionTransaction } from '~/src/server/common/helpers/session-transactions.js'

const indexController = {
  handler: async (request, h) => {
    const { id } = request.params
    const s3Bucket = config.get('bucket')

    const uploadDetail = await initializeUpload({
      redirect: `${routePaths.uploadComplete}/${id}`,
      s3Bucket,
      s3Path: 'submission',
      maxFileSize: 1024 * 1024 * 100,
      mimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'application/pdf']
    })

    await sessionTransaction(
      request,
      h,
      uploadDetail,
      'submission',
      'Submission'
    )

    return h.view('form-submission/upload/views/index', {
      pageTitle: 'Upload',
      heading: 'Upload',
      action: uploadDetail.uploadUrl,
      reviewUrl: `${routePaths.review}/${id}`
    })
  }
}

export { indexController }
