// Import packages
const express = require("express");
const home = require("./routes/home");
const newsRoutes = require("./routes/news");
const cropRoutes = require("./routes/cropRoutes");
const MarketPriceRoutes = require("./routes/marketPriceRoutes");

// Middlewares
const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Server is running'));

const myCropRoutes = require("./routes/UserCrop.routes");
app.use(process.env.AUTHOR, myCropRoutes);

//problem in hosting
const userRoutes = require("./routes/userAutth.routes");
app.use(process.env.AUTHOR, userRoutes);

const userFixedAssetsRoutes = require("./routes/fixedAsset.routes");
app.use(process.env.AUTHOR, userFixedAssetsRoutes);

const userCurrentAssetsRoutes = require("./routes/currentAssets.routes");
app.use(process.env.AUTHOR, userCurrentAssetsRoutes);

const publicforumRoutes = require("./routes/publicforum.routes");
app.use(process.env.AUTHOR, publicforumRoutes);

// Routes
app.use("/home", home);
app.use("/api/news", newsRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/market-price", MarketPriceRoutes);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));


