// // validators/fixedAssets-validation.js
// const Joi = require("joi");

// // Validation schema for fetching fixed assets by category and user
// exports.fixedAssetsSchema = Joi.object({
//   category: Joi.string().required().label("Category"),
// });

// // Validation schema for deleting fixed assets
// exports.deleteFixedAssetSchema = Joi.object({
//   ids: Joi.alternatives()
//     .try(
//       Joi.array().items(Joi.number().integer().required()),
//       Joi.number().integer()
//     )
//     .required()
//     .label("IDs"),
// });



// validators/fixedAssets-validation.js
const Joi = require("joi");

// Validation schema for fetching fixed assets by category and user
exports.fixedAssetsSchema = Joi.object({
  category: Joi.string().required().label("Category"),
});

// Validation schema for deleting fixed assets
exports.deleteFixedAssetSchema = Joi.object({
  ids: Joi.alternatives()
    .try(
      Joi.array().items(Joi.number().integer().required()),
      Joi.number().integer()
    )
    .required()
    .label("IDs"),
});

// Validation schema for adding a fixed asset
exports.addFixedAssetSchema = Joi.object({
  category: Joi.string()
    .valid('Building and Infrastructures', 'Land', 'Machine and Vehicles', 'Tools')
    .required()
    .label("Category"),
  
  ownership: Joi.string().required().label("Ownership"),
  type: Joi.string().optional().label("Type"),
  floorArea: Joi.number().optional().label("Floor Area"), 
  generalCondition: Joi.string().optional().label("General Condition"),
  district: Joi.string().optional().label("District"),
  extentha: Joi.number().optional().label("Extent (ha)"),
  extentac: Joi.number().optional().label("Extent (ac)"),
  extentp: Joi.number().optional().label("Extent (p)"),
  landFenced: Joi.boolean().optional().label("Land Fenced"),
  perennialCrop: Joi.string().optional().label("Perennial Crop"),
  asset: Joi.string().optional().label("Asset"),
  assetType: Joi.string().optional().label("Asset Type"),
  mentionOther: Joi.string().optional().label("Other Mentions"),
  brand: Joi.string().optional().label("Brand"),
  numberOfUnits: Joi.number().optional().label("Number of Units"),
  unitPrice: Joi.number().optional().label("Unit Price"),
  totalPrice: Joi.number().optional().label("Total Price"),
  warranty: Joi.boolean().optional().label("Warranty"),
  issuedDate: Joi.date().optional().label("Issued Date"),
  purchaseDate: Joi.date().optional().label("Purchase Date"),
  expireDate: Joi.date().optional().label("Expire Date"),
  warrantystatus: Joi.string()
    .valid('yes', 'no')
    .optional()
    .label("Warranty Status"),
  
  startDate: Joi.date().optional().label("Start Date"),
  durationYears: Joi.number().optional().label("Duration in Years"),
  durationMonths: Joi.number().optional().label("Duration in Months"),
  leastAmountAnnually: Joi.number().optional().label("Lease Amount Annually"),
  permitFeeAnnually: Joi.number().optional().label("Permit Fee Annually"),
  paymentAnnually: Joi.number().optional().label("Payment Annually"),
  estimateValue: Joi.number().optional().label("Estimated Value")
});


