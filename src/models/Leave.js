const mongoose = require("mongoose");
const validator = require("validator");

const leaveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    lowercase: true,
  },
  document: {
    type: String,
    required: [true, "document is required"],
    validate: [validator.isURL, "Invalid Doc URL"], // Array of file paths or URLs
  },
});

module.exports = mongoose.model("Leave", leaveSchema);
