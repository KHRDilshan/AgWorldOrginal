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
  asset: Joi.string().label("Asset"),
  assetType: Joi.string().label("Asset Type"),
  assetname: Joi.string().label("Asset Name"),
  brand: Joi.string().label("Brand"),
  category: Joi.string().valid('Building and Infrastructures','Land','Machine and Vehicles','Tools').label("Category"),
  district: Joi.string().label("District"),
  durationMonths: Joi.alternatives().try(Joi.number(),Joi.string()).label("Duration in Months"),
  durationYears: Joi.alternatives().try(Joi.number(),Joi.string()).label("Duration in Years"),
  estimateValue: Joi.number().label("Estimated Value"),
  expireDate: Joi.date().label("Expire Date"),
  extentac: Joi.alternatives().try(Joi.number(),Joi.string()).label("Extent (ac)"),
  extentha: Joi.alternatives().try(Joi.number(),Joi.string()).label("Extent (ha)"),
  extentp: Joi.alternatives().try(Joi.number(),Joi.string()).label("Extent (p)"),
  floorArea: Joi.number().label("Floor Area"),
  generalCondition: Joi.string().label("General Condition"),
  issuedDate: Joi.date().label("Issued Date"),
  landFenced: Joi.alternatives().try(Joi.boolean(),Joi.string().valid("yes","no")).label("Land Fenced"),
  leastAmountAnnually: Joi.alternatives().try(Joi.number(),Joi.string()).label("Lease Amount Annually"),
  mentionOther: Joi.string().label("Other Mentions"),
  numberOfUnits: Joi.alternatives().try(Joi.number(),Joi.string()).label("Number of Units"),
  ownership: Joi.string().label("Ownership"),
  paymentAnnually: Joi.alternatives().try(Joi.number(),Joi.string()).label("Payment Annually"),
  perennialCrop: Joi.alternatives().try(Joi.boolean(),Joi.string().valid("yes","no")).label("Perennial Crop"),
  permitFeeAnnually: Joi.alternatives().try(Joi.number(),Joi.string()).label("Permit Fee Annually"),
  purchaseDate: Joi.date().label("Purchase Date"),
  startDate: Joi.date().label("Start Date"),
  toolbrand: Joi.string().label("Tool Brand"),
  totalPrice: Joi.number().label("Total Price"),
  type: Joi.string().label("Type"),
  unitPrice: Joi.alternatives().try(Joi.number(),Joi.string()).label("Unit Price"),
  warranty: Joi.alternatives().try(Joi.boolean(),Joi.string().valid("yes","no")).label("Warranty"),
  warrantystatus: Joi.array().items(
    Joi.object({
      key: Joi.string(),
      value: Joi.alternatives().try(Joi.boolean(),Joi.string().valid("yes","no"))
    })
  ).label("Warranty Status")
});



