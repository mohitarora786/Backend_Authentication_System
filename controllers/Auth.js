const bcrypt = require("bcrypt");
const User = require("../models/User");
const { request, response } = require("express");
const JWT = require("jsonwebtoken");
const { options } = require("../routes/user");

require("dotenv").config();
// singup route handler
exports.signup = async (request, response) => {
  try {
    // get data
    const { name, email, password, role } = request.body;
    // check if user exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return response.status(500).json({
        success: false,
        message: "Error In Hashing Password",
      });
    }
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    return response.status(200).json({
      success: true,
      message: "User Created Successfully",
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "User Cannot Be Registered",
    });
  }
};

// login handler
// login handler
exports.login = async (request, response) => {
  try {
    // Data fetch from request body
    const { email, password } = request.body;

    // Check if email and password are provided
    if (!email || !password) {
      return response.status(400).json({
        success: false,
        message: "Please fill in all details",
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // If the user does not exist, return an error
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // If the password does not match, return an error
    if (!isPasswordMatch) {
      return response.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // If the password matches, create a JWT token
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    const token = JWT.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    // Set the token in a cookie
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    response
      .cookie("token", token, options)
      .status(200)
      .json({
        success: true,
        token,
        user: { ...user.toObject(), password: undefined },
        message: "User logged in successfully",
      });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};
