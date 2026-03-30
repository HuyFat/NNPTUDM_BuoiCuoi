const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, required: true },
  to: { type: mongoose.Schema.Types.ObjectId, required: true },
  messageContent: {
    type: {
      type: String,
      enum: ["text", "file"],
      required: true
    },
    text: { type: String, required: true }
  }
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
