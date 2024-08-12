const express = require("express");
const router = express.Router();
const { login, signup } = require("../controllers/Auth.js");

// Define the routes
router.post("/signup", signup);
// If you have a login route, uncomment the following line
router.post("/login", login);

// Export the router without calling it as a function
module.exports = router;
