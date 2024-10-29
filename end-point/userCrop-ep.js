const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const cropDao = require("../dao/userCrop-dao");

// Endpoint to get crop by Category
exports.getCropByCategory = asyncHandler(async (req, res) => {
  try {
    const { categorie } = req.params;

    // Call the DAO to get crops by category
    const crops = await cropDao.getCropByCategory(categorie);

    if (crops.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No crops found for the given category.",
      });
    }

    res.status(200).json(crops);
  } catch (err) {
    console.error("Error fetching crops by category:", err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching crops by category.",
    });
  }
});

// Endpoint to get crop by ID
exports.getCropById = asyncHandler(async (req, res) => {
  try {
    const cropId = req.params.id;

    // Use the DAO to get crop details by crop ID
    const results = await cropDao.getCropById(cropId);

    if (results.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Crop not found",
      });
    }

    res.status(200).json(results[0]);
  } catch (err) {
    console.error("Error fetching crop details:", err);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

// Endpoint to fetch crop calendar feed
exports.CropCalanderFeed = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id; // Extract userId from token
    const cropId = req.params.cropid; // Get cropId from URL parameters

    // Fetch crop calendar feed using DAO
    const results = await cropDao.getCropCalendarFeed(userId, cropId);

    if (!results || results.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No data found for the given crop ID and user",
      });
    }

    // Return success response with fetched results
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching crop calendar feed:", err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the crop calendar feed.",
    });
  }
});

// Endpoint to get ongoing cultivation by User ID
exports.OngoingCultivaionGetById = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id; // Extract userId from token

    // Fetch data from DAO
    const results = await cropDao.getOngoingCultivationsByUserId(userId);

    if (results.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No ongoing cultivation found for this user",
      });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error("Error in OngoingCultivationGetById:", err);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error!",
    });
  }
});

// Endpoint for crop enrollment
exports.enroll = asyncHandler(async (req, res) => {
  try {
    const cropId = req.params.cropId;
    const userId = req.user.id;

    // Check if the user already has an ongoing cultivation
    let cultivationId;
    const ongoingCultivationResult = await cropDao.checkOngoingCultivation(userId);

    if (!ongoingCultivationResult[0]) {
      // If no ongoing cultivation exists, create one
      const newCultivationResult = await cropDao.createOngoingCultivation(userId);
      cultivationId = newCultivationResult.insertId;
    } else {
      cultivationId = ongoingCultivationResult[0].id;
    }

    // Check the crop count
    const cropCountResult = await cropDao.checkCropCount(cultivationId);
    const cropCount = cropCountResult[0].count;

    if (cropCount >= 3) {
      return res.status(400).json({ message: "You have already enrolled in 3 crops" });
    }

    // Check if the crop is already enrolled
    const enrolledCrops = await cropDao.checkEnrollCrop(cultivationId);
    if (enrolledCrops.some(crop => crop.cropCalendar == cropId)) {
      return res.status(400).json({ message: "You are already enrolled in this crop!" });
    }

    // Enroll the crop
    await cropDao.enrollOngoingCultivationCrop(cultivationId, cropId);
    await cropDao.enrollSlaveCrop(userId, cropId);

    res.json({ message: "Enrollment successful" });
  } catch (err) {
    console.error("Error during enrollment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint to get slave crop calendar days
exports.getSlaveCropCalendarDaysByUserAndCrop = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const cropCalendarId = req.params.cropCalendarId;

    // Fetch data using the DAO
    const results = await cropDao.getSlaveCropCalendarDaysByUserAndCrop(userId, cropCalendarId);

    if (results.length === 0) {
      return res.status(404).json({
        message: "No records found for the given userId and cropCalendarId.",
      });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error("Error in getSlaveCropCalendarDaysByUserAndCrop:", err);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

// Endpoint to update crop calendar status
exports.updateCropCalendarStatus = asyncHandler(async (req, res) => {
  try {
    const { id, status } = req.body;
    const currentTime = new Date();

    // Fetch the current task
    const taskResults = await cropDao.getTaskById(id);
    if (taskResults.length === 0) {
      return res.status(404).json({ message: "No record found with the provided id." });
    }

    const currentTask = taskResults[0];
    const { taskIndex, status: currentStatus, createdAt, cropCalendarId, userId } = currentTask;

    // Check if the task is being marked as 'pending' after 'completed' and restrict if more than 1 hour has passed
    if (currentStatus === 'completed' && status === 'pending') {
      const timeDiffInHours = Math.abs(currentTime - new Date(createdAt)) / 36e5;
      if (timeDiffInHours > 1) {
        return res.status(403).json({
          message: "You cannot change the status back to pending after 1 hour of marking it as completed."
        });
      }
    }

    // Proceed with updating the status
    const updateResults = await cropDao.updateTaskStatus(id, status);
    if (updateResults.affectedRows === 0) {
      return res.status(404).json({ message: "No record found with the provided id." });
    }

    res.status(200).json({ message: "Status updated successfully." });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});
