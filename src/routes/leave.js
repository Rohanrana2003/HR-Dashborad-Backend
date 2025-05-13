const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const Candidate = require("../models/Candidate");
const Leave = require("../models/Leave");
const leaveRouter = express();

// create a leave API
leaveRouter.post("/leave/create", userAuth, async (req, res) => {
  try {
    const { name, date, department, reason, document } = req.body;

    const candidate = await Candidate.findOne({ name, department });

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    if (candidate.attendanceStatus !== "present") {
      return res
        .status(400)
        .json({ error: "Leave can only be created for present candidates" });
    }
    const newLeave = new Leave({
      name,
      department,
      date,
      reason,
      document,
    });

    await newLeave.save();

    res.status(201).json({
      message: "Leave created successfully",
      data: newLeave,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error in Updating attendance Status ",
      error: err.message,
    });
  }
});

//get Leaves API

module.exports = leaveRouter;
