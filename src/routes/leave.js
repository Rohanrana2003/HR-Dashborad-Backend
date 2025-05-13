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

    res.json({
      message: "Leave created successfully",
      data: newLeave,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error in creating leave ",
      error: err.message,
    });
  }
});

//fetch Leaves API
leaveRouter.get("/leaves", userAuth, async (req, res) => {
  try {
    const leaves = await Leave.find({});

    if (!leaves || leaves.length === 0) {
      res.send("No leaves Data");
    }
    res.json({
      message: "Leaves fetched successfully",
      data: leaves,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error in fetching leaves ",
      error: err.message,
    });
  }
});

//updating leave status
leaveRouter.post("/leaves/:status/:leaveId", userAuth, async (req, res) => {
  try {
    const { status, leaveId } = req.params;

    const allowedStatus = ["approved", "rejected"];

    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid status");
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      {
        status: status,
      },
      { new: true, runValidators: true }
    );

    if (!updatedLeave) {
      throw new Error("Invalid Leave");
    }

    res.json({
      message: updatedLeave.name + " leave updated to " + status,
      data: updatedLeave,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error in Updating leave Status ",
      error: err.message,
    });
  }
});

module.exports = leaveRouter;
