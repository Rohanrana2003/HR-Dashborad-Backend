const express = require("express");
const resumeRouter = express.Router();
const upload = require("../middlewares/upload");
const Candidate = require("../models/Candidate");

resumeRouter.post(
  "/upload-resume",
  upload.single("resume"),
  async (req, res) => {
    try {
      const { name, designation } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const resumeUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;

      const candidate = await Candidate.create({
        name,
        designation,
        resumeUrl,
      });

      res.status(201).json({ message: "Resume uploaded", candidate });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = resumeRouter;
