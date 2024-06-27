import Joi from 'joi'

const contact = Joi.object({
  firstName: Joi.string().max(50).label('First Name').required(),
  lastName: Joi.string().max(50).label('Last Name').required(),
  email: Joi.string()
    .label('Email ID')
    .max(100)
    .email({ tlds: { allow: false } })
    .required(),
  phone: Joi.string()
    .label('Telephone')
    .pattern(/^\d{1,11}$/)
    .required(),
  action: Joi.string()
})

export default contact
