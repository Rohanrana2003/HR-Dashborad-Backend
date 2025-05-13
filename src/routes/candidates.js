const express = require("express");
const validCandidate = require("../middlewares/validateCandidate");
const Candidate = require("../models/Candidate");
const { userAuth } = require("../middlewares/userAuth");

const candidateRouter = express();

// to add a candidate API
candidateRouter.post(
  "/candidates/addCandidate",
  userAuth,
  validCandidate,
  async (req, res) => {
    try {
      const { name, email, phone, position, experience, resumeUrl } = req.body;

      const candidate = new Candidate({
        name,
        email,
        phone,
        position,
        experience,
        resumeUrl,
      });

      const existingUser = await Candidate.findOne({ email: email }); // throwing error if user already exists
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const newCandidate = await candidate.save();
      res.json({ message: "Saved candidate successfully", data: newCandidate });
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
    const candidates = await Candidate.find({ status: { $ne: "Selected" } });

    res.json({ message: "Fteched candidates successfully", data: candidates });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error in fetching candidates", error: err.message });
  }
});

// Update status to selected API
candidateRouter.post(
  "/candidates/selected/:candidateId",
  userAuth,
  async (req, res) => {
    try {
      const { candidateId } = req.params;

      const newEmployee = await Candidate.findById(candidateId);

      if (!newEmployee) {
        throw new Error("Invalid Candidate");
      }

      newEmployee.status = "Selected";

      await newEmployee.save();

      res.json({
        message: "Fteched candidates successfully",
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
