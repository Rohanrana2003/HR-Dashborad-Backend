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
      lowercase: true,
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
      default:
        "https://drive.google.com/file/d/1Zp2_yTCqHpun2X1zY-if9ScoXa_QZH7V/view?usp=drive_link",
    },
    status: {
      type: String,
      enum: ["selected", "rejected", "applied", "ongoing", "new", "scheduled"],
      default: "applied",
    },
    department: {
      type: String,
      default: "To be Updated",
      lowercase: true,
    },
    dateOfJoining: {
      type: Date,
      default: () => new Date(), // Sets current date as default
    },
    attendanceStatus: {
      type: String,
      enum: ["present", "absent", "medical leave", "work from home"],
      default: "present",
      lowercase: true,
    },
  },
  {
    timestamps: true, // Optional: Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("Candidate", candidateSchema);
