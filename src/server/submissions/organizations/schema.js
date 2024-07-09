import Joi from 'joi'
import { errorMessages } from '../../common/helpers/constants.js'

const organization = Joi.object({
  orgName: Joi.string().label('Organization Name').required().messages({
    'any.message': errorMessages.required,
    'any.required': errorMessages.required
  }),
  orgType: Joi.string().label('Type of Organization').required().messages({
    'any.message': errorMessages.choose,
    'any.required': errorMessages.choose
  }),
  typeOfDeveloper: Joi.string()
    .label('Type of Developer')
    .when('orgType', {
      is: Joi.exist().valid('930750007'),
      then: Joi.required().messages({
        'any.message': errorMessages.choose,
        'any.required': errorMessages.choose
      }),
      otherwise: Joi.optional()
    }),
  mitigationProviderSBI: Joi.string()
    .label('Mitigation Provide SBI')
    .max(9)
    .default('')
    .allow('')
    .optional()
    .messages({
      'string.max': errorMessages.max
    }),
  crn: Joi.string()
    .label('Company Registration Number')
    .max(8)
    .default('')
    .allow('')
    .optional()
    .messages({
      'string.max': errorMessages.max
    }),
  nationality: Joi.string()
    .label('Nationality')
    .when('typeOfDeveloper', {
      is: Joi.exist().valid('930750001'),
      then: Joi.required().messages({
        'any.message': errorMessages.choose,
        'any.required': errorMessages.choose
      }),
      otherwise: Joi.allow('').optional()
    }),
  address1: Joi.string()
    .label('Address 1')
    .max(100)
    .when('orgType', {
      is: Joi.exist().valid('930750003', '930750001'),
      then: Joi.string().required().messages({
        'any.message': errorMessages.required,
        'any.required': errorMessages.required,
        'string.max': errorMessages.max
      }),
      otherwise: Joi.string().optional().allow('')
    }),
  address2: Joi.string()
    .label('Address 2')
    .max(100)
    .default('')
    .allow('')
    .optional()
    .messages({
      'string.max': errorMessages.max
    }),
  address3: Joi.string()
    .label('Address 3')
    .max(100)
    .default('')
    .allow('')
    .optional()
    .messages({
      'string.max': errorMessages.max
    }),
  townRCity: Joi.string()
    .label('Town/City')
    .max(100)
    .when('orgType', {
      is: Joi.exist().valid('930750003', '930750001'),
      then: Joi.required().messages({
        'any.message': errorMessages.required,
        'any.required': errorMessages.required,
        'string.max': errorMessages.max
      }),
      otherwise: Joi.string().allow('').optional()
    }),
  postcode: Joi.string()
    .label('Postal Code')
    .max(100)
    .when('orgType', {
      is: Joi.exist().valid('930750003', '930750001'),
      then: Joi.required().messages({
        'any.message': errorMessages.required,
        'any.required': errorMessages.required,
        'string.max': errorMessages.max
      }),
      otherwise: Joi.string().allow('').optional()
    }),
  regAddress1: Joi.string()
    .label('Address 1')
    .max(100)
    .when('typeOfDeveloper', {
      is: Joi.exist().valid('930750000', '930750001', '930750002'),
      then: Joi.required().messages({
        'any.message': errorMessages.required,
        'any.required': errorMessages.required,
        'string.max': errorMessages.max
      }),
      otherwise: Joi.allow('').optional()
    }),
  regAddress2: Joi.string()
    .label('Address 2')
    .max(100)
    .default('')
    .allow('')
    .optional()
    .messages({
      'string.max': errorMessages.max
    }),
  regAddress3: Joi.string()
    .label('Address 3')
    .max(100)
    .default('')
    .allow('')
    .optional()
    .messages({
      'string.max': errorMessages.max
    }),
  regTownRCity: Joi.string()
    .label('Town/City')
    .max(100)
    .when('typeOfDeveloper', {
      is: Joi.exist().valid('930750000', '930750001', '930750002'),
      then: Joi.required().messages({
        'any.message': errorMessages.required,
        'any.required': errorMessages.required,
        'string.max': errorMessages.max
      }),
      otherwise: Joi.allow('').optional()
    }),
  regPostcode: Joi.string()
    .label('Postal Code')
    .max(100)
    .when('typeOfDeveloper', {
      is: Joi.exist().valid('930750000', '930750001', '930750002'),
      then: Joi.required().messages({
        'any.message': errorMessages.required,
        'any.required': errorMessages.required,
        'string.max': errorMessages.max
      }),
      otherwise: Joi.allow('').optional()
    })
})

export default organization
