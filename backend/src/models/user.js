const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: 50,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: (props) => `${props.value} is not a valid email address`,
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          // Only enforce strength on plain-text creation (not on already-hashed re-saves)
          if (!this.isModified("password")) return true;
          return validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
          });
        },
        message:
          "Password must be at least 8 characters and include uppercase, lowercase and a number",
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender",
      },
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate: {
        validator: (value) => validator.isURL(value) || value.startsWith("/uploads/"),
        message: "Invalid photo URL",
      },
    },
    about: {
      type: String,
      default: "This is a default about section of the user!",
      maxLength: 500,
    },
    skills: {
      type: [String],
      validate: {
        validator: (value) => value.length <= 15,
        message: "You can add up to 15 skills only",
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving, only if modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance method: generate JWT
userSchema.methods.getJWT = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Instance method: validate a plain-text password against the stored hash
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  return bcrypt.compare(passwordInputByUser, this.password);
};

// Never leak password hash in JSON responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
