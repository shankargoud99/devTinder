const express = require("express");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  res.status(200).json({ data: req.user });
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request - one or more fields are not editable");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((field) => {
      loggedInUser[field] = req.body[field];
    });

    await loggedInUser.save();

    res.status(200).json({
      message: `${loggedInUser.firstName}, your profile was updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---- Photo upload (Multer) ----
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "..", "uploads")),
  filename: (req, file, cb) => {
    const uniqueName = `${req.user._id}-${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPEG, PNG or WEBP images are allowed"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

profileRouter.post(
  "/profile/photo",
  userAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const photoUrl = `/uploads/${req.file.filename}`;
      req.user.photoUrl = photoUrl;
      await req.user.save();

      res.status(200).json({ message: "Photo uploaded successfully", data: req.user });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = profileRouter;
