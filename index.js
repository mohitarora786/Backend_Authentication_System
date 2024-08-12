const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/database");
const userRoutes = require("./routes/user");
const app = express();
var cors = require("cors");
const PORT = process.env.PORT || 4000;

// CORS Middleware
app.use(
  cors({
    origin: "*", // Allow all origins (suitable for development)
  })
);

// Middleware to parse JSON bodies
app.use(express.json());

// API routes
app.use("/api/v1", userRoutes);

// Home route
app.get("/", (req, res) => {
  res.send(`<h1>Backend is Running and this is '/' Route</h1>`);
});

// Start the server
app.listen(PORT, () => {
  console.log(`THE SERVER IS UP AND RUNNING AT PORT ${PORT}`);
});

// Connect to the database
dbConnect();
