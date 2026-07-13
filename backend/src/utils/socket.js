const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const crypto = require("crypto");

const Chat = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// Deterministic room name for any pair of user ids
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server, corsOrigins) => {
  const io = new Server(server, {
    cors: {
      origin: corsOrigins,
      credentials: true,
    },
  });

  // Track userId -> socketId for direct notifications (connection requests, accepts, etc.)
  const onlineUsers = new Map();

  // Authenticate the socket connection using the same JWT cookie as the REST API
  io.use((socket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie;
      if (!rawCookie) return next(new Error("Authentication error: no cookie found"));

      const { token } = cookie.parse(rawCookie);
      if (!token) return next(new Error("Authentication error: no token found"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded._id;
      next();
    } catch (err) {
      next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", (socket) => {
    onlineUsers.set(socket.userId.toString(), socket.id);

    socket.on("joinChat", ({ targetUserId }) => {
      const roomId = getSecretRoomId(socket.userId, targetUserId);
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ targetUserId, text }) => {
      try {
        if (!text || !text.trim()) return;

        // Only allow messages between accepted connections
        const isConnected = await ConnectionRequest.findOne({
          status: "accepted",
          $or: [
            { fromUserId: socket.userId, toUserId: targetUserId },
            { fromUserId: targetUserId, toUserId: socket.userId },
          ],
        });
        if (!isConnected) {
          socket.emit("errorMessage", { message: "You are not connected with this user" });
          return;
        }

        const sender = await User.findById(socket.userId).select("firstName lastName photoUrl");

        let chat = await Chat.findOne({
          participants: { $all: [socket.userId, targetUserId] },
        });
        if (!chat) {
          chat = new Chat({ participants: [socket.userId, targetUserId], messages: [] });
        }

        chat.messages.push({ senderId: socket.userId, text: text.trim() });
        await chat.save();

        const roomId = getSecretRoomId(socket.userId, targetUserId);
        io.to(roomId).emit("messageReceived", {
          senderId: socket.userId,
          firstName: sender?.firstName,
          photoUrl: sender?.photoUrl,
          text: text.trim(),
          createdAt: new Date(),
        });
      } catch (err) {
        socket.emit("errorMessage", { message: err.message });
      }
    });

    socket.on("disconnect", () => {
      if (onlineUsers.get(socket.userId.toString()) === socket.id) {
        onlineUsers.delete(socket.userId.toString());
      }
    });
  });

  return { io, onlineUsers };
};

module.exports = initializeSocket;
