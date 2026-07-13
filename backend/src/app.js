require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const connectDB = require("./config/database");
const initializeSocket = require("./utils/socket");

const authRouter = require("./routes/auth.router");
const profileRouter = require("./routes/profile.router");
const requestRouter = require("./routes/request.router");
const userRouter = require("./routes/user.router");
const chatRouter = require("./routes/chat.router");

const app = express();

const corsOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// Centralized error handler (catches anything thrown outside try/catch in routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const server = http.createServer(app);
const { io, onlineUsers } = initializeSocket(server, corsOrigins);
app.set("io", io);
app.set("onlineUsers", onlineUsers);

const PORT = process.env.PORT || 7777;

connectDB()
  .then(() => {
    console.log("Database connection established");
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
    process.exit(1);
  });

module.exports = app;
