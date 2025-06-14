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
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  document: {
    type: String,
    required: [true, "document is required"],
  },
});

// to prevent from duplicate leaves
leaveSchema.index({ name: 1, department: 1, date: 1 }, { unique: true });
module.exports = mongoose.model("Leave", leaveSchema);
