const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName age gender about skills photoUrl";

// Pending requests received by the logged-in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({
      toUserId: req.user._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.status(200).json({ message: "Pending requests fetched", data: requests });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// All accepted connections for the logged-in user
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: req.user._id, status: "accepted" },
        { fromUserId: req.user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) =>
      row.fromUserId._id.toString() === req.user._id.toString()
        ? row.toUserId
        : row.fromUserId
    );

    res.status(200).json({ message: "Connections fetched", data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Discover feed: paginated, excludes self / existing connections / pending requests
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    const existingConnections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const excludeUserIds = new Set();
    existingConnections.forEach((row) => {
      excludeUserIds.add(row.fromUserId.toString());
      excludeUserIds.add(row.toUserId.toString());
    });
    excludeUserIds.add(loggedInUser._id.toString());

    const users = await User.find({ _id: { $nin: Array.from(excludeUserIds) } })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json({ message: "Feed fetched", data: users, page, limit });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
