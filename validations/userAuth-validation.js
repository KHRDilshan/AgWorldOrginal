// const Joi = require('joi');

// exports.loginUserSchema = Joi.object({
//     phonenumber: Joi.string().required().label('Phone number'),
// });


// exports.signupUserSchema = Joi.object({
//     firstName: Joi.string().min(2).max(50).required().label('First Name'),
//     lastName: Joi.string().min(2).max(50).required().label('Last Name'),
//     // phoneNumber: Joi.string().regex(/^[0-9]{10,15}$/).required().label('Phone Number'), // Should be a valid phone number format
//     phoneNumber: Joi.number().integer().min(1000000000).max(999999999999999).required().label('Phone Number'), // Should be a valid number with 10 to 15 digits
//     NICnumber: Joi.string().min(9).max(12).required().label('NIC Number') // Adjust to your country's NIC format
// });

// exports.updatePhoneNumberSchema = Joi.object({
//     //newPhoneNumber: Joi.string().required().label('New Phone Number'), // New phone number must be provided
//     newPhoneNumber: Joi.number().integer().min(1000000000).max(999999999999999).required().label('New Phone Number'),
// });

// exports.signupCheckerSchema = Joi.object({
//     phoneNumber: Joi.string().optional().label('Phone Number'),
//     NICnumber: Joi.string().optional().label('NIC Number'),
//   }).or('phoneNumber', 'NICnumber').label('Request Data');


//   exports.updateFirstLastNameSchema = Joi.object({
//     firstName: Joi.string().required().label('First Name'),
//     lastName: Joi.string().required().label('Last Name')
// });

const Joi = require('joi');

// Login User Schema
exports.loginUserSchema = Joi.object({
  phonenumber: Joi.string()
    .pattern(/^[0-9+]{10,15}$/) // Allows numbers and "+" with 10-15 digits
    .required()
    .label('Phone number')
    .trim(),
});

// Signup User Schema
exports.signupUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().label('First Name').trim(),
  lastName: Joi.string().min(2).max(50).required().label('Last Name').trim(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9+]{10,15}$/) // Ensures valid phone number format
    .required()
    .label('Phone Number')
    .trim(),
  NICnumber: Joi.string().min(9).max(12).required().label('NIC Number').trim(),
});

// Update Phone Number Schema
exports.updatePhoneNumberSchema = Joi.object({
  newPhoneNumber: Joi.string()
    .pattern(/^[0-9+]{10,15}$/) // Ensures valid phone number format
    .required()
    .label('New Phone Number')
    .trim(),
});

// Signup Checker Schema
exports.signupCheckerSchema = Joi.object({
  phoneNumber: Joi.string().pattern(/^[0-9+]{10,15}$/).optional().label('Phone Number').trim(),
  NICnumber: Joi.string().min(9).max(12).optional().label('NIC Number').trim(),
}).or('phoneNumber', 'NICnumber').label('Request Data');

// Update First and Last Name Schema
exports.updateFirstLastNameSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().label('First Name').trim(),
  lastName: Joi.string().min(2).max(50).required().label('Last Name').trim(),
});
