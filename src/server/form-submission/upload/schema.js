import Joi from 'joi'
import { fileValidator } from '../../common/helpers/schema/file-validator.js'

const upload = Joi.object({
  file: fileValidator
    .alternatives(
      Joi.array().items(fileValidator.file().showFileName()),
      fileValidator.file()
    )
    .required()
    .messages({
      'any.required': 'You must upload at least one file'
    }),
  action: Joi.string()
})

export default upload
