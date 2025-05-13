const express = require("express");
const validCandidate = require("../middlewares/validateCandidate");
const Candidate = require("../models/Candidate");

const candidateRouter = express();

// to add a candidate
candidateRouter.post(
  "/candidates/addCandidate",
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

// Get all candidates
candidateRouter.get("/candidates", async (req, res) => {});
module.exports = candidateRouter;
