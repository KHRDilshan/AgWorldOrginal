const jwt = require("jsonwebtoken");
const db = require("../startup/database");
const asyncHandler = require("express-async-handler");

const cropDao = require("../dao/userCrop-dao");

// Endpoint to get crop by Category
exports.getCropByCategory = asyncHandler(async (req, res) => {
  try {
    const { categorie } = req.params;

    // Call the DAO to get crops by category
    const crops = await cropDao.getCropByCategory(categorie);

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

    res.status(200).json([results[0]]);
  } catch (err) {
    console.error("Error fetching crop details:", err);
    res.status(500).json({ message: "Internal Server Error !" });
  }
});

// Endpoint to fetch crop calendar feed
exports.CropCalanderFeed = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id; // Extract userId from token
    const cropId = req.params.cropid; // Get cropId from URL parameters

    console.log("hi...User ID:", userId);
    console.log("hi.. Crop ID:", cropId);

    // Fetch crop calendar feed using DAO
    const results = await cropDao.getCropCalendarFeed(userId, cropId);

    if (!results || results.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No data found for the given crop ID and user",
      });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching crop calendar feed:", err);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the crop calendar feed.",
    });
  }
});

// Endpoint to get ongoing cultivation by user ID
exports.OngoingCultivaionGetById = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id; // Extract userId from token
    const limit = req.query.limit || 10; // Default limit is 10
    const offset = req.query.offset || 0; // Default offset is 0

    // Fetch data from DAO
    cropDao.getOngoingCultivationsByUserId(userId, (err, results) => {
      if (err) {
        console.error("Error fetching data from DAO:", err);
        return res.status(500).json({
          status: "error",
          message: "An error occurred while fetching data.",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No ongoing cultivation found for this user",
        });
      }

      res.status(200).json(results);
    });
  } catch (err) {
    console.error("Error in OngoingCultivationGetById:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error!" });
  }
});

// Endpoint to enroll in a crop
exports.enroll = asyncHandler(async (req, res) => {
  try {
    const cropId = req.params.cropId;
    const userId = req.user.id;

    console.log("User ID:", userId, "Crop ID:", cropId);

    // Check if the user already has an ongoing cultivation
    let cultivationId;
    const ongoingCultivationResult = await cropDao.checkOngoingCultivation(userId);

    if (!ongoingCultivationResult[0]) {
      // If no ongoing cultivation exists, create one
      const newCultivationResult = await cropDao.createOngoingCultivation(userId);
      cultivationId = newCultivationResult.insertId;
      console.log("Created new ongoing cultivation with ID:", cultivationId);
    } else {
      cultivationId = ongoingCultivationResult[0].id;
      console.log("Existing ongoing cultivation ID:", cultivationId);
    }

    // Check the crop count
    const cropCountResult = await cropDao.checkCropCount(cultivationId);
    const cropCount = cropCountResult[0].count;

    if (cropCount >= 3) {
      return res.status(400).json({ message: "You have already enrolled in 3 crops" });
    }

    // Check if the crop is already enrolled
    const enrolledCrops = await cropDao.checkEnrollCrop(cultivationId);
    if (enrolledCrops.some((crop) => crop.cropCalendar == cropId)) {
      return res.status(400).json({ message: "You are already enrolled in this crop!" });
    }

    // Enroll the crop
    await cropDao.enrollOngoingCultivationCrop(cultivationId, cropId);
    await cropDao.enrollSlaveCrop(userId, cropId);

    console.log("Successfully enrolled in crop ID:", cropId);

    return res.json({ message: "Enrollment successful" });
  } catch (err) {
    console.error("Error during enrollment:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint to get slave crop calendar days by user and crop
exports.getSlaveCropCalendarDaysByUserAndCrop = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const cropCalendarId = req.params.cropCalendarId;

    console.log("User ID:", userId);
    console.log("Crop Calendar ID:", cropCalendarId);

    // Fetch data using the DAO
    const results = await cropDao.getSlaveCropCalendarDaysByUserAndCrop(userId, cropCalendarId);

    if (results.length === 0) {
      return res.status(404).json({
        message: "No records found for the given userId and cropCalendarId.",
      });
    }

    console.log("Query result:", results);

    return res.status(200).json(results);
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
          message: "You cannot change the status back to pending after 1 hour of marking it as completed.",
        });
      }
    }

    // Check if all previous tasks are completed before marking this one as 'completed'
    if (status === 'completed' && taskIndex > 1) {
      const previousTasksResults = await cropDao.getPreviousTasks(taskIndex, cropCalendarId, userId);
      let allPreviousTasksCompleted = previousTasksResults.every(task => task.status === 'completed');
      let lastCompletedTask = previousTasksResults[previousTasksResults.length - 1];

      if (!allPreviousTasksCompleted) {
        return res.status(400).json({ message: "Complete previous tasks before moving to the next." });
      }

      // Check the 6-hour waiting period for the last completed task
      const previousCreatedAt = new Date(lastCompletedTask.createdAt);
      const timeDiffInHours = Math.abs(currentTime - previousCreatedAt) / 36e5;
      if (timeDiffInHours < 6) {
        return res.status(400).json({
          message: "Wait 6 hours after completing the previous task before marking this one as completed.",
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
