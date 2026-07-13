const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// Send a connection request: status is "interested" or "ignored"
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: `Invalid status type: ${status}` });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      if (fromUserId.equals(toUserId)) {
        return res.status(400).json({ message: "You cannot send a request to yourself" });
      }

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.status(400).json({ message: "A connection request already exists" });
      }

      const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status });
      const data = await connectionRequest.save();

      // Real-time notification via socket.io, if the target user is online
      const io = req.app.get("io");
      const onlineUsers = req.app.get("onlineUsers");
      const targetSocketId = onlineUsers?.get(toUserId.toString());
      if (io && targetSocketId && status === "interested") {
        io.to(targetSocketId).emit("newConnectionRequest", {
          fromUserId,
          firstName: req.user.firstName,
        });
      }

      res.status(201).json({
        message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Review a received request: status is "accepted" or "rejected"
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: `Invalid status type: ${status}` });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      const io = req.app.get("io");
      const onlineUsers = req.app.get("onlineUsers");
      const targetSocketId = onlineUsers?.get(connectionRequest.fromUserId.toString());
      if (io && targetSocketId && status === "accepted") {
        io.to(targetSocketId).emit("requestAccepted", {
          byUserId: loggedInUser._id,
          firstName: loggedInUser.firstName,
        });
      }

      res.status(200).json({ message: `Connection request ${status}`, data });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = requestRouter;
