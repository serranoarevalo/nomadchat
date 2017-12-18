"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const MessageModel = new Schema({
  user: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  created_at: Date
});

MessageModel.pre("save", async function(next) {
  // Saving the 'this' into message
  const message = this;
  const currentDate = new Date();
  message.created_at = currentDate;
});

module.exports = mongoose.model("Chat", MessageModel);
