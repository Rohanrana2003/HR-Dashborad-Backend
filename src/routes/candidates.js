const express = require("express");
const { validCandidate } = require("../middlewares/validateData");
const Candidate = require("../models/Candidate");
const { userAuth } = require("../middlewares/userAuth");
const upload = require("../middlewares/upload");

const candidateRouter = express.Router();

// to add a candidate API
candidateRouter.post(
  "/candidates/addCandidate",
  userAuth,
  upload.single("resume"), // multer middleware to handle file upload
  validCandidate,
  async (req, res) => {
    try {
      const { name, email, phone, position, experience } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "Resume is required" });
      }

      const resumeUrl = `${req.protocol}://${req.get("host")}/api/uploads/${
        req.file.filename
      }`; // Create the URL for the uploaded file

      // const resumeUrl = `/uploads/${req.file.filename}`; // Create the URL for the uploaded file

      const newCandidate = new Candidate({
        name,
        email,
        phone,
        position,
        experience,
        resumeUrl, // Store the resume URL in the database
      });

      const existingUser = await Candidate.findOne({ email: email }); // throwing error if user already exists
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      await newCandidate.save();

      res.status(201).json({
        message: "Saved candidate successfully",
        data: newCandidate,
      });
    } catch (err) {
      res
        .status(400)
        .json({ message: "Error in saving candidate", error: err.message });
    }
  }
);

// Get all candidates API
candidateRouter.get("/candidates", userAuth, async (req, res) => {
  try {
    const candidates = await Candidate.find({ status: { $ne: "selected" } });
    if (candidates.length === 0) {
      return res.json({ message: "No candidates found" });
    }

    res.json({ message: "Fteched candidates successfully", data: candidates });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error in fetching candidates", error: err.message });
  }
});

// Update status to selected API
candidateRouter.patch(
  "/candidates/:status/:candidateId",
  userAuth,
  async (req, res) => {
    try {
      const { status, candidateId } = req.params;

      const allowedStatus = [
        "selected",
        "rejected",
        "applied",
        "ongoing",
        "new",
        "scheduled",
      ];

      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status");
      }

      const newEmployee = await Candidate.findByIdAndUpdate(
        candidateId,
        {
          status: status,
        },
        { new: true, runValidators: true }
      );

      if (!newEmployee) {
        throw new Error("Invalid Candidate");
      }
      // if (newEmployee.status === status) {
      //   return res.send(newEmployee.name + " is already an employee"); // Checking i candidate is already an employee
      // }

      // newEmployee.status = status;

      // await newEmployee.save();

      res.json({
        message: newEmployee.name + " is " + status,
        data: newEmployee,
      });
    } catch (err) {
      res.status(400).json({
        message: "Error in moving candidate to employee",
        error: err.message,
      });
    }
  }
);
module.exports = candidateRouter;
