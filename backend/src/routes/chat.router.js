const express = require("express");
const chatRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

// Fetch (or lazily create) the chat/message history between the logged-in user and targetUserId
chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    // Only allow chatting with accepted connections
    const isConnected = await ConnectionRequest.findOne({
      status: "accepted",
      $or: [
        { fromUserId: userId, toUserId: targetUserId },
        { fromUserId: targetUserId, toUserId: userId },
      ],
    });

    if (!isConnected) {
      return res.status(403).json({ message: "You are not connected with this user" });
    }

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    })
      .populate("participants", "firstName lastName photoUrl")
      .populate("messages.senderId", "firstName lastName photoUrl");

    if (!chat) {
      chat = new Chat({ participants: [userId, targetUserId], messages: [] });
      await chat.save();
    }

    res.status(200).json({ data: chat });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = chatRouter;
