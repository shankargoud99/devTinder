const express = require("express");
const authRouter = express.Router();

const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const user = new User({ firstName, lastName, emailId, password });
    await user.save();

    const token = user.getJWT();
    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(201).json({ message: "Account created successfully", data: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.getJWT();
    res.cookie("token", token, COOKIE_OPTIONS);

    res.status(200).json({ message: "Login successful", data: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { ...COOKIE_OPTIONS, maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = authRouter;
