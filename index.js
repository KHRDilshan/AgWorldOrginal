// // Import packages
// const express = require("express");
// const home = require("./routes/home");
// const newsRoutes = require("./routes/news");
// const cropRoutes = require("./routes/cropRoutes");


// // Middlewares
// const app = express();
// app.use(express.json());


// // Routes
// app.use("/home", home);
// app.use("/api/news", newsRoutes);

// // connection
// const port = process.env.PORT || 9001;
// app.listen(port, () => console.log(`Listening to port ${port}`));
// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cropRouter = require('./routes/cropRoutes');
const home = require("./routes/home");
const newsRoutes = require("./routes/news");

const app = express();

// Middleware
app.use(bodyParser.json());

// Basic route for testing (optional)
app.get('/', (req, res) => res.send('Server is running'));

// Use the crop router
app.use('/api/crops', cropRouter);
app.use("/home", home);
app.use("/api/news", newsRoutes);

// Start the server
const PORT = process.env.PORT || 9001;
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
