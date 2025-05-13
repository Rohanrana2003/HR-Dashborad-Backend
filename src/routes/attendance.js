const express = require("express");
const Candidate = require("../models/Candidate");
const { userAuth } = require("../middlewares/userAuth");
const attendanceRouter = express();

// getting Attendace data API
attendanceRouter.get("/employees/attendance", userAuth, async (req, res) => {
  try {
    const employees = await Candidate.find({ status: "Selected" });

    if (!employees) {
      res.json({ message: "No employees to show in attendance" });
    }

    res.json({
      message: "Fetched attendance data successfully",
      data: employees,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error in fetching employees attendance",
      error: err.message,
    });
  }
});

// Updating attendance status API
attendanceRouter.patch(
  "/employees/attendance/:status/:employeeId",
  userAuth,
  async (req, res) => {
    try {
      const { status, employeeId } = req.params;

      const allowedStatus = [
        "present",
        "absent",
        "medical leave",
        "work from home",
      ];

      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status");
      }

      const updatedEmployee = await Candidate.findByIdAndUpdate(
        employeeId,
        {
          attendanceStatus: status,
        },
        { new: true, runValidators: true }
      );

      if (!updatedEmployee) {
        throw new Error("Invalid employee");
      }

      res.json({
        message: updatedEmployee.name + " attendance updated to " + status,
        data: updatedEmployee,
      });
    } catch (err) {
      res.status(400).json({
        message: "Error in Updating attendance Status ",
        error: err.message,
      });
    }
  }
);

module.exports = attendanceRouter;
