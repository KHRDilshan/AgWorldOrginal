const currentAssetsDao = require("../dao/currentAsset-dao"); 
const asyncHandler = require("express-async-handler");
// const {
//   getAllCurrentAssetsSchema,
// } = require("../validations/currentAsset-validation"); 

// const {
//   getAssetsByCategorySchema,
// } = require("../validations/currentAsset-validation"); 

// const { deleteAssetSchema, deleteAssetParamsSchema } = require('../validations/currentAsset-validation'); 
// const { addFixedAssetSchema } = require('../validations/currentAsset-validation');
const fixedAssetDao = require('../dao/currentAsset-dao');


exports.getAllCurrentAssets = asyncHandler(async (req, res) => {
  try {
    // await getAllCurrentAssetsSchema.validateAsync({ userId: req.user.id });

    const userId = req.user.id; 

    const results = await currentAssetsDao.getAllCurrentAssets(userId);

    if (results.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No assets found for the user",
      });
    }

    return res.status(200).json({
      status: "success",
      currentAssetsByCategory: results,
    });
  } catch (err) {

    res.status(500).json({
      status: "error",
      message: `An error occurred: ${err.message}`,
    });
  }
});

exports.getAssetsByCategory = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id; 
    console.log("User ID:", userId);

    // const { category } = await getAssetsByCategorySchema.validateAsync(
    //   req.query
    // );

    // console.log("Category:", category);

    const assets = await currentAssetsDao.getAssetsByCategory(userId, category);

    if (assets.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No assets found for this category.",
      });
    }

    return res.status(200).json({
      assets,
    });
  } catch (err) {
    console.error("Error fetching assets by category:", err);

    if (err.isJoi) {
      return res.status(400).json({
        status: "error",
        message: err.details[0].message,
      });
    }

    res.status(500).json({
      status: "error",
      message: "Server error, please try again later.",
    });
  }
});


exports.deleteAsset = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from the authenticated request
        const { category, assetId } = req.params; // Extract parameters
        console.log('Parameters:', category, assetId);
        console.log('hi... Parameters:', req.params);

        // Validate the request parameters
        // await deleteAssetParamsSchema.validateAsync(req.params);

        // Validate the request body
        // const { numberOfUnits, totalPrice } = await deleteAssetSchema.validateAsync(req.body);
        // console.log('Body:', numberOfUnits, totalPrice);

        // Retrieve the current asset record for the user
        const assets = await currentAssetsDao.getCurrentAsset(userId, category, assetId);
        if (assets.length === 0) {
            return res.status(404).json({ message: 'Asset not found for this user.' });
        }

        const currentAsset = assets[0]; // Access the first asset safely
        const newNumOfUnit = currentAsset.numOfUnit - numberOfUnits;
        const newTotal = currentAsset.total - totalPrice;

        // Check if new values are valid
        if (newNumOfUnit < 0 || newTotal < 0) {
            return res.status(400).json({ message: 'Invalid operation: insufficient units to deduct.' });
        }

        // Record data for currentassetrecord
        const recordData = {
            currentAssetId: currentAsset.id,
            numOfPlusUnit: 0, // Deduction only
            numOfMinUnit: numberOfUnits,
            totalPrice: totalPrice,
        };

        // If new values are zero, delete the asset
        if (newNumOfUnit === 0 && newTotal === 0) {
            await currentAssetsDao.deleteAsset(userId, category, assetId); // Delete asset
            await currentAssetsDao.insertRecord(recordData.currentAssetId, recordData.numOfPlusUnit, recordData.numOfMinUnit, recordData.totalPrice); // Insert record
            return res.status(200).json({ message: 'Asset removed successfully.' });
        } else {
            // Otherwise, update the asset
            await currentAssetsDao.updateAsset(userId, category, assetId, newNumOfUnit, newTotal); // Update asset
            await currentAssetsDao.insertRecord(currentAsset.id, 0, numberOfUnits, totalPrice); // Insert record
            return res.status(200).json({ message: 'Asset updated successfully.' });
        }
    } catch (err) {
        console.error('Error deleting asset:', err);
        
        // Handle validation errors
        if (err.isJoi) {
            return res.status(400).json({
                status: 'error',
                message: err.details[0].message,
            });
        }

        // Handle any other server errors
        res.status(500).json({
            status: 'error',
            message: 'Server error, please try again later.',
        });
    }
});


//addFixedAssets


exports.handleAddFixedAsset = async (req, res) => {
  const userId = req.user.id;
  const { category, asset, brand, batchNum, volume, unit, numberOfUnits, unitPrice, totalPrice, purchaseDate, expireDate, status } = req.body;

  try {
      // Validate request body against the schema
      // await addFixedAssetSchema.validateAsync(req.body);

      // Convert volume to a float (to allow decimal values)
      const volumeFloat = parseFloat(volume);

      // Format dates for MySQL
      const formattedPurchaseDate = new Date(purchaseDate).toISOString().slice(0, 19).replace('T', ' ');
      const formattedExpireDate = new Date(expireDate).toISOString().slice(0, 19).replace('T', ' ');

      // Check if the asset already exists
      const existingAssets = await fixedAssetDao.checkAssetExists(userId, category, asset);

      if (existingAssets.length > 0) {
          // Update existing asset
          const existingAsset = existingAssets[0];
          const updatedNumOfUnits = existingAsset.numOfUnit + numberOfUnits;
          const updatedTotalPrice = existingAsset.total + totalPrice;

          const updatedValues = [updatedNumOfUnits, updatedTotalPrice, volumeFloat, unitPrice, formattedPurchaseDate, formattedExpireDate, status];

          await fixedAssetDao.updateAsset(updatedValues, existingAsset.id);

          // Add record to currentassetrecord
          await fixedAssetDao.insertAssetRecord([existingAsset.id, numberOfUnits, totalPrice]);

          return res.status(200).json({
              status: 'success',
              message: 'Asset updated successfully',
          });
      } else {
          // Insert new asset
          const insertValues = [userId, category, asset, brand, batchNum, unit, volumeFloat, numberOfUnits, unitPrice, totalPrice, formattedPurchaseDate, formattedExpireDate, status];

          const newAssetId = await fixedAssetDao.insertAsset(insertValues);

          // Add record to currentassetrecord
          await fixedAssetDao.insertAssetRecord([newAssetId, numberOfUnits, totalPrice]);

          return res.status(200).json({
              status: 'success',
              message: 'Asset added successfully',
          });
      }
  } catch (err) {
      console.error('Error in handleAddFixedAsset:', err);
      if (err.isJoi) {
          // Validation error
          return res.status(400).json({
              status: 'error',
              message: err.details[0].message,
          });
      }
      // Other errors
      res.status(500).json({ status: 'error', message: 'An error occurred while processing the request.' });
  }
};

