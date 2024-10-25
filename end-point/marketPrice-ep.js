const asyncHandler = require("express-async-handler");
const { getAllMarketData } = require("../dao/marketPrice-dao");

// Controller to fetch all market data
exports.getAllMarket = asyncHandler(async (req, res) => {
  try {
    // Use DAO to get data from the database
    const results = await getAllMarketData();

    // If results contain an image, convert it to base64 (if needed)
    // if (results[0].image) {
    //   const base64Image = Buffer.from(results[0].image).toString('base64');
    //   const mimeType = 'image/png'; // Adjust MIME type if necessary, depending on the image type
    //   results[0].image = `data:${mimeType};base64,${base64Image}`;
    // }

    // Return the fetched data in the response
    res.status(200).json(results);
  } catch (err) {
    console.error("Error getAllMarket:", err);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});
