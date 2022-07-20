import mongoose from "mongoose";
const { Schema, model } = require("mongoose");

const userSchema = new Schema(  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 9,
    },
    profilePicture: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxLength: 450,
    },
    address: {
      type: String,
      required: true,
    },
    hasChildren: {
      type: Boolean,
      default: false,
      required: true,
    },
    hasExperience: {
      type: Boolean,
      default: false,
      required: true,
    },
    hasPets: {
      type: Boolean,
      default: false,
      required: true,
    },
    matches: [
      {
        type: Schema.Types.ObjectId,
        ref: "Dog",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
