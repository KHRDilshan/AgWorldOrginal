// Import packages
const express = require("express");
const home = require("./routes/home");
const newsRoutes = require("./routes/news");
const cropRoutes = require("./routes/cropRoutes");
const MarketPriceRoutes = require("./routes/marketPriceRoutes");


// Middlewares
const app = express();
app.use(express.json());

const myCropRoutes = require("./routes/UserCrop.routes");
app.use(process.env.AUTHOR, myCropRoutes);

// const userRoutes = require("./routes/userAutth.routes");
// app.use(process.env.AUTHOR, userRoutes);

const userFixedAssetsRoutes = require("./routes/fixedAsset.routes");
app.use(process.env.AUTHOR, userFixedAssetsRoutes);

// Routes
app.use("/home", home);
app.use("/api/news", newsRoutes);
app.use("/api/crop", cropRoutes);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));


