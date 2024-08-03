const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { use } = require("../routes/authRoute");
const { configDotenv } = require("dotenv");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req?.headers?.authorization?.split(" ")[1];
    try {
      if (token) {
        const decode = jwt.verify(token, process.env.JWT_SECREAT);
        // console.log(decode);
        const user = await User.findById(decode?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized, Token expired");
    }
  } else {
    throw new Error("Not Authorized");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const email = req?.user?.email;
  console.log(email);
  try {
    const adminUser = await User.findOne({email:email});
    // console.log("Admin ", adminUser);
    if (adminUser.role !== "admin") {
      throw new Error(`You are not an Admin`);
    } else {
      next();
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { authMiddleware, isAdmin };
