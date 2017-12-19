"use strict";

const mongoose = require("mongoose");

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
  return next();
});

module.exports = mongoose.model("Message", MessageModel);
