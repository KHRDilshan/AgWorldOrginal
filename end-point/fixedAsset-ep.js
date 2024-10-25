const fixedAssetsDao = require("../dao/fixedAsset-dao"); // Import DAO
const asyncHandler = require("express-async-handler");

// Controller function to handle fetching fixed assets by category and user
exports.getFixedAssetsByCategoryAndUser = asyncHandler(async (req, res) => {
  try {
    const { category } = req.params; // Extract category from request parameters
    const userId = req.user.id; // Assume user ID is available from authentication middleware

    // Call DAO function to get fixed assets based on category and userId
    const fixedAssets = await fixedAssetsDao.getFixedAssetsByCategoryAndUser(
      category,
      userId
    );

    // If no assets are found, return 404
    if (!fixedAssets.length) {
      return res.status(404).json({
        status: "error",
        message: "No fixed assets found for this category and user.",
      });
    }

    // Return the fixed assets data in a success response
    return res.status(200).json({
      message: "Fixed assets retrieved successfully",
      data: fixedAssets,
    });
  } catch (err) {
    console.error("Error:", err);

    // Handle any other errors
    return res.status(500).json({
      status: "error",
      message: "An error occurred while fetching fixed assets.",
    });
  }
});

// Controller function to handle deleting fixed assets
exports.deleteFixedAsset = asyncHandler(async (req, res) => {
  try {
    const { ids } = req.body; // Extract IDs from request body
    const idArray = Array.isArray(ids) ? ids : [ids]; // Ensure ids is an array

    // Begin the deletion process using the DAO
    const deleteResult = await fixedAssetsDao.deleteFixedAsset(idArray);

    // If no rows are affected, return a 404 response
    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "No matching fixed assets found for deletion.",
      });
    }

    // Return success response with the number of deleted assets
    return res.status(200).json({
      message: `Successfully deleted ${deleteResult.affectedRows} fixed asset(s).`,
    });
  } catch (err) {
    console.error("Error:", err);

    // Handle any other errors
    return res.status(500).json({
      status: "error",
      message: "An error occurred while deleting fixed assets.",
    });
  }
});
