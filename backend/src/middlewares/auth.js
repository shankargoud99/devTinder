const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Please login to continue" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decoded;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ message: "User not found, please login again" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired session, please login again" });
  }
};

module.exports = { userAuth };
