const mongoose = require("mongoose");
const validator = require("validator");

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Candidate name is required"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Candidate email is required"],
      trim: true,
      validate: [validator.isEmail, "Invalid email format"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: (v) => validator.isMobilePhone(v, "any"),
        message: "Invalid phone number",
      },
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      enum: ["Intern", "Full Time", "Senior", "Junior", "Team Lead"],
    },
    experience: {
      type: Number,
      required: [true, "Experience is required"],
      min: [0, "Experience cannot be less than 0"],
    },
    resumeUrl: {
      type: String,
      required: [true, "Resume is required"],
      validate: [validator.isURL, "Invalid resume URL"],
    },
    status: {
      type: String,
      enum: ["Applied", "Selected", "Rejected"],
      default: "Applied",
    },
    department: {
      type: String,
      default: "To be Updated",
    },
    dateOfJoining: {
      type: Date,
      default: null, // Set this when status is updated to "Selected"
    },
    attendanceStatus: {
      type: String,
      enum: [
        "Not Marked",
        "Present",
        "Absent",
        "Medical Leave",
        "Work from Home",
      ],
      default: "Not Marked",
    },
  },
  {
    timestamps: true, // Optional: Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Candidate", candidateSchema);
