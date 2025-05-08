const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 10,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email Address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong Password: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 110,
    },
    gender: {
      type: String,
      lowercase: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not defined");
        }
      },
    },
    about: {
      type: String,
      default: "This is a user about dummy data",
      minLength: 30,
      maxLength: 300,
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsw40RqD54BYg7g04mBOm0f2k24h2hhn8-gg&s",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Enter a valid URL: " + value);
        }
      },
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 25) {
          throw new Error("Maximum 25 skills are allowed");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
