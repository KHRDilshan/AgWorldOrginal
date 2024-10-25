const Joi = require('joi');

// Login User Schema
exports.loginUserSchema = Joi.object({
  phonenumber: Joi.string()
    .pattern(/^[0-9+]{10,15}$/) // Allows numbers and "+" with 10-15 digits
    .required()
    .label('Phone Number')
    .trim(),
});

// Signup User Schema
exports.signupUserSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label('First Name')
    .trim(),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label('Last Name')
    .trim(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9+]{10,15}$/) // Allows numbers and "+" with 10-15 digits
    .required()
    .label('Phone Number')
    .trim(),
  NICnumber: Joi.string()
    .pattern(/^[A-Za-z0-9]{9,12}$/) // Allows letters and numbers, 9-12 characters
    .required()
    .label('NIC Number')
    .trim(),
});

// Update Phone Number Schema
exports.updatePhoneNumberSchema = Joi.object({
  newPhoneNumber: Joi.string()
    .pattern(/^[0-9+]{10,15}$/) // Allows numbers and "+" with 10-15 digits
    .required()
    .label('New Phone Number')
    .trim(),
});

// Signup Checker Schema
exports.signupCheckerSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^[0-9+]{10,15}$/) // Allows numbers and "+" with 10-15 digits
    .optional()
    .label('Phone Number')
    .trim(),
  NICnumber: Joi.string()
    .pattern(/^[A-Za-z0-9]{9,12}$/) // Allows letters and numbers, 9-12 characters
    .optional()
    .label('NIC Number')
    .trim(),
})
  .or('phoneNumber', 'NICnumber') // At least one is required
  .label('Request Data');

// Update First and Last Name Schema
exports.updateFirstLastNameSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label('First Name')
    .trim(),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .label('Last Name')
    .trim(),
});
